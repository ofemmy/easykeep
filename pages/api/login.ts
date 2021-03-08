import { User } from "./../../db/models/User";
import { ExtendedRequest } from "../../types/ExtendedApiRequest";
import { ExtendedResponse } from "../../types/ExtendedApiResponse";
import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import { pick } from "lodash";
import { session } from "../../middleware/auth";
import { findUserByEmail } from "../../db/queries";

const loginHandler = nextConnect<ExtendedRequest, ExtendedResponse>();
//only using the session middleware here so I can write user to session after successful login
loginHandler.use(session).post(async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(403).json({ msg: "Login Error, username/password incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userWithoutPassword = pick(user, ["name", "email", "id"]);
      req.session.set<User>("user", userWithoutPassword);
      await req.session.save();
      return res
        .status(200)
        .send({ msg: "Login success", user: req.session.get("user") });
    }
    return res
      .status(403)
      .send({ msg: "Login Error, username/password incorrect" });
  } catch (error) {
    return res.status(500).json({ msg: "Oops server error" });
  }
});
export default loginHandler;
