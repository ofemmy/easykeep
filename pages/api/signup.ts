import { User } from "./../../db/models/User";
import { ExtendedRequest } from "../../types/ExtendedApiRequest";
import { ExtendedResponse } from "../../types/ExtendedApiResponse";
import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../db";
import { session } from "../../middleware/auth";

const signupHandler = nextConnect<ExtendedRequest, ExtendedResponse>();
//only using the session middleware here so I can write user to session after successful signup
signupHandler.use(session).post(async function (req, res) {
  const { email, password, name } = req.body;
  const { UserModel } = await connectToDatabase();
  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
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
    const response = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    if (response._id) {
      req.session.set<User>(
        "user",
        response.toObject({
          versionKey: false,
          transform: (doc) => {
            doc.password = null;
            return doc;
          },
        })
      );
    }
    console.log("here");
    await req.session.save();
    return res
      .status(201)
      .json({ status: "success", user: req.session.get("user") });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", status: "error" });
  }
});

export default signupHandler;
