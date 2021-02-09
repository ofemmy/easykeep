import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import AppStore from "../store";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";

const queryClient = new QueryClient();
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
