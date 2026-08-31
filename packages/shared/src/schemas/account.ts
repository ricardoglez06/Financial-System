import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z
    .enum(["CHECKING", "SAVINGS", "CASH", "CREDIT", "INVESTMENT"])
    .default("CHECKING"),
  balance: z.number().min(0).default(0),
  currency: z.string().length(3).default("USD"),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
