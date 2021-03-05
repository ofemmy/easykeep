import { TransactionType } from "@prisma/client";

export default function getTransactionType(query: string) {
  let result;
  if (query.toLowerCase() == "income") {
    result = TransactionType.Income;
  } else if (query.toLowerCase() == "expense") {
    result = TransactionType.Expense;
  } else {
    throw new Error("Invalid argument");
  }
  return result;
}
