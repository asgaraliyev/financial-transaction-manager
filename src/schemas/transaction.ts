import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  date: z.date(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number(),
  to:z.string(),
});

export const TransactionInputSchema = TransactionSchema.omit({ id: true });

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionInput = z.infer<typeof TransactionInputSchema>;