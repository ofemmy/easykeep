import TransactionType from "../types/TransactionType";
export default function getTransactionType(query: string) {
  let result;
  if (query == "income") {
    result = TransactionType.INCOME;
  } else if (query == "expense") {
    result = TransactionType.EXPENSE;
  } else {
    throw new Error("Invalid argument");
  }
  return result;
}
