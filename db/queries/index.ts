import prisma from "../prisma";
import {
  Transaction,
  TransactionType,
  TrxFrequency,
  Prisma,
} from "@prisma/client";
import { camelCase, forOwn, keyBy } from "lodash";
import { getFilterQuery } from "./getFilterQuery";
import { DateTime } from "luxon";

export async function fetchTransactions(queryOptions: {
  date: DateTime;
  limit: number;
  skip?: number;
  ownerId: number;
}) {
  const { date, limit, skip, ownerId } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterQuery({ date });
  const result = await prisma.$queryRaw`SELECT * FROM transactions WHERE "ownerId" = ${ownerId} AND (${normalEntryFilter} OR ${recurringEntryFilter}) ORDER BY "entryDate" DESC LIMIT ${limit}`;
  return result;
}
export async function fetchTransactionsByType(queryOptions) {
  const { date, ownerId, limit = 10, skip = 0, trxType } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterQuery({ date });
  const transactions = await prisma.$queryRaw<
    Transaction[]
  >`SELECT * FROM transactions WHERE "ownerId" = ${ownerId} AND (type=${trxType}) AND (${normalEntryFilter} OR ${recurringEntryFilter}) ORDER BY "entryDate" DESC LIMIT ${limit} OFFSET ${skip} `;
  return transactions;
}
export async function fetchTransactionCount(queryOptions) {
  const { date, ownerId, trxType } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterQuery({ date });
  const totalCount = await prisma.$queryRaw`SELECT count(*) FROM transactions WHERE "ownerId" = ${ownerId} AND (type=${trxType}) AND (${normalEntryFilter} OR ${recurringEntryFilter})`;
  return totalCount[0].count;
}
export async function fetchRecentTransactions(queryOptions: {
  date: Date;
  howMany: number;
  ownerId: number;
}) {
  const { date, howMany, ownerId } = queryOptions;
  let filterClause = getFilterQuery({ ownerId, date });
  let once = TrxFrequency.Once;
  let rec = TrxFrequency.Recurring;
  const res = await prisma.$queryRaw<
    Transaction[]
  >`SELECT * FROM transactions WHERE owner_id = ${ownerId} AND ((frequency = ${once} AND (DATE_TRUNC('month',entry_date,'utc') = DATE_TRUNC('month',${date}::date,'utc'))) OR (frequency = ${rec} AND (DATE_TRUNC('month',${date}::date,'utc') BETWEEN DATE_TRUNC('month',recurring_from,'utc') and DATE_TRUNC('month',recurring_to,'utc')))) ORDER BY entry_date DESC`;
  return res;
}
export async function fetchSumByType(queryOptions: {
  date: DateTime;
  ownerId: number;
  trxType: TransactionType;
}) {
  const { date, ownerId, trxType } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterQuery({ date });
  const result = await prisma.$queryRaw`SELECT frequency,SUM(amount) FROM transactions WHERE "ownerId" = ${ownerId} AND (type=${trxType}) AND (${normalEntryFilter} OR ${recurringEntryFilter})  GROUP BY frequency`;
  return parseSummary({
    data: result,
    key: "frequency",
    resultKeys: ["totalOnce", "totalRecurring"],
  });
}
export async function fetchSum(queryOptions: {
  date: DateTime;
  ownerId: number;
}) {
  const { date, ownerId } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterQuery({ date });
  const result = await prisma.$queryRaw`SELECT type ,SUM(amount) FROM transactions WHERE "ownerId" = ${ownerId} AND (${normalEntryFilter} OR ${recurringEntryFilter})  GROUP BY type`;
  if (result.length == 0) {
    return { totalIncome: 0, totalExpense: 0 };
  }

  return parseSummary({
    data: result,
    key: "type",
    resultKeys: ["totalIncome", "totalExpense"],
  });
}
/**
   summary: [
    { frequency: 'Once', sum: 350 },
    { frequency: 'Recurring', sum: 1200 }
  ]
 */
// function parseSummary(summObj: { type: TransactionType; sum: number }[] = []) {
//   const result = { totalIncome: 0.0, totalExpense: 0.0 };
//   if (summObj.length == 0) {
//     return result;
//   }
//   summObj.forEach((obj) => {
//     if (obj.type === TransactionType.Expense) {
//       result.totalExpense = obj.sum;
//     } else {
//       result.totalIncome = obj.sum;
//     }
//   });
//   return result;
// }
function parseSummary({
  data,
  key,
  resultKeys,
}: {
  data: [];
  key: string;
  resultKeys: string[];
}) {
  let result = resultKeys.reduce((acc, curr) => ((acc[curr] = 0), acc), {});
  if (data.length == 0) {
    return result;
  }
  const d = {};
  data.forEach((obj) => {
    return (d[camelCase(`total ${obj[key]}`)] = obj["sum"]);
  });
  result = { ...result, ...d };
  return result;
}
