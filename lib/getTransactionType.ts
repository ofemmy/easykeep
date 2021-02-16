import TransactionType from "../types/TransactionType";
export default function getTransactionType(query: string) {
  let result;
  if (query.toLowerCase() == "income") {
    result = TransactionType.INCOME;
  } else if (query.toLowerCase() == "expense") {
    result = TransactionType.EXPENSE;
  } else {
    throw new Error("Invalid argument");
  }
  return result;
}
