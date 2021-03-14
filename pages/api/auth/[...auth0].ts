import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import prisma from "../../../db/prisma";
export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
async function afterCallback(req, res, session, state) {
  const userId = session.user.sub;
  console.log(session.user);
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
