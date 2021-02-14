import mongoose from "mongoose";
import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { connectToDatabase } from "../../../db";
import { Transaction } from "../../../db/models/TransactionModel";
import { fetchTransactions } from "../../../db/queries/fetchTransactions";
import TransactionType from "../../../types/TransactionType";
import getTransactionType from "../../../lib/getTransactionType";
const handler = nc<ExtendedRequest, ExtendedResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.use(authMiddleWare).get(async (req, res) => {
  const type = req.query.type as string
  const month = +req.query.month;
  const limit = +req.query.limit;
  const skip = +req.query.skip;
  const options = {
    limit,
    skip: skip || 0,
    sort: { $natural: -1 },
  };

  const ObjectId = mongoose.Types.ObjectId;
  let transactionType=getTransactionType(type);

  const filter = {owner:ObjectId(req.user._id),type:transactionType,$or:[{month},{isRecurring:true}]}
  try {
    const { transactions, summary, totalResults } = await fetchTransactions({
      filter,
      queryOptions: options,
    });
    res.status(200).json({
      msg: "success",
      data: { transactions, summary,totalResults },
    });
  } catch (error) {
    res.status(500).json({ msg: "server error", data: null });
  }
});
export default handler;
