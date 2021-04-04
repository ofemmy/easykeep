import { Transaction } from "@prisma/client";
import { DateTime, Interval } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";
import { useDate } from "../../../lib/useDate";
import {
  fetchTransactionReport,
  fetchTransactionsByCategory,
} from "../../../db/queries";
import { fetchReport } from "../../../db/queries/fetchReport";
const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.post(
  withApiAuthRequired(async (req, res) => {
    const { trxType, fromDate, toDate } = req.body;
    const { user } = getSession(req, res);
    const ownerId = user.sub;
    const dateFrom = DateTime.fromJSDate(new Date(fromDate));
    const dateTo = DateTime.fromJSDate(new Date(toDate));
    console.log(dateFrom.toLocaleString(), dateTo.toLocaleString());
    try {
      const result = await fetchReport({
        dateFrom,
        dateTo,
        ownerId,
        trxType: trxType === "Income" ? "income" : "expense",
      });

      result.forEach((trx) =>
        getRecurringTransactionValidity({ dateFrom, dateTo, transaction: trx })
      );
      //console.log(result);
      res.status(200).send({ msg: "success", result: transformReport(result) });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
);
export default handler;

function transformReport(results: Transaction[]) {
  const res = results.reduce((acc, currValue) => {
    if (!acc[currValue.category]) {
      acc[currValue.category] = { totalSum: 0, transactions: [] };
    }
    acc[currValue.category].totalSum +=
      currValue.frequency === "Once"
        ? currValue.amount
        : currValue["multipliedTotal"];
    acc[currValue.category].transactions = [
      ...acc[currValue.category].transactions,
      currValue,
    ];
    return acc;
  }, {});
  return res;
}
function getRecurringTransactionValidity({
  dateFrom,
  dateTo,
  transaction,
}: {
  dateFrom: DateTime;
  dateTo: DateTime;
  transaction: Transaction;
}) {
  if (transaction.frequency === "Once") return transaction;
  let interval;
  const { recurringFrom, recurringTo } = transaction;
  const recFrom = DateTime.fromJSDate(new Date(recurringFrom));
  const recTo = DateTime.fromJSDate(new Date(recurringTo));
  //handle the 2 edge cases first
  if (
    (dateFrom < recFrom && dateTo.hasSame(recFrom, "day")) ||
    (dateFrom.hasSame(recTo, "day") && dateTo > recTo)
  ) {
    console.log("case 1");
    interval = 1;
  } else if (dateFrom <= recFrom) {
    console.log("case 2");
    interval = Math.min(
      Math.ceil(recTo.diff(recFrom, "months").toObject().months),
      Math.ceil(dateTo.diff(recFrom, "months").toObject().months)
    );
  } else if (dateFrom > recFrom && dateTo <= recTo) {
    console.log("case 3");
    interval = Math.ceil(dateTo.diff(dateFrom, "months").toObject().months);
  } else if (dateFrom > recFrom && dateTo > recTo) {
    console.log("case 4");
    interval = Math.ceil(recTo.diff(dateFrom, "months").toObject().months);
  } else {
    console.log("invalid case");
    interval = 19000;
  }
  // if (
  //   (dateFrom < recFrom && dateTo.hasSame(recFrom, "day")) ||
  //   (dateFrom.hasSame(recTo, "day") && dateTo > recTo)
  // ) {
  //   console.log("case 1 and 8");
  //   interval = 1;
  // } else if (dateFrom <= recFrom && dateTo > recFrom && dateTo < recFrom) {
  //   console.log("case 2 and 3");
  //   interval = Math.ceil(dateTo.diff(recFrom, "months").toObject().months);
  //   console.log(interval);
  // } else if (dateFrom.hasSame(recFrom, "day") && dateTo >= recTo) {
  //   console.log("case 4 and 5");
  //   interval = Math.ceil(recTo.diff(recFrom, "months").toObject().months);
  // } else if (dateFrom > recFrom && dateTo < recTo) {
  //   console.log("case 6");
  //   interval = Math.ceil(dateTo.diff(dateFrom, "months").toObject().months);
  // } else if (dateFrom > recFrom && dateTo >= recTo) {
  //   console.log("case 7");
  //   interval = Math.ceil(recTo.diff(dateFrom, "months").toObject().months);
  // } else {
  //   interval = 19000; //to signal error
  // }
  transaction["interval"] = interval;
  transaction["multipliedTotal"] = Number(transaction.amount) * interval;
}
