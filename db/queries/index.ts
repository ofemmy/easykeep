import prisma from "../prisma";
import { Transaction, TransactionType, Prisma } from "@prisma/client";
import getFilterClause from "./getFilterClause";
export async function fetchRecentTransactions(queryOptions: {
  date: Date;
  howMany: number;
  ownerId: number;
}) {
  const { date, howMany, ownerId } = queryOptions;
  let filterClause = getFilterClause({ ownerId, date });
  const res = await prisma.$queryRaw<
    Transaction[]
  >`SELECT * FROM "Transaction" WHERE ${filterClause} LIMIT ${howMany}`;
  return res;
}
export async function fetchSum(queryOptions: { date: Date; ownerId: number }) {
  const { date, ownerId } = queryOptions;
  const filterClause = getFilterClause({ ownerId, date });
  const result = await prisma.$queryRaw`SELECT type,SUM(amount) FROM "Transaction" WHERE ${filterClause} GROUP BY type`;
  return parseSummary(result);
}
function parseSummary(summObj: { type: TransactionType; sum: number }[] = []) {
  const result = { totalIncome: 0.0, totalExpense: 0.0 };
  if (summObj.length == 0) {
    return result;
  }
  summObj.forEach((obj) => {
    if (obj.type === TransactionType.Expense) {
      result.totalExpense = obj.sum;
    } else {
      result.totalIncome = obj.sum;
    }
  });
  return result;
}
