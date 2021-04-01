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

export async function fetchIncomes(queryOptions: QueryOptions) {
  const { ownerId, limit, skip, date, frequencyType } = queryOptions;
  const { recurringIncomeQuery, nonRecurringIncomeQuery } = getQuery(
    ownerId,
    date
  );
  const resultOptions = {
    async all() {
      return await prisma.$queryRaw`${recurringIncomeQuery} UNION ${nonRecurringIncomeQuery} ORDER BY "entryDate" DESC LIMIT ${limit} OFFSET ${skip}`;
    },
    async recurringOnly() {
      return await prisma.$queryRaw`${recurringIncomeQuery} LIMIT ${limit} OFFSET ${skip}`;
    },
    async nonRecurringOnly() {
      return await prisma.$queryRaw`${nonRecurringIncomeQuery} LIMIT ${limit} OFFSET ${skip}`;
    },
  };
  return await resultOptions[frequencyType]();
}
export async function fetchIncomeSum(ownerId, date) {
  const result = await prisma.$queryRaw`SELECT frequency,SUM(amount) FROM incomes WHERE ${QueryFilter.isOwner(
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
export async function fetchIncomeCount(
  ownerId,
  date,
  incomeType: "all" | "recurringOnly" | "nonRecurringOnly"
): Promise<number> {
  const totalCount = {
    async all() {
      return await prisma.$queryRaw`SELECT count(*) FROM incomes WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ((frequency=${TrxFrequency.Once} AND ${QueryFilter.nonRecurringAt(
        date
      )}) OR (frequency=${TrxFrequency.Recurring} AND ${QueryFilter.recurringAt(
        date
      )}))`;
    },
    async recurringOnly() {
      return await prisma.$queryRaw`SELECT COUNT(*) FROM recurring_incomes WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.recurringAt(date)}`;
    },
    async nonRecurringOnly() {
      return await prisma.$queryRaw`SELECT COUNT(*) FROM non_recurring_incomes WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.nonRecurringAt(date)}`;
    },
  };
  return await totalCount[incomeType]();
}

function getQuery(ownerId, date) {
  const recurringIncomeQuery = Prisma.sql`SELECT * FROM recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringAt(date)}`;
  const nonRecurringIncomeQuery = Prisma.sql`SELECT * FROM non_recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringAt(date)}`;
  return { recurringIncomeQuery, nonRecurringIncomeQuery };
}
