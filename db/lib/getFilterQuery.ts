import { DateTime } from "luxon";
import { Prisma } from "@prisma/client";
enum TrxFrequency {
  Once = "Once",
  Recurring = "Recurring",
}
export function getFilterQuery(filterOptions) {
  const { date } = filterOptions;
  const once = TrxFrequency.Once;
  const rec = TrxFrequency.Recurring;
  const d = date.toJSDate();
  const normalEntryFilter = Prisma.sql`frequency = ${once} AND (DATE_TRUNC('month',"entryDate",'utc') = DATE_TRUNC('month',${d}::date,'utc'))`;
  const recurringEntryFilter = Prisma.sql`frequency = ${rec} AND (DATE_TRUNC('month',${d}::date,'utc') BETWEEN DATE_TRUNC('month',"recurringFrom",'utc') and DATE_TRUNC('month',"recurringTo",'utc'))`;
  return { normalEntryFilter, recurringEntryFilter };
}
export const QueryFilter = {
  isOwner(ownerId: string) {
    return Prisma.sql`"ownerId" = ${ownerId}`;
  },
  nonRecurringAt(date: DateTime) {
    return Prisma.sql`(DATE_TRUNC('month',"entryDate",'utc') = DATE_TRUNC('month',${date.toJSDate()}::date,'utc'))`;
  },
  recurringAt(date: DateTime) {
    return Prisma.sql`(DATE_TRUNC('month',${date.toJSDate()}::date,'utc') BETWEEN DATE_TRUNC('month',"recurringFrom",'utc') and DATE_TRUNC('month',"recurringTo",'utc'))`;
  },
  nonRecurringBetween(dateFrom: DateTime, dateTo: DateTime) {
    return Prisma.sql`DATE_TRUNC('day',${dateFrom.toJSDate()},'utc')<=DATE_TRUNC('day',"entryDate",'utc') AND DATE_TRUNC('day',${dateTo.toJSDate()},'utc') >= DATE_TRUNC('day',"entryDate",'utc')`;
  },
  recurringBetween(dateFrom: DateTime, dateTo: DateTime) {
    return Prisma.sql`DATE_TRUNC('day',"recurringFrom",'utc') <= DATE_TRUNC('day',${dateFrom.toJSDate()},'utc') AND DATE_TRUNC('day',"recurringTo",'utc') >= DATE_TRUNC('day',${dateTo.toJSDate()},'utc')`;
  },
};
