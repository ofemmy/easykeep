import { DateTime } from "luxon";
import { QueryFilter } from "../lib/getFilterQuery";
import prisma from "../prisma";
import { parseSum } from "../lib/parseSum";
import { Transaction, Prisma, TrxFrequency } from "@prisma/client";
type QueryOptions = {
  ownerId: string;
  limit?: number;
  skip?: number;
  date: DateTime;
  frequencyType: "all" | "nonRecurringOnly" | "recurringOnly";
};
export async function fetchExpenses(queryOptions: QueryOptions) {
  const { ownerId, limit, skip, date, frequencyType } = queryOptions;
  const { recurringExpenseQuery, nonRecurringExpenseQuery } = getQuery(
    ownerId,
    date
  );
  const resultOptions = {
    async all() {
      return await prisma.$queryRaw`${recurringExpenseQuery} UNION ${nonRecurringExpenseQuery} ORDER BY "entryDate" DESC LIMIT ${limit} OFFSET ${skip}`;
    },
    async recurringOnly() {
      return await prisma.$queryRaw`${recurringExpenseQuery} LIMIT ${limit} OFFSET ${skip}`;
    },
    async nonRecurringOnly() {
      return await prisma.$queryRaw`${nonRecurringExpenseQuery} LIMIT ${limit} OFFSET ${skip}`;
    },
  };
  return await resultOptions[frequencyType]();
}
export async function fetchExpenseSum(ownerId, date) {
  const result = await prisma.$queryRaw`SELECT frequency,SUM(amount) FROM expenses WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ((frequency=${TrxFrequency.Once} AND ${QueryFilter.nonRecurringAt(
    date
  )}) OR (frequency=${TrxFrequency.Recurring} AND ${QueryFilter.recurringAt(
    date
  )})) GROUP BY frequency`;
  if (result.length == 0) {
    return { totalOnce: 0, totalRecurring: 0 };
  }
  return parseSum({
    data: result,
    key: "frequency",
    resultKeys: ["totalOnce", "totalRecurring"],
  });
}
export async function fetchExpenseCount(
  ownerId,
  date,
  freqType: "all" | "recurringOnly" | "nonRecurringOnly"
): Promise<number> {
  const totalCount = {
    async all() {
      return await prisma.$queryRaw`SELECT count(*) FROM expenses WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ((frequency=${TrxFrequency.Once} AND ${QueryFilter.nonRecurringAt(
        date
      )}) OR (frequency=${TrxFrequency.Recurring} AND ${QueryFilter.recurringAt(
        date
      )}))`;
    },
    async recurringOnly() {
      return await prisma.$queryRaw`SELECT COUNT(*) FROM recurring_expenses WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.recurringAt(date)}`;
    },
    async nonRecurringOnly() {
      return await prisma.$queryRaw`SELECT COUNT(*) FROM non_recurring_expenses WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.nonRecurringAt(date)}`;
    },
  };
  return await totalCount[freqType]();
}
function getQuery(ownerId, date) {
  const recurringExpenseQuery = Prisma.sql`SELECT * FROM recurring_expenses WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringAt(date)}`;
  const nonRecurringExpenseQuery = Prisma.sql`SELECT * FROM non_recurring_expenses WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringAt(date)}`;
  return { recurringExpenseQuery, nonRecurringExpenseQuery };
}
