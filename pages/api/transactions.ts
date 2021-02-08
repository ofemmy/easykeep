import mongoose from "mongoose";
import { ExtendedResponse } from "./../../types/ExtendedApiResponse";
import { ExtendedRequest } from "./../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../middleware/auth";
import { connectToDatabase } from "../../db";
import { Transaction } from "../../db/models/TransactionModel";

const handler = nc<ExtendedRequest, ExtendedResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",msg: `${req.method} Not Allowed`,
    });
  },
});
handler
  .use(authMiddleWare)
  .get(async (req, res) => {
    const month = +req.query.month;
    const limit = +req.query.limit || 5;
    const skip = +req.query.skip;
    const options = {
      limit,
      skip: skip || 0,
      sort: { $natural: -1 },
    };
    const { TransactionModel } = await connectToDatabase();
    const ObjectId = mongoose.Types.ObjectId;
    const filter = { owner: ObjectId(req.user._id), month };
    try {
      const transactions = await TransactionModel.find(
        filter,
        "-__v",
        options
      ).lean();

      const totals = await TransactionModel.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]);
      res.status(200).json({
        msg: "success",
        data: { transactions, summary: parseSummary(totals) },
      });
    } catch (error) {
      res.status(500).json({ msg: "server error", data: null });
    }
  })
  .post(async (req, res) => {
    const { title, amount, isRecurring, category, date, type } = req.body;
    try {
      const { TransactionModel } = await connectToDatabase();
      const newTrx = await TransactionModel.create(
        new Transaction(
          title,
          amount,
          isRecurring,
          date,
          type,
          category,
          req.user._id
        )
      );
      res.status(201).json({ msg: "success", data: newTrx.toObject() });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
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
