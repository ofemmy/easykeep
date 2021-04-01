import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import prisma from "../../../db/prisma";
import { useDate } from "../../../lib/useDate";
import { Transaction } from "@prisma/client";
import { fetchSum } from "../../../db/queries";
import { fetchSumByType } from "../../../db/queries/fetchSumByType";
import { fetchTransactions } from "../../../db/queries/fetchTransactions";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler
  .get(
    withApiAuthRequired(async (req, res) => {
      const month = +req.query.month;
      const year = +req.query.year;
      const limit = +req.query.limit;
      const date = useDate({ month, year });
      const { user } = getSession(req, res);
      const ownerId = user.sub;
      try {
        const data = await fetchTransactions({
          date,
          ownerId,
          limit,
        });
        const transactionSum = await fetchSumByType({
          ownerId,
          date,
        });
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
  )
  .post(
    withApiAuthRequired(async (req, res) => {
      const newPost: Transaction = req.body;
      const { user } = getSession(req, res);
      newPost.ownerId = user.sub;

      //TODO: Serverside validation
      try {
        if (newPost) {
          const newTrx = await prisma.transaction.create({ data: newPost });
          res.status(201).json({ status: "success", data: newTrx });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "error", msg: "error occured on server" });
      }
    })
  );
// .put(async (req, res) => {
//   const { title, amount, isRecurring, category, date, type, _id } = req.body;
//   try {
//     const { TransactionModel } = await connectToDatabase();
//     const trx = await TransactionModel.findOne({ _id });
//     if (!trx) {
//       console.log("No trx with that id found");
//       res.status(404).json({ status: "error", msg: "resource not found" });
//     }
//     trx.title = title;
//     trx.amount = amount;
//     trx.category = category;
//     trx.date = date;
//     trx.type = type;
//     trx.isRecurring = isRecurring;
//     await trx.save();
//     res.status(200).json({ msg: "success" });
//   } catch (error) {
//     res.status(500).json({ status: "error" });
//   }
// })
// .delete(async (req, res) => {
//   const { _id } = req.body;
//   const { TransactionModel } = await connectToDatabase();
//   const trx = await TransactionModel.findOne({ _id });
//   if (!trx) {
//     res.status(404).json({ status: "error", msg: "resource not found" });
//   }
//   await trx.delete();
//   res.status(200).json({});
// });
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
