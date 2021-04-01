import { QueryFilter } from "../lib/getFilterQuery";
import prisma from "../prisma";
import { Transaction, Prisma, TrxFrequency } from "@prisma/client";
import { QueryOptions } from "../../types/QueryOptions";
import { parseSum } from "../lib/parseSum";
export async function fetchTransactions(queryOptions: QueryOptions) {
  const { ownerId, date, limit, skip } = queryOptions;
  const result = await prisma.$queryRaw<
    Transaction[]
  >` SELECT * FROM non_recurring_transactions WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.nonRecurringAt(
    date
  )} UNION SELECT * FROM recurring_transactions WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ${QueryFilter.recurringAt(
    date
  )} ORDER BY "entryDate" DESC LIMIT ${limit} OFFSET ${skip}`;
  return result;
}