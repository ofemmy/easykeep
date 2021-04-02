import { Transaction } from "@prisma/client";
import { DateTime } from "luxon";
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
    acc[currValue.category].totalSum += currValue.amount;
    acc[currValue.category].transactions = [
      ...acc[currValue.category].transactions,
      currValue,
    ];
    return acc;
  }, {});
  return res;
}
//[{ groceries: [1, 2, 3, 4] }];
