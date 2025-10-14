import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Agent, AgentOutputType, handoff, run, tool } from '@openai/agents';
import {
  TCreateCampaign,
  CreateCampaignSchema,
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
    AgentOutputType<TCreateCampaign>
  >;

  private insufficientDataResponderAgent: Agent<
    unknown,
    AgentOutputType<string>
  >;

  private generalChatAgent: Agent<unknown, AgentOutputType<string>>;

  constructor(private readonly storeService: StoreService) {}

  onModuleInit() {
    this.insufficientDataResponderAgent = Agent.create({
      name: 'Insufficient Data Responder Agent',
      instructions: `You are an agent that responds to users when there is insufficient data to generate a marketing campaign.
      - Your task is to inform the user to check their store connection in plain text.
      `,
      handoffDescription:
        'Responds to users when there is insufficient data to generate a marketing campaign.',
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

    this.generalChatAgent = Agent.create({
      name: 'General Chat Agent',
      instructions: `You are a General Chat Agent.
      - Your task is to continue the conversation with the user in a friendly and engaging manner.
      - The user is not asking for a marketing campaign, so do not provide one.
      - Always encourage the user to generate marketing campaigns.
      - Provide the output in plain text format.
      `,
      handoffDescription:
        'Handles general chat when the user is not asking for a marketing campaign.',
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
      - To achieve your goal always focus on "right time, right channel, right message, for the right audience".
      `,
      handoffDescription:
        'Generates marketing campaigns based on user input and store data.',
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
      outputType: CreateCampaignSchema,
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
      - If they are asking to generate campaign, then handoff to "Campaign Generator Agent".
      - If they are not, then handoff to "General Chat Agent".
      - Do not generate any output yourself, always handoff to other agents.
      `,
      outputType: 'text',
      model: 'gpt-4o-mini', // gpt-5-nano performs poorly at triage
      handoffs: [
        handoff(this.generalChatAgent),
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
  ): Promise<TCreateCampaign | string> {
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
    return result.finalOutput as TCreateCampaign;
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

          this.logger.log(`Last Agent: ${stream.lastAgent?.name}`);
          const textStream = stream.toTextStream();

          for await (const chunk of textStream) {
            observer.next({ data: chunk });
          }

          this.logger.log(`Final Output: ${stream.finalOutput as string}`);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };

      runStream();
    });
  }
}
