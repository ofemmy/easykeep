import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();
handler.get(async (req, res) => {
  res.statusCode = 200;
  res.json({ msg: "working" });
});
export default handler