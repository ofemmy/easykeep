import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import AppStore from "../store";
import { useRouter } from "next/router";
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";
  return (
    <ChakraProvider>
      <AppStore>
        {isLogin ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AppStore>
    </ChakraProvider>
  );
}
