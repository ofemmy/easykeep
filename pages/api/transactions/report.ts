import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { useDate } from "../../../lib/useDate";
import {
  fetchTransactionReport,
  fetchTransactionsByCategory,
} from "../../../db/queries";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.get(
  withApiAuthRequired(async (req, res) => {
    const trxType = req.query.type;
    const month = +req.query.month;
    const year = +req.query.year;
    const date = useDate({ month, year });
    const { user } = getSession(req, res);
    const ownerId = user.sub;
    try {
      // let dateFrom = DateTime.utc().minus({ days: 28 });
      // let dateTo = dateFrom.plus({ months: 1, days: 13 });
      const result = await fetchTransactionReport({
        dateFrom: DateTime.utc().minus({ days: 28 }),
        dateTo: DateTime.utc().plus({ months: 1, days: 13 }),
        ownerId,
        trxType: "Income",
      });
      console.log(result);
      res.status(200).send({ msg: "success", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
);
export default handler;
