import z from "zod";

export const createStoreDtoZodSchema = z.object({
  name: z.string().min(1).max(255),
  url: z
    .string()
    .url()
    .max(255)
    .or(z.literal("").transform(() => undefined)),
  currency: z.string().max(10).default("USD"),
  timezone: z.string().max(50).default("UTC"),
});

export type CreateStoreDtoType = z.infer<typeof createStoreDtoZodSchema>;

export interface ShopDto {
  id: string;
  user_id: string;
  name: string;
  url: string;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}
