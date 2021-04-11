import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import prisma from "../../../db/prisma";
import { useDate } from "../../../lib/useDate";
import { Transaction } from "@prisma/client";
import { Prisma } from "@prisma/client";
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
      const newTrx: Transaction = req.body;
      const { user } = getSession(req, res);
      newTrx.ownerId = user.sub;
      console.log(newTrx);
      //TODO: Serverside validation
      try {
        const { categoryId, id, ...newtrxData } = newTrx;
        const category = await prisma.category.findFirst({
          where: { id: Number(newTrx.categoryId) },
        });
        category.runningBudget = category.budget.equals(0)
          ? new Prisma.Decimal(0)
          : category.runningBudget.minus(newtrxData.amount);
        const updateCategory = prisma.category.update({
          where: { id: category.id },
          data: category,
        });
        const createTrx = prisma.transaction.create({
          data: {
            ...newtrxData,
            category: { connect: { id: Number(categoryId) } },
          },
          include: { category: true },
        });
        const [cat, createdTrx] = await prisma.$transaction([
          updateCategory,
          createTrx,
        ]);
        res.status(201).json({ status: "success", data: createdTrx });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: "error",
          msg: "error occured on server",
          data: null,
        });
      }
    })
  )
  .put(
    withApiAuthRequired(async (req, res) => {
      const trxData = req.body;
      try {
        const { categoryId, id, ...updatedTrxData } = trxData;
        const trx = await prisma.transaction.findFirst({ where: { id } });
        const category = await prisma.category.findFirst({
          where: { id: categoryId },
        });
        const difference = trx.amount.minus(trxData.amount);

        category.runningBudget = category.budget.equals(0)
          ? new Prisma.Decimal(0)
          : category.runningBudget.plus(difference);
        const updateCategory = prisma.category.update({
          where: { id: Number(category.id) },
          data: category,
        });
        const updateTrx = prisma.transaction.update({
          where: { id: trxData.id },
          data: {
            ...updatedTrxData,
            categoryId: Number(trxData.categoryId),
          },
        });
        const [_, result] = await prisma.$transaction([
          updateCategory,
          updateTrx,
        ]);
        return res.status(204).send({
          status: "success",
          data: result,
          msg: "Entry successfully updated",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: "error",
          msg: "error occured on server",
          data: null,
        });
      }
    })
  )
  .delete(
    withApiAuthRequired(async (req, res) => {
      const trxId = +req.query.id;
      const { user } = getSession(req, res);
      const ownerId = user.sub;
      if (!trxId) {
        return res
          .status(400)
          .send({ status: "error", msg: "Invalid request", data: null });
      }
      try {
        const trx = await prisma.transaction.findFirst({
          where: { id: trxId },
          include: { category: true },
        });
        const category = trx.category;
        //if no budget is set no need to update recurring budget
        category.runningBudget = category.budget.equals(0)
          ? new Prisma.Decimal(0)
          : category.runningBudget.plus(trx.amount);
        const delTrx = prisma.transaction.delete({
          where: { id: trxId },
        });
        const updateCategory = prisma.category.update({
          where: { id: category.id },
          data: category,
        });
        const result = await prisma.$transaction([updateCategory, delTrx]);
        return res.status(204).send({ status: "success", data: null });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .send({ status: "error", msg: "Server error", data: null });
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
