import { z } from "zod";

export const ExcelRowSchema = z.object({
  Date: z.string(),
  Description: z.string(),
  Amount: z.string().transform((val) => parseFloat(val)),
  Category: z.string().optional(),
  Reference: z.string().optional(),
});

export type ExcelRow=z.infer<typeof ExcelRowSchema>