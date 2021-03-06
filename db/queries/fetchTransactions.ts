import { TrxFrequency } from "@prisma/client";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";
import { getDateWithoutTimeZone } from "../../lib/useDate";
import { Transaction } from "../models/TransactionModel";
import prisma from "../prisma";

export default async function fetchTransactions(options: {
  ownerId: number;
  currentMonth: Date;
  numToTake: number;
}) {
  const { ownerId, currentMonth, numToTake } = options;
  // const transactions = await prisma.transaction.findMany({
  //   where: {
  //     OR: [
  //       {
  //         AND: [
  //           { frequency: TrxFrequency.OneTime },
  //           { entryDate: { gte: currentMonth } },
  //           { entryDate: { lt: addMonths(currentMonth, 1) } },
  //         ],
  //       },
  //       {
  //         AND: [
  //           { frequency: TrxFrequency.Recurring },
  //           { recurrenceDuration:{gte:entryDate+1} },

  //         ],
  //       },
  //     ],
  //     AND: { ownerId },
  //   },
  //   //take: numToTake,
  //   orderBy: { id: "asc" },
  // });
  let month2 = 4;
  let query = `SELECT * FROM "Transaction" WHERE "entry_date" BETWEEN date '2021-03-01' AND date '2021-03-01' + INTERVAL '${month2} Month' ORDER BY id ASC;`;
  //const trans2 = await prisma.$queryRaw`SELECT * FROM "Transaction" WHERE EXTRACT(MONTH FROM "isRecurringFrom") = 3;`;
  // const result = await prisma.$queryRaw`SELECT amount FROM "Transaction" WHERE entry  NOT BETWEEN ${start} and ${end} ORDER BY id ASC;`;
  //const result = await prisma.$queryRaw`SELECT * FROM "User" WHERE id = ${userId};`;
  // let test = await prisma.$queryRaw(
  //   "SELECT date_part('hour', timestamp '2002-09-17 19:27:45');"
  // );
  let month = 1;
  // let transactions = await prisma.$queryRaw`SELECT * FROM "Transaction" WHERE "entry_date" BETWEEN date '2021-03-01' AND date '2021-03-01' + INTERVAL '${month2} Month' ORDER BY id ASC;`;
  //SELECT * FROM "Transaction" WHERE ('frequency'="Once" AND DATE_TRUNC('month',${d}::date,'gmt')=DATE_TRUNC('month',entry_date))
  let d = new Date();
  let rec = TrxFrequency.Recurring;
  let once = TrxFrequency.Once;
  const test = await prisma.$queryRaw`SELECT * from "Transaction" WHERE ((frequency=${once} AND DATE_TRUNC('month',entry_date,'utc')=DATE_TRUNC('month',${d}::date,'utc')) OR (frequency=${rec} AND (date_trunc('month',${d}::date,'utc') BETWEEN date_trunc('month',recurring_from,'utc') AND date_trunc('month',recurring_to,'utc')))) ORDER BY entry_date DESC`;
  console.log(test);
  //trans2.forEach((t) => console.log(t.amount));
  return test;
}

// where: {
//   AND: [
//     { ownerId },
//     { entryDate: { gte: currentMonth } },
//     { entryDate: { lt: addMonths(currentMonth, 1) } },
//   ],
// },
