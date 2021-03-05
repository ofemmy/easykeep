import { connectToDatabase } from "..";
import getQueryFilter from "../lib/QueryFilter";
import prisma from "../prisma";
async function fetchRecurringTransactionSum({ trxType, userID }) {
  const filter = getQueryFilter(
    { userID, trxType },
    { withRecurringSum: true }
  );
  const { TransactionModel } = await connectToDatabase();
  const totals = await TransactionModel.aggregate([
    { $match: filter },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  if (totals.length === 0) return 0;
  return totals[0].total;
}
export default async function fetchRecurringTrxSumWithPrisma({
  trxType,
  ownerId,
}) {
  const result = await prisma.transaction.aggregate({
    sum: { amount: true },
    where: {
      isRecurring: true,
      ownerId,
      type: trxType,
    },
  });
  return result;
}
