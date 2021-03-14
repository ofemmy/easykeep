import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import prisma from "../../db/prisma";
import { DefaultCategories } from "../../store";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler.post(
  withApiAuthRequired(async (req, res) => {
    const { user } = getSession(req, res);
    const { currency, language } = req.body;
    if (currency && language && user) {
      try {
        const result = await prisma.profile.create({
          data: {
            currency,
            language,
            ownerId: user.sub,
            categories: DefaultCategories,
          },
        });
        res.status(201).send({ status: "success", data: result });
      } catch (error) {
        res.status(500).send({ error: "Internal server error" });
      }
    }
  })
);
export default handler;
