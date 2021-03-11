import { Prisma } from "@prisma/client";
enum TrxFrequency {
  Once = "Once",
  Recurring = "Recurring",
}
export function getFilterQuery(filterOptions) {
  const { date } = filterOptions;
  let once = TrxFrequency.Once;
  let rec = TrxFrequency.Recurring;
  const d = date.toJSDate();
  let normalEntryFilter = Prisma.sql`frequency = ${once} AND (DATE_TRUNC('month',"entryDate",'utc') = DATE_TRUNC('month',${d}::date,'utc'))`;
  let recurringEntryFilter = Prisma.sql`frequency = ${rec} AND (DATE_TRUNC('month',${d}::date,'utc') BETWEEN DATE_TRUNC('month',"recurringFrom",'utc') and DATE_TRUNC('month',"recurringTo",'utc'))`;
  return { normalEntryFilter, recurringEntryFilter };
}
