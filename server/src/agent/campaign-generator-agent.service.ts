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

  private triageAgent: Agent<unknown, AgentOutputType<string>>;

  private campaignGeneratorAgent: Agent<
    unknown,
    AgentOutputType<CreateCampaignDto>
  >;

  private insufficientDataResponderAgent: Agent<
    unknown,
    AgentOutputType<string>
  >;

  private contextCollectorAgent: Agent<unknown, AgentOutputType<string>>;

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

    this.contextCollectorAgent = Agent.create({
      name: 'Context Collector Agent',
      instructions: `You are a context collector agent.
      - Your task is to gather additional context from the user to aid in marketing campaign generation.
      - Ask relevant questions to understand the user's business, target audience, and marketing goals.
      - Provide the output in plain text format.
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
              this.logger.log(
                `Fetched store data for userId ${userId}: ${JSON.stringify(storeData)}`,
              );
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

    this.triageAgent = Agent.create({
      name: 'Triage Agent',
      instructions: `You are a triage agent.
      - Your task is to determine if the user is directly asking for a marketing campaign.
      - If they are, handoff to "Campaign Generator Agent".
      - If they are not, handoff to "Context Collector Agent".
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
      handoffs: [
        handoff(this.contextCollectorAgent),
        handoff(this.campaignGeneratorAgent),
      ],
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
    const result = await run(this.triageAgent, `${prompt}\nUser ID: ${userId}`);

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

  generateCampaignStream(
    prompt: string,
    userId: string,
  ): Observable<{ data: string }> {
    this.logger.log(`Generating streaming campaign for prompt: ${prompt}`);

    return new Observable<{ data: string }>((observer) => {
      const runStream = async () => {
        try {
          const stream = await run(
            this.triageAgent,
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
