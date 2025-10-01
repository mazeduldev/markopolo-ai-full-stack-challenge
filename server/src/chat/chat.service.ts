import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignGeneratorAgentService } from 'src/agent/campaign-generator-agent.service';
import { ChatThread } from './entities/chat-thread.entity';
import { ChatMessage, MessageRole } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { CampaignService } from 'src/campaign/campaign.service';
import { Observable, tap } from 'rxjs';
import { CreateCampaignZodSchema } from 'src/campaign/dto/campaign.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly campaignGeneratorAgentService: CampaignGeneratorAgentService,

    private readonly campaignService: CampaignService,

    @InjectRepository(ChatThread)
    private readonly chatThreadRepository: Repository<ChatThread>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async generateCampaign(prompt: string, userId: string) {
    // Create or get existing thread
    const thread = await this.getOrCreateThread(userId);

    // Save user message
    await this.saveMessage(thread.id, MessageRole.USER, prompt);

    // Generate campaign
    const agentResponse =
      await this.campaignGeneratorAgentService.generateCampaign(prompt, userId);

    if (typeof agentResponse === 'string') {
      // This is not a campaign object, just a message returned from the handoff agent
      const assistantMessage = await this.saveMessage(
        thread.id,
        MessageRole.ASSISTANT,
        agentResponse,
      );
      this.logger.log(
        `Handoff agent message saved with ID: ${assistantMessage.id}, thread ID: ${thread.id}, for user: ${userId}`,
      );
      return agentResponse;
    }

    // Save the campaign to the database
    const savedCampaign = await this.campaignService.saveCampaign(
      agentResponse,
      userId,
    );
    this.logger.log(
      `Campaign saved with ID: ${savedCampaign.id} for user: ${userId}`,
    );

    // Save assistant response
    const assistantMessage = await this.saveMessage(
      thread.id,
      MessageRole.ASSISTANT,
      JSON.stringify(agentResponse),
      savedCampaign.id,
    );
    this.logger.log(
      `Assistant message saved with ID: ${assistantMessage.id}, thread ID: ${thread.id}, for user: ${userId}`,
    );

    return agentResponse;
  }

  generateCampaignStream(prompt: string, userId: string) {
    let thread: ChatThread;
    let assistantMessage: ChatMessage;
    let fullResponse = '';

    return new Observable((observer) => {
      const initializeChat = async () => {
        // Create or get existing thread
        thread = await this.getOrCreateThread(userId);

        // Save user message
        await this.saveMessage(thread.id, MessageRole.USER, prompt);
      };

      const stream = this.campaignGeneratorAgentService.generateCampaignStream(
        prompt,
        userId,
      );

      initializeChat()
        .then(() => {
          stream
            .pipe(
              tap((chunk) => {
                fullResponse += chunk.data;
              }),
            )
            .subscribe({
              next: (chunk) => observer.next(chunk),
              error: (error) => observer.error(error),
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              complete: async () => {
                try {
                  const parsedResponse = JSON.parse(fullResponse);
                  const campaign =
                    CreateCampaignZodSchema.parse(parsedResponse);
                  if (campaign) {
                    // It's a valid campaign object
                    const savedCampaign =
                      await this.campaignService.saveCampaign(campaign, userId);
                    this.logger.log(
                      `Campaign saved with ID: ${savedCampaign.id} for user: ${userId}`,
                    );
                    assistantMessage = await this.saveMessage(
                      thread.id,
                      MessageRole.ASSISTANT,
                      JSON.stringify(campaign),
                      savedCampaign.id,
                    );
                    this.logger.log(
                      `Assistant message saved with ID: ${assistantMessage.id}, thread ID: ${thread.id}, for user: ${userId}`,
                    );
                  }
                } catch (e) {
                  // Not a valid JSON, likely a handoff message
                  assistantMessage = await this.saveMessage(
                    thread.id,
                    MessageRole.ASSISTANT,
                    fullResponse,
                  );
                  this.logger.log(
                    `Handoff agent message saved with ID: ${assistantMessage.id}, thread ID: ${thread.id}, for user: ${userId}`,
                  );
                }

                observer.complete();
              },
            });
        })
        .catch((error) => observer.error(error));
    });
  }

  private async getOrCreateThread(userId: string): Promise<ChatThread> {
    // Find the most recent active thread for the user
    let thread = await this.chatThreadRepository.findOne({
      where: { user_id: userId, is_active: true },
      order: { created_at: 'DESC' },
    });

    if (!thread) {
      // Create new thread
      thread = this.chatThreadRepository.create({
        thread_id: `thread_${Date.now()}_${userId}`, // Generate unique thread ID
        user_id: userId,
        is_active: true,
        title: 'Campaign Generation Chat',
      });
      thread = await this.chatThreadRepository.save(thread);
    }

    return thread;
  }

  private async saveMessage(
    threadId: string,
    role: MessageRole,
    content: string,
    campaignId?: string,
  ): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create({
      thread_id: threadId,
      role,
      content,
      campaign_id: campaignId,
    });

    return await this.chatMessageRepository.save(message);
  }

  async getChatHistory(userId: string): Promise<ChatThread[]> {
    return await this.chatThreadRepository.find({
      where: { user_id: userId },
      relations: ['messages'],
      order: { created_at: 'DESC' },
    });
  }
}
