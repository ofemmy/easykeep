import prisma from "../prisma";
import {
  Transaction,
  TransactionType,
  TrxFrequency,
  Prisma,
} from "@prisma/client";
import sql from "sql-template-tag";
import getFilterClause from "./getFilterClause";
import { DateTime } from "luxon";
import mapToTransactionModel from "../../lib/mapToTransactionModel";

// export async function createTransaction(data) {
//   const {
//     title,
//     amount,
//     entryDate,
//     frequency,
//     type,
//     category,
//     ownerId,
//     recurringFrom,
//     recurringTo,
//   } = data;

//   const query = sql`INSERT INTO "transactions" (title,amount,entry_date,frequency,type,category,owner_id,recurring_from,recurring_to) VALUES (${title},${amount},${entryDate},${frequency},${type},${category},${ownerId},${recurringFrom},${recurringTo}) RETURNING id`;
//   const { rows } = await DB.query(query.text, query.values);
//   return rows[0];
// }
// export async function createUser(data) {
//   const { name, email, password } = data;
//   const query = sql`INSERT INTO users (name,email,password) VALUES (${name},${email},${password}) RETURNING id,name,email`;
//   const { rows } = await DB.query(query.text, query.values);
//   return rows[0];
// }
// export async function findUserByEmail(email) {
//   const query = sql`SELECT * FROM users WHERE email = ${email}`;
//   const { rows } = await DB.query(query.text, query.values);
//   return rows[0];
// }

export async function fetchTransactions(queryOptions: {
  date: DateTime;
  limit: number;
  skip?: number;
  ownerId: number;
}) {
  const { date, limit, skip, ownerId } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterClause({ date });
  const result = await prisma.$queryRaw`SELECT * FROM transactions WHERE "ownerId" = ${ownerId} AND (${normalEntryFilter} OR ${recurringEntryFilter})`;
  return result;
}

export async function fetchRecentTransactions(queryOptions: {
  date: Date;
  howMany: number;
  ownerId: number;
}) {
  const { date, howMany, ownerId } = queryOptions;
  let filterClause = getFilterClause({ ownerId, date });
  let once = TrxFrequency.Once;
  let rec = TrxFrequency.Recurring;
  const res = await prisma.$queryRaw<
    Transaction[]
  >`SELECT * FROM transactions WHERE owner_id = ${ownerId} AND ((frequency = ${once} AND (DATE_TRUNC('month',entry_date,'utc') = DATE_TRUNC('month',${date}::date,'utc'))) OR (frequency = ${rec} AND (DATE_TRUNC('month',${date}::date,'utc') BETWEEN DATE_TRUNC('month',recurring_from,'utc') and DATE_TRUNC('month',recurring_to,'utc')))) ORDER BY entry_date DESC`;
  return res;
}
export async function fetchSum(queryOptions: { date: DateTime; ownerId: number }) {
  const { date, ownerId } = queryOptions;
  const { normalEntryFilter, recurringEntryFilter } = getFilterClause({ date });
  const result = await prisma.$queryRaw`SELECT type ,SUM(amount) FROM transactions WHERE "ownerId" = ${ownerId} AND (${normalEntryFilter} OR ${recurringEntryFilter})  GROUP BY type`;
  return parseSummary(result);
}
function parseSummary(summObj: { type: TransactionType; sum: number }[] = []) {
  const result = { totalIncome: 0.0, totalExpense: 0.0 };
  if (summObj.length == 0) {
    return result;
  }
  summObj.forEach((obj) => {
    if (obj.type === TransactionType.Expense) {
      result.totalExpense = obj.sum;
    } else {
      result.totalIncome = obj.sum;
    }
  });
  return result;
}


