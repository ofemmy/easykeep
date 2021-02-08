import { withIronSession } from "next-iron-session";

export default withIronSession(
  (req, res) => {
    if (req.method == "POST") {
      req.session.destroy();
      res.status(200).send("Logged out");
    }
  },
  {
    cookieName: "EASYKEEP",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.SECRET_PASSWORD,
  }
);