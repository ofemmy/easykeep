import mongoose from "mongoose";
import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { connectToDatabase } from "../../../db";
import { Transaction } from "../../../db/models/TransactionModel";
import { fetchTransactions } from "../../../db/queries/fetchTransactions";
import getQueryFilter from "../../../db/lib/QueryFilter";
import getQueryOptions from "../../../db/lib/QueryOptions";

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
    const limit = +req.query.limit;
    const skip = +req.query.skip;

    const options = getQueryOptions({ skip, limit });
    const filter = getQueryFilter({ userID: req.user._id, month });
    try {
      const { transactions, summary, totalResults } = await fetchTransactions({
        filter,
        queryOptions: options,
      });
      res.status(200).json({
        msg: "success",
        data: { transactions, summary, totalResults },
      });
    } catch (error) {
      res.status(500).json({ msg: "server error", data: null });
    }
  })
  .post(async (req, res) => {
    const { title, amount, isRecurring, category, date, type } = req.body;
    try {
      const { TransactionModel } = await connectToDatabase();
      const ObjectId = mongoose.Types.ObjectId;
      const newTrx = await TransactionModel.create(
        new Transaction(
          title,
          amount,
          isRecurring,
          new Date(date),
          type,
          category,
          req.user._id
        )
      );
      res.status(201).json({ msg: "success", data: newTrx.toObject() });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
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
