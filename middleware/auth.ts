import { ironSession } from "next-iron-session";
import nextConnect from "next-connect";
const EASYKEEP = "EASYKEEP";
const PASSWORD = process.env.SECRET_PASSWORD;
export const session = ironSession({
  cookieName: EASYKEEP,
  password: PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
export const authMiddleWare = nextConnect()
  .use(session)
  .use(async (req, res, next) => {
    const user = req.session.get("user");
    if (!user) {
        res.status(401).json({msg:"Access to resource denied"})
    }
    req.user = user;
    next();
  });
