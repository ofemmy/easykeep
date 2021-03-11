import mongoose from "mongoose";
import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { connectToDatabase } from "../../../db";
import prisma from "../../../db/prisma";
import { Transaction as Tr2 } from "../../../db/models/TransactionModel";
import { useDate } from "../../../lib/useDate";
import { Transaction, Prisma } from "@prisma/client";
import { startOfMonth, addMonths, addDays, isFirstDayOfMonth } from "date-fns";
import { fetchTransactions, fetchSum } from "../../../db/queries";
import { DateTime } from "luxon";
const handler = nc<ExtendedRequest, ExtendedResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler
  .use(authMiddleWare)
  .get(async (req, res) => {
    const month = +req.query.month;
    const year = +req.query.year;
    const limit = +req.query.limit;
    const date = useDate({ month, year });
    const ownerId = req.user.id;
    try {
      const data = await fetchTransactions({
        date,
        ownerId,
        limit,
      });
      const transactionSum = await fetchSum({ ownerId, date });
      res.status(200).json({
        msg: "success",
        data: {
          transactions: data,
          summary: transactionSum,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
  .post(async (req, res) => {
    const newPost: Transaction = req.body;
    newPost.ownerId = req.user.id;

    //TODO: Serverside validation
    try {
      if (newPost) {
        const newTrx = await prisma.transaction.create({ data: newPost });
        res.status(201).json({ status: "success", data: newTrx });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", msg: "error occured on server" });
    }
  })
  .put(async (req, res) => {
    const { title, amount, isRecurring, category, date, type, _id } = req.body;
    try {
      const { TransactionModel } = await connectToDatabase();
      const trx = await TransactionModel.findOne({ _id });
      if (!trx) {
        console.log("No trx with that id found");
        res.status(404).json({ status: "error", msg: "resource not found" });
      }
      trx.title = title;
      trx.amount = amount;
      trx.category = category;
      trx.date = date;
      trx.type = type;
      trx.isRecurring = isRecurring;
      await trx.save();
      res.status(200).json({ msg: "success" });
    } catch (error) {
      res.status(500).json({ status: "error" });
    }
  })
  .delete(async (req, res) => {
    const { _id } = req.body;
    const { TransactionModel } = await connectToDatabase();
    const trx = await TransactionModel.findOne({ _id });
    if (!trx) {
      res.status(404).json({ status: "error", msg: "resource not found" });
    }
    await trx.delete();
    res.status(200).json({});
  });
export default handler;

function parseSummary(summObj: { _id: "INCOME" | "EXPENSE"; total: number }[]) {
  const result = { totalIncome: 0, totalExpense: 0 };
  if (summObj.length == 0) {
    return result;
  }
  summObj.forEach((obj) => {
    if (obj._id === "EXPENSE") {
      result.totalExpense = obj.total;
    } else {
      result.totalIncome = obj.total;
    }
  });
  return result;
}
