import { QueryFilter } from "../lib/getFilterQuery";
import prisma from "../prisma";
import { Transaction, Prisma, TrxFrequency } from "@prisma/client";
import { QueryOptions } from "../../types/QueryOptions";
import { parseSum } from "../lib/parseSum";

export async function fetchIncomes(queryOptions: QueryOptions) {
  const { ownerId, limit, skip, date } = queryOptions;
  return await prisma.$queryRaw`SELECT * FROM non_recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringAt(
    date
  )} UNION SELECT * FROM recurring_incomes WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringAt(
    date
  )} ORDER BY "entryDate" DESC LIMIT ${limit} OFFSET ${skip}`;
}
export async function fetchAllExpenses(queryOptions: QueryOptions) {
  const { whereClause } = queryOptions;
  return await prisma.$queryRaw`SELECT * FROM expenses WHERE ${whereClause}`;
}
export async function fetchRecurringIncomes(queryOptions: QueryOptions) {
  return await prisma.$queryRaw`SELECT * FROM recurring_incomes`;
}
export async function fetchNonRecurringIncomes(queryOptions: QueryOptions) {}
export async function fetchRecurringExpenses(queryOptions: QueryOptions) {}
export async function fetchNonRecurringExpenses(queryOptions: QueryOptions) {}
