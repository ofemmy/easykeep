import prisma from "../../db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Category } from ".prisma/client";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({
      status: "error",
      msg: `${req.method} Not Allowed`,
    });
  },
});
handler
  .get(
    withApiAuthRequired(async (req, res) => {
      const { user } = getSession(req, res);
      console.log(user.sub);
      try {
        const categories = await prisma.category.findMany({
          where: { ownerId: user.sub },
        });

        return res.status(200).send({ status: "success", data: categories });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "error", data: null });
      }
    })
  )
  .post(
    withApiAuthRequired(async (req, res) => {
      const newCategory: Category = req.body;
      const { user } = getSession(req, res);
      if (!newCategory) {
        return res.status(400).send({ status: "error", msg: "Invalid data" });
      }
      newCategory.ownerId = user.sub;
      try {
        //use id field to determine edit or create mode
        if (newCategory.id) {
          const newData = await prisma.category.update({
            where: { id: newCategory.id },
            data: newCategory,
          });
          return res.status(200).send({
            status: "success",
            msg: "Category updated successfully",
            data: newData,
          });
        }
        const alreadyExists = await prisma.category.findFirst({
          where: {
            title: {
              equals: newCategory.title,
              mode: "insensitive",
            },
            ownerId: user.sub,
          },
        });
        if (alreadyExists) {
          return res.status(400).send({
            status: "error",
            msg: "Category already exists",
            data: null,
          });
        }
        const data = await prisma.category.create({ data: newCategory });
        if (data) {
          return res.status(201).send({
            status: "success",
            msg: "Category successfully added",
            data,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(404).send({
          status: "error",
          msg: "Internal server error",
          data: null,
        });
      }
    })
  )
  .delete(
    withApiAuthRequired(async (req, res) => {
      const categoryId = Number(req.query.id);
      try {
        const result = await prisma.category.delete({
          where: { id: categoryId },
        });
        res.status(200).send({
          status: "success",
          msg: "Category deleted successfully",
          data: null,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", msg: "Internal server error" });
      }
    })
  );
export default handler;
