import { Prisma, TrxFrequency } from "@prisma/client";

export default function getFilterClause(filterOptions) {
  const { ownerId, date } = filterOptions;
  let once = TrxFrequency.Once;
  let rec = TrxFrequency.Recurring;
  return Prisma.sql`"ownerId" = ${ownerId} AND ( (frequency = ${once} AND (date_trunc('month',"entryDate",'utc') = date_trunc('month',${date}::date,'utc'))) OR (frequency = ${rec} AND (date_trunc('month',${date}::date,'utc') BETWEEN date_trunc('month',"recurringFrom",'utc') AND date_trunc('month',"recurringTo",'utc'))) )`;
}
