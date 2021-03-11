import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { authMiddleWare } from "../../../middleware/auth";
import { DateTime } from "luxon";
import {
  fetchTransactionCount,
  fetchTransactionsByType,
  fetchSumByType,
} from "../../../db/queries";
import getTransactionTypeEnum from "../../../lib/getTransactionType";
import getQueryFilter from "../../../db/lib/QueryFilter";
import getQueryOptions from "../../../db/lib/QueryOptions";
import fetchRecurringTransactionSum from "../../../db/queries/fetchRecurringTransactionSum";
import { useDate } from "../../../lib/useDate";
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
  const year = +req.query.year || DateTime.now().get("year");
  const limit = +req.query.limit;
  const skip = +req.query.skip;
  const ownerId = req.user.id;
  const trxType = getTransactionTypeEnum(type);
  const date = useDate({ month, year });
  try {
    const transactions = await fetchTransactionsByType({
      trxType,
      date,
      limit,
      skip,
      ownerId,
    });
    const totalResults = await fetchTransactionCount({
      ownerId,
      date,
      trxType,
    });
    const summary = await fetchSumByType({ ownerId, date, trxType });
    res.status(200).json({
      msg: "success",
      data: { transactions, summary, totalResults },
    });
  } catch (error) {
    res.status(500).json({ msg: "server error", data: null });
  }
});
export default handler;
