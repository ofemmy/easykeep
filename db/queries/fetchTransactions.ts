import { model } from "mongoose";
import { connectToDatabase } from "..";
import { ITransaction, ITransactionModel } from "../types/ITransaction";
import QueryOption from "../../types/QueryOption";
import prisma from "../prisma";
import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
type Result = {
  transactions: ITransaction[];
  summary: {
    totalIncome?: number;
    totalExpense?: number;
    totalRecurring?: number;
  };
  totalResults: number;
};
export const fetchTransactions = async (
  options: QueryOption
): Promise<Result> => {
  let totals;
  const { TransactionModel } = await connectToDatabase();
  const {
    filter,
    exclude = ["-__v"],
    queryOptions,
    withAggregate = true,
  } = options;
  try {
    const transactions = await TransactionModel.find(
      filter,
      exclude,
      queryOptions
    ).lean();
    const totalNumOfDocs = await TransactionModel.countDocuments(filter);

    if (withAggregate) {
      totals = await TransactionModel.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]);
    }
    return {
      transactions,
      summary: parseSummary(totals),
      totalResults: totalNumOfDocs,
    };
  } catch (error) {
    return error;
  }
};
function parseSummary(
  summObj: { type: TransactionType; sum: { amount: Decimal } }[] = []
) {
  const result = { totalIncome: 0.0, totalExpense: 0.0 };
  if (summObj.length == 0) {
    return result;
  }
  summObj.forEach((obj) => {
    if (obj.type === TransactionType.Expense) {
      result.totalExpense = Number(obj.sum.amount);
    } else {
      result.totalIncome = Number(obj.sum.amount);
    }
  });
  return result;
}
export const fetchTransactionsWithPrisma = async function (options: {
  skip: number;
  limit: number;
  ownerId: number;
  month: number;
}) {
  try {
    if (!options.month) {
      throw new Error("Please put in valid month and user id");
    }
    const filter = { month: options.month, ownerId: options.ownerId };
    const transactions = await prisma.transaction.findMany({
      where: filter,
      skip: options.skip,
      take: options.limit,
      orderBy: { date: "desc" },
    });
    const summary = await prisma.transaction.groupBy({
      by: ["type"],
      where: { month: options.month },
      sum: { amount: true },
    });
    const totalResults = await prisma.transaction.count({
      where: filter,
    });
    return { transactions, summary: parseSummary(summary), totalResults };
  } catch (error) {
    console.log(error);
  }
};
