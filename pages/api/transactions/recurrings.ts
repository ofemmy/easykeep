import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";
import { fetchRecurringEntries } from "db/queries/fetchRecurringEntries";
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
    const { user } = getSession(req, res);
    const type = req.query.type as string;
    const ownerId = user.sub;
    try {
      const result = await fetchRecurringEntries({ type, ownerId });
      return res.status(200).send({ status: "success", data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "error", data: null });
    }
  })
);
export default handler;
