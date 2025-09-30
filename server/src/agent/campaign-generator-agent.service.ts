import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Agent, AgentOutputType, run } from '@openai/agents';
import {
  CampaignOutputType,
  campaignOutputZodSchema,
} from './campaign-generator.types';
import { Observable } from 'rxjs';

@Injectable()
export class CampaignGeneratorAgentService implements OnModuleInit {
  private readonly logger = new Logger(CampaignGeneratorAgentService.name);

  private campaignGeneratorAgent: Agent<
    unknown,
    AgentOutputType<CampaignOutputType>
  >;

  onModuleInit() {
    this.campaignGeneratorAgent = new Agent({
      name: 'Campaign Generator Agent',
      instructions: `You are a helpful agent specialized in creating marketing campaigns.
      Your task is to generate comprehensive marketing campaigns based on user input.
      You should fetch relevant data using your available tools and compile it into a structured campaign format.
      Always ensure that the campaigns you create are tailored to the user's needs and objectives.`,
      tools: [],
      outputType: campaignOutputZodSchema,
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
  }

  async generateCampaign(prompt: string): Promise<CampaignOutputType> {
    this.logger.log(`Generating campaign for prompt: ${prompt}`);
    const result = await run(this.campaignGeneratorAgent, prompt);
    return result.finalOutput as CampaignOutputType;
  }

  generateCampaignStream(prompt: string): Observable<any> {
    this.logger.log(`Generating streaming campaign for prompt: ${prompt}`);

    return new Observable((observer) => {
      const runStream = async () => {
        try {
          const stream = await run(this.campaignGeneratorAgent, prompt, {
            stream: true,
          });

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
