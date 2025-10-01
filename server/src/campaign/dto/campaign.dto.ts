import { z } from 'zod';

export enum ChannelType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WHATSAPP = 'whatsapp',
}

export const CreateCampaignZodSchema = z.object({
  campaign_title: z.string().describe('The title of the marketing campaign'),
  target_audience: z
    .string()
    .describe('A description of the target audience for the campaign'),
  message: z
    .object({
      headline: z.string().describe('The main headline of the campaign'),
      body: z.string().describe('The body text of the campaign message'),
      call_to_action: z
        .object({
          label: z
            .string()
            .describe('The label for the call to action button or link'),
          url: z
            .string()
            .describe('The URL that the call to action directs to'),
        })
        .describe('The call to action details'),
    })
    .describe('The main message of the campaign'),
  channels: z
    .array(z.nativeEnum(ChannelType))
    .describe(
      'The marketing channels to be used for the campaign (e.g., email, sms, push, whatsapp, etc.)',
    ),
  timeline: z
    .object({
      start_date: z
        .string()
        .describe('The start date of the campaign (YYYY-MM-DD)'),
      end_date: z
        .string()
        .describe('The end date of the campaign (YYYY-MM-DD)'),
    })
    .describe('The timeline for the campaign, including start and end dates'),
  budget: z.string().describe('The budget allocated for the campaign'),
  expected_metrics: z
    .object({
      open_rate: z
        .number()
        .describe(
          'The percentage of the target audience expected to see the notifications',
        ),
      click_rate: z
        .number()
        .describe(
          'The expected percentage of the target audience to click on links within the notifications',
        ),
      conversion_rate: z
        .number()
        .describe(
          'The percentage of the target audience expected to take a desired action (e.g., make a purchase, sign up)',
        ),
      roi: z
        .number()
        .describe('The return on investment expected from the campaign'),
    })
    .describe(
      'The metrics that will be used to measure the success of the campaign',
    ),
});

export const CreateCampaignWithUserZodSchema = CreateCampaignZodSchema.extend({
  user_id: z
    .string()
    .uuid()
    .describe('The ID of the user creating the campaign'),
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignZodSchema>;
export type CreateCampaignWithUserDto = z.infer<
  typeof CreateCampaignWithUserZodSchema
>;
