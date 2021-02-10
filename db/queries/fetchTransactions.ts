import { model } from "mongoose";
import { connectToDatabase } from "..";
import { ITransaction, ITransactionModel } from "../types/ITransaction";
type QueryOption = {
  filter: any;
  exclude?: string[];
  queryOptions: { limit: number; skip: number; sort: any };
  withAggregate?: boolean;
};
type Result = {
  transactions: ITransaction[];
  summary: { totalIncome?: number; totalExpense?: number };
  totalResults:number
};
export const fetchTransactions = async (
  options: QueryOption
): Promise<Result> => {
  let totals;
  const {TransactionModel} = await connectToDatabase();
  const {
    filter,
    exclude = ["-__v"],
    queryOptions,
    withAggregate = true,
  } = options;
  try {
    const transactions = await TransactionModel.find(filter, exclude, queryOptions).lean();
    const totalNumOfDocs = await TransactionModel.countDocuments(filter);

    if (withAggregate) {
      totals = await TransactionModel.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]);
    }
    return { transactions, summary: parseSummary(totals),totalResults:totalNumOfDocs };
  } catch (error) {
    return error;
  }
};
function parseSummary(
  summObj: { _id: "INCOME" | "EXPENSE"; total: number }[] = []
) {
  const result = { totalIncome: 0, totalExpense: 0 };
  if (summObj.length == 0) {
    return result;
  }
  summObj.forEach((obj) => {
    if (obj._id === "EXPENSE") {
      result.totalExpense = obj.total;
    } else {
      result.totalIncome = obj.total;
    }
  });
  return result;
}
