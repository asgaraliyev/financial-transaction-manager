import { create } from 'zustand';
import { z } from 'zod';
import { Transaction, TransactionSchema } from '../schemas/transaction';

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => {
    const validatedTransactions = z
      .array(TransactionSchema)
      .parse(transactions);
    set({ transactions: validatedTransactions });
  },
  addTransaction: (transaction) => {
    const validatedTransaction = TransactionSchema.parse(transaction);
    set((state) => ({
      transactions: [...state.transactions, validatedTransaction],
    }));
  },
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  updateTransaction: (id, updatedTransaction) => {
    const partialSchema = TransactionSchema.partial();
    const validatedUpdate = partialSchema.parse(updatedTransaction);
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...validatedUpdate } : t
      ),
    }));
  },
}));