import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { fetchTransactions } from "../../../db/queries/fetchTransactions";
import getTransactionType from "../../../lib/getTransactionType";
import getQueryFilter from "../../../db/lib/QueryFilter";
import getQueryOptions from "../../../db/lib/QueryOptions";
import fetchRecurringTransactionSum from "../../../db/queries/fetchRecurringTransactionSum";
const handler = nc<ExtendedRequest, ExtendedResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.use(authMiddleWare).get(async (req, res) => {
  const type = req.query.type as string;
  const month = +req.query.month;
  const limit = +req.query.limit;
  const skip = +req.query.skip;

  let transactionType = getTransactionType(type);
  const filter = getQueryFilter(
    { userID: req.user._id, month },
    {},
    {
      type: transactionType,
    }
  );
  const options = getQueryOptions({ skip, limit });
  try {
    const { transactions, summary, totalResults } = await fetchTransactions({
      filter,
      queryOptions: options,
    });
    const result = await fetchRecurringTransactionSum({
      trxType: transactionType,
      userID: req.user._id,
    });
    summary.totalRecurring=result;
    res.status(200).json({
      msg: "success",
      data: { transactions, summary, totalResults },
    });
  } catch (error) {
    res.status(500).json({ msg: "server error", data: null });
  }
});
export default handler;
