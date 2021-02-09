const EASYKEEP = "EASYKEEP";
const PASSWORD = process.env.SECRET_PASSWORD;
export const sessionConfig ={
    cookieName: EASYKEEP,
    password: PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }