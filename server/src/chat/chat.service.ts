import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignGeneratorAgentService } from 'src/agent/campaign-generator-agent.service';
import { ChatThread } from './entities/chat-thread.entity';
import { ChatMessage, MessageRole } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { CampaignService } from 'src/campaign/campaign.service';
import { Observable, tap, map } from 'rxjs';
import {
  CreateCampaignDto,
  CreateCampaignZodSchema,
} from 'src/campaign/dto/campaign.dto';

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

  async generateCampaign(
    prompt: string,
    threadId: string | undefined,
    userId: string,
  ): Promise<{ threadId: string; content: string | CreateCampaignDto }> {
    // Create or get existing thread
    const thread = await this.getOrCreateThread(userId, threadId, prompt);

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
      return { threadId: thread.id, content: agentResponse };
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

    return { threadId: thread.id, content: agentResponse };
  }

  generateCampaignStream(
    prompt: string,
    threadId: string | undefined,
    userId: string,
  ): Observable<{ data: string; threadId: string }> {
    let assistantMessage: ChatMessage;
    let fullResponse = '';

    return new Observable<{ data: string; threadId: string }>((observer) => {
      const initializeChat = async () => {
        // Create or get existing thread
        const thread = await this.getOrCreateThread(userId, threadId, prompt);

        // Save user message
        await this.saveMessage(thread.id, MessageRole.USER, prompt);
        return thread;
      };

      const stream = this.campaignGeneratorAgentService.generateCampaignStream(
        prompt,
        userId,
      );

      initializeChat()
        .then((thread) => {
          observer.next({ data: '', threadId: thread.id }); // Initial empty message with threadId
          stream
            .pipe(
              tap((chunk) => {
                fullResponse += chunk.data;
              }),
              map((chunk: { data: string }) => ({
                data: chunk.data,
                threadId: '',
              })),
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

  private async getOrCreateThread(
    userId: string,
    threadId: string | undefined,
    prompt: string,
  ): Promise<ChatThread> {
    if (threadId) {
      const existingThread = await this.chatThreadRepository.findOne({
        where: { id: threadId, user_id: userId },
        relations: ['messages'],
      });
      if (existingThread) {
        // Load only the last 10 messages in descending order
        existingThread.messages = await this.chatMessageRepository.find({
          where: { thread_id: existingThread.id },
          order: { created_at: 'DESC' },
          take: 10,
        });
        return existingThread;
      }
      throw new NotFoundException('Chat thread not found');
    }

    // Create new thread
    let newThread = this.chatThreadRepository.create({
      user_id: userId,
      title: prompt.substring(0, 50), // First 50 chars of the prompt as title
    });
    newThread = await this.chatThreadRepository.save(newThread);

    return newThread;
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

  async getChatThreads(userId: string): Promise<ChatThread[]> {
    return await this.chatThreadRepository.find({
      where: { user_id: userId },
      // relations: ['messages'],
      order: { created_at: 'DESC' },
    });
  }

  async getChatThreadById(threadId: string, id: string): Promise<ChatThread> {
    const thread = await this.chatThreadRepository.findOne({
      where: { id: threadId, user_id: id },
      relations: ['messages'],
    });
    if (!thread) {
      throw new NotFoundException('Chat thread not found');
    }
    return thread;
  }
}
