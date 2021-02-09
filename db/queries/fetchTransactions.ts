import { model } from "mongoose";
import { ITransaction, ITransactionModel } from "../types/ITransaction";
type QueryOption = {
  model: ITransactionModel;
  filter: any;
  exclude?: string[];
  queryOptions: { limit: number; skip: number; sort: any };
  withAggregate: boolean;
};
type Result = {
    transactions:ITransaction[],
    summary:{totalIncome?:number,totalExpense?:number}
}
export const fetchTransactions = async (options: QueryOption):Promise<Result> => {
    let totals;
  const { model, filter, exclude, queryOptions, withAggregate } = options;
  try {
    const transactions = await model
      .find(filter, exclude ? exclude.join(" ") : null, queryOptions)
      .lean();
      
    if (withAggregate) {
      totals = await model.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]);
    }
    return {transactions,summary:parseSummary(totals)}
  } catch (error) {
    return error;
  }
};
function parseSummary(summObj: { _id: "INCOME" | "EXPENSE"; total: number }[]=[]) {
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
// const transactions = await TransactionModel.find(
//     filter,
//     "-__v",
//     options
//   ).lean();
// const totals = await TransactionModel.aggregate([
//     { $match: filter },
//     { $group: { _id: "$type", total: { $sum: "$amount" } } },
//   ]);
