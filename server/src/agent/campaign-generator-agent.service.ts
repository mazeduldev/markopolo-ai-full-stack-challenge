import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Agent, AgentOutputType, handoff, run, tool } from '@openai/agents';
import {
  CreateCampaignDto,
  CreateCampaignZodSchema,
} from '../campaign/dto/campaign.dto';
import { Observable } from 'rxjs';
import { StoreService } from 'src/store/store.service';
import z from 'zod';

@Injectable()
export class CampaignGeneratorAgentService implements OnModuleInit {
  private readonly logger = new Logger(CampaignGeneratorAgentService.name);

  private campaignGeneratorAgent: Agent<
    unknown,
    AgentOutputType<CreateCampaignDto>
  >;

  private insufficientDataResponderAgent: Agent<
    unknown,
    AgentOutputType<string>
  >;

  constructor(private readonly storeService: StoreService) {}

  onModuleInit() {
    this.insufficientDataResponderAgent = Agent.create({
      name: 'Insufficient Data Responder Agent',
      instructions: `You are an agent that responds to users when there is insufficient data to generate a marketing campaign.
      - Your task is to inform the user to check their store connection in plain text.
      `,
      outputType: 'text',
      model: 'gpt-5-nano',
      modelSettings: {
        reasoning: {
          effort: 'minimal',
        },
        text: {
          verbosity: 'low',
        },
      },
    });

    this.campaignGeneratorAgent = Agent.create({
      name: 'Campaign Generator Agent',
      instructions: `You are a marketing campaign generator agent.
      - Your task is to generate comprehensive marketing campaigns based on user input.
      - Fetch relevant data of the store using "fetch_store_data" tool and based on that data generate marketing campaign.
      - If the tool returns null, then handoff to "Insufficient Data Responder Agent".
      - If you get sufficient data for generating campaign, then provide the output in the specified JSON format.
      `,
      tools: [
        tool({
          name: 'fetch_store_data',
          description:
            'Fetches store data including products, customer demographics, and past marketing performance. Input is just the User ID.',
          parameters: z.object({
            userId: z.string().describe('The ID of the user'),
          }),
          execute: async ({ userId }) => {
            this.logger.log(`Fetching store data for input: ${userId}`);
            try {
              const storeData =
                await this.storeService.getStoreDataForCampaignCreation(userId);
              return storeData;
            } catch (error) {
              this.logger.error(
                `Error fetching store data for userId ${userId}: ${error.message}`,
              );
              return null;
            }
          },
        }),
      ],
      outputType: CreateCampaignZodSchema,
      model: 'gpt-5-nano',
      modelSettings: {
        reasoning: {
          effort: 'minimal',
        },
        text: {
          verbosity: 'low',
        },
      },
      handoffs: [handoff(this.insufficientDataResponderAgent)],
    });
  }

  private isStringOutput(output: unknown): output is string {
    return typeof output === 'string';
  }

  async generateCampaign(
    prompt: string,
    userId: string,
  ): Promise<CreateCampaignDto | string> {
    this.logger.log(`Generating campaign for prompt: ${prompt}`);
    const result = await run(
      this.campaignGeneratorAgent,
      `${prompt}\nUser ID: ${userId}`,
    );

    if (this.isStringOutput(result.finalOutput)) {
      return result.finalOutput;
    }

    this.logger.log(
      `Campaign generated successfully for user: ${userId}. Output: ${JSON.stringify(
        result.finalOutput,
      )}`,
    );
    return result.finalOutput as CreateCampaignDto;
  }

  generateCampaignStream(prompt: string, userId: string): Observable<any> {
    this.logger.log(`Generating streaming campaign for prompt: ${prompt}`);

    return new Observable((observer) => {
      const runStream = async () => {
        try {
          const stream = await run(
            this.campaignGeneratorAgent,
            `${prompt}\nUser ID: ${userId}`,
            {
              stream: true,
            },
          );

          const textStream = stream.toTextStream();

          for await (const chunk of textStream) {
            observer.next({ data: chunk });
          }

          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };

      runStream();
    });
  }
}
