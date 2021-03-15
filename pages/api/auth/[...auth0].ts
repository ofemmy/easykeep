import { handleAuth, handleCallback, handleProfile } from "@auth0/nextjs-auth0";
import { error } from "console";
import prisma from "../../../db/prisma";
export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
  async profile(req, res) {
    try {
      await handleProfile(req, res, { afterRefetch, refetch: true });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});

async function afterCallback(req, res, session, state) {
  const userId = session.user.sub;
  const userProfile = await prisma.profile.findFirst({
    where: { ownerId: userId },
  });
  if (!userProfile) {
    state.returnTo = "/profile";
  } else {
    session.user.profile = userProfile;
  }
  return session;
}
async function afterRefetch(req, res, session) {
  console.log("refetching from database");
  const userId = session.user.sub;
  const userProfile = await prisma.profile.findFirst({
    where: { ownerId: userId },
  });
  session.user.profile = userProfile;
  return session;
}
