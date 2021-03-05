import mongoose from "mongoose";
import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { connectToDatabase } from "../../../db";
import prisma from "../../../db/prisma";
import { Transaction as Tr2 } from "../../../db/models/TransactionModel";
import fetchTransactions from "../../../db/queries/fetchTransactions";
import { getDateFromQuery } from "../../../lib/useDate";
import { Transaction, TrxFrequency } from "@prisma/client";
import fetchSum from "../../../db/queries/fetchSum";
import { startOfMonth, addMonths, parseISO } from "date-fns";
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
    const limit = 5;
    const currentMonth = getDateFromQuery(
      new Date().getFullYear(),
      Number(month)
    );
    console.log({ currentMonth });
    const ownerId = req.user.id;
    try {
      const recentTransactions = await fetchTransactions({
        ownerId: 1,
        numToTake: limit,
        currentMonth,
      });
      const transactionSum = {}; //await fetchSum(ownerId, currentMonth);
      res.status(200).json({
        msg: "success",
        data: {
          transactions: recentTransactions,
          summary: transactionSum,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
  .post(async (req, res) => {
    console.log("hi");
    const newPost: Transaction = req.body;
    newPost.ownerId = req.user.id;
    //TODO: Serverside validation
    try {
      if (newPost) {
        const newTrx = await prisma.transaction.create({ data: newPost });
        console.log(newTrx);
        res.status(201).json({ status: "success", data: newTrx });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", msg: "error occured on server" });
    }
  })
  // .post(async (req, res) => {
  //   const { title, amount, isRecurring, category, date, type } = req.body;
  //   try {
  //     const { TransactionModel } = await connectToDatabase();
  //     const ObjectId = mongoose.Types.ObjectId;
  //     const newTrx = await TransactionModel.create(
  //       new Transaction(
  //         title,
  //         amount,
  //         isRecurring,
  //         new Date(date),
  //         type,
  //         category,
  //         req.user._id
  //       )
  //     );
  //     res.status(201).json({ msg: "success", data: newTrx.toObject() });
  //   } catch (error) {
  //     res.status(500).json({ msg: "Server error" });
  //   }
  // })
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
