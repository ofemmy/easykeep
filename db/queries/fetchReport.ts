import { DateTime } from "luxon";
import { QueryFilter } from "../lib/getFilterQuery";
import prisma from "../prisma";
import { parseSum } from "../lib/parseSum";
import { Transaction, Prisma, TrxFrequency } from "@prisma/client";
type QueryOptions = {
  ownerId: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  trxType: "income" | "expense";
};
export async function fetchIncomeReport(queryOptions: QueryOptions) {
  const { ownerId, dateFrom, dateTo } = queryOptions;
  return await prisma.$queryRaw`SELECT * FROM non_recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringBetween(
    dateFrom,
    dateTo
  )} UNION SELECT * FROM recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringBetween(dateFrom, dateTo)}`;
}
export async function fetchExpenseReport(queryOptions: QueryOptions) {
  const { ownerId, dateFrom, dateTo } = queryOptions;
  return await prisma.$queryRaw`SELECT * FROM non_recurring_expenses WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringBetween(
    dateFrom,
    dateTo
  )} UNION SELECT * FROM recurring_expenses WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringBetween(dateFrom, dateTo)}`;
}
export async function fetchReport(
  queryOptions: QueryOptions
): Promise<Transaction[]> {
  const { ownerId, dateFrom, dateTo, trxType } = queryOptions;
  const resultObject = {
    async income() {
      return await prisma.$queryRaw`SELECT * FROM non_recurring_incomes WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.nonRecurringBetween(
        dateFrom,
        dateTo
      )} UNION SELECT * FROM recurring_incomes WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.recurringBetween(dateFrom, dateTo)}`;
    },
    async expense() {
      return await prisma.$queryRaw`SELECT * FROM non_recurring_expenses WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.nonRecurringBetween(
        dateFrom,
        dateTo
      )} UNION SELECT * FROM recurring_expenses WHERE ${QueryFilter.isOwner(
        ownerId
      )} AND ${QueryFilter.recurringBetween(dateFrom, dateTo)}`;
    },
  };
  return await resultObject[trxType]();
}
