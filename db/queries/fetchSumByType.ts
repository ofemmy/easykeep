import { DateTime } from "luxon";
import { QueryFilter } from "../lib/getFilterQuery";
import prisma from "../prisma";
import { TrxFrequency } from "@prisma/client";
import { parseSum } from "../lib/parseSum";
export async function fetchSumByType(queryOptions: {
  date: DateTime;
  ownerId: string;
}) {
  const { ownerId, date } = queryOptions;
  const result = await prisma.$queryRaw`SELECT type,SUM(amount) FROM transactions WHERE ${QueryFilter.isOwner(
    ownerId
  )} AND ((frequency=${TrxFrequency.Once} AND ${QueryFilter.nonRecurringAt(
    date
  )}) OR (frequency=${TrxFrequency.Recurring} AND ${QueryFilter.recurringAt(
    date
  )})) GROUP BY type`;
  if (result.length == 0) {
    return { totalIncome: 0, totalExpense: 0 };
  }
  return parseSum({
    data: result,
    key: "type",
    resultKeys: ["totalIncome", "totalExpense"],
  });
}
