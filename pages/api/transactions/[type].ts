import { ExtendedResponse } from "../../../types/ExtendedApiResponse";
import { ExtendedRequest } from "../../../types/ExtendedApiRequest";
import nc from "next-connect";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { DateTime } from "luxon";
import {
  fetchExpenseCount,
  fetchExpenseSum,
  fetchExpenses,
} from "../../../db/queries/fetchExpenses";
import getTransactionTypeEnum from "../../../lib/getTransactionType";
import { useDate } from "../../../lib/useDate";
import { Transaction } from "@prisma/client";
import {
  fetchIncomes,
  fetchIncomeCount,
  fetchIncomeSum,
} from "../../../db/queries/fetchIncomes";

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
    const frequency = req.query.frequency as string;
    const { user } = getSession(req, res);
    const ownerId = user.sub as string;
    const date = useDate({ month, year });
    const frequencyType = getFrequencyType(frequency);

    try {
      const resultOptions = {
        async income() {
          return await Promise.all([
            fetchIncomes({ ownerId, date, limit, skip, frequencyType }),
            fetchIncomeSum(ownerId, date),
            fetchIncomeCount(ownerId, date, frequencyType),
          ]);
        },
        async expense() {
          return await Promise.all([
            fetchExpenses({ ownerId, date, limit, skip, frequencyType }),
            fetchExpenseSum(ownerId, date),
            fetchExpenseCount(ownerId, date, frequencyType),
          ]);
        },
      };
      const [transactions, summary, totalCount] = await resultOptions[type]();
      res.status(200).json({
        msg: "success",
        data: { transactions, summary, totalResults: totalCount[0].count },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "server error", data: null });
    }
  })
);
export default handler;

function getFrequencyType(
  frq: string
): "all" | "nonRecurringOnly" | "recurringOnly" {
  const result = {
    all: "all",
    "non-recurring-only": "nonRecurringOnly",
    "recurring-only": "recurringOnly",
  };
  return result[frq];
}
