import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { authMiddleWare } from "../../middleware/auth";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",msg: `${req.method} Not Allowed`,
    });
  },
});

handler.use(authMiddleWare).get(async (req, res) => {
  res.statusCode = 200;
  res.json({ msg: "working" });
});
export default handler;
