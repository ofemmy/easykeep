import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { DateTime } from "luxon";
import {
  fetchTransactionCount,
  fetchTransactionsByTypeAndFrequency,
  fetchSumByType,
} from "../../../db/queries";
import getTransactionTypeEnum from "../../../lib/getTransactionType";
import { useDate } from "../../../lib/useDate";
const handler = nc<ExtendedRequest, ExtendedResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.get(
  withApiAuthRequired(async (req, res) => {
    const type = req.query.type as string;
    const month = +req.query.month;
    const year = +req.query.year || DateTime.now().get("year");
    const limit = +req.query.limit;
    const skip = +req.query.skip;
    const frequency = req.query.frequency;
    const { user } = getSession(req, res);
    const ownerId = user.sub;

    const trxType = getTransactionTypeEnum(type);
    const date = useDate({ month, year });
    try {
      const {
        transactions,
        totalResults,
      } = await fetchTransactionsByTypeAndFrequency({
        trxType,
        date,
        limit,
        skip,
        ownerId,
        frequency,
      });
      // const totalResults = await fetchTransactionCount({
      //   ownerId,
      //   date,
      //   trxType,
      // });
      const summary = await fetchSumByType({ ownerId, date, trxType });
      res.status(200).json({
        msg: "success",
        data: { transactions, summary, totalResults },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
);
export default handler;
