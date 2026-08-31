import { z } from "zod";

export const investmentTypeSchema = z.enum([
  "ETF",
  "STOCK",
  "BOND",
  "CRYPTO",
  "MUTUAL_FUND",
  "OTHER",
]);

export const createInvestmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: investmentTypeSchema,
  ticker: z.string().optional(),
  principal: z.number().positive("Principal must be positive"),
  currentYield: z.number().default(0),
  currentValue: z.number().default(0),
  purchaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
});

export const updateInvestmentSchema = createInvestmentSchema.partial();

export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>;
