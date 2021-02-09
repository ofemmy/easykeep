import { useContext,useEffect } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
export default function Home({ user }) {
  const { setUser } = useContext(MyAppContext);
  useEffect(() => {
    setUser(user)
  }, [user])
  return (
    <>
      <Header pageTitle="Home" />
      <p>Welcome to the home page {user.name}</p>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
});
