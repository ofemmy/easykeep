import { TransactionType } from "@prisma/client";

export default function getTransactionType(query: string) {
  const result = {
    income: TransactionType.Income,
    expense: TransactionType.Expense,
  };
  return result[query];
}
