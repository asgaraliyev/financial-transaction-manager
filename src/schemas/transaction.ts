import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
  category: z.string(),
  reference: z.string(),
});

export const TransactionInputSchema = TransactionSchema.omit({ id: true });

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionInput = z.infer<typeof TransactionInputSchema>;