import { connectToDatabase } from "../../db";
import fetchRecurringTransactionSum from "../../db/queries/fetchRecurringTransactionSum";
import getQueryFilter from "../../db/lib/QueryFilter";
import TransactionType from "../../types/TransactionType";
const handler = async (req, res) => {
  const result = await fetchRecurringTransactionSum({userID:"6020c64db6b25d4b3531cc9d",trxType:TransactionType.EXPENSE});
  console.log(result);
  res.status(200).json({ msg: "success" });
};

export default handler;
