import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import prisma from "../../db/prisma";
import { DefaultCategories } from "../../store";
import capitalize from "../../lib/capitalize";

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
        res.status(201).send({ status: "success", profile: result });
      } catch (error) {
        res.status(500).send({ error: "Internal server error" });
      }
    }
  })
);
handler.get(
  withApiAuthRequired(async (req, res) => {
    const user = getSession(req, res);
    try {
      const userProfile = await prisma.profile.findFirst({
        where: { ownerId: user.sub },
      });
      res.status(200).send({ msg: "success", profile: userProfile });
    } catch (error) {}
  })
);
handler.patch(
  withApiAuthRequired(async (req, res) => {
    const { type } = req.query;
    const { action, payload } = req.body;
    const { user } = getSession(req, res);
    try {
      const userProfile = await prisma.profile.findFirst({
        where: { ownerId: user.sub },
      });
      let result, message;
      if (type === "categories") {
        switch (action) {
          case "add":
            let cat = new Set(userProfile.categories);
            cat.add(payload.newCategory);
            const updatedList = [...Array.from(cat)];
            result = await prisma.profile.update({
              where: { id: userProfile.id },
              data: {
                categories: updatedList,
              },
            });
            message = `${capitalize(payload.newCategory)} added to categories`;
            break;
          case "delete":
            const filteredList = userProfile.categories.filter(
              (c) => c !== payload.newCategory
            );
            result = await prisma.profile.update({
              where: { id: userProfile.id },
              data: {
                categories: filteredList,
              },
            });
            message = `${capitalize(
              payload.newCategory
            )} removed from categories`;
            break;
        }
      }
      res.status(200).send({ msg: message, data: result });
    } catch (error) {}
  })
);
export default handler;
