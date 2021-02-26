import { User } from "./../../db/models/User";
import { ExtendedRequest } from "../../types/ExtendedApiRequest";
import { ExtendedResponse } from "../../types/ExtendedApiResponse";
import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import { session } from "../../middleware/auth";
import prisma from "../../db/prisma";

const signupHandler = nextConnect<ExtendedRequest, ExtendedResponse>();
//only using the session middleware here so I can write user to session after successful signup
signupHandler.use(session).post(async function (req, res) {
  const { email, password, name } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ status: "error", message: "Password length too small" });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { email: true, name: true, id: true },
    });
    if (newUser) {
      req.session.set<User>("user", newUser);
    }
    await req.session.save();
    return res
      .status(201)
      .json({ status: "success", user: req.session.get("user") });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", status: "error" });
  }
});

export default signupHandler;
