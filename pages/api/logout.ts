import { ExtendedRequest } from "../../types/ExtendedApiRequest";
import { ExtendedResponse } from "../../types/ExtendedApiResponse";
import nextConnect from "next-connect";
import { session } from "../../middleware/auth";
const logoutHandler = nextConnect<ExtendedRequest, ExtendedResponse>();
logoutHandler.use(session).post(async function (req, res) {
  req.session.destroy();
  res.status(200).send("Logged out");
});
export default logoutHandler;
