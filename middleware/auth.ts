import { ironSession } from "next-iron-session";
import nextConnect from "next-connect";
import {sessionConfig} from '../lib/sessionConfig'

export const session = ironSession(sessionConfig);

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
