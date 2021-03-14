import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "@auth0/nextjs-auth0";
import AppStore from "../store";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";
import LoadingComponent from "../components/LoadingComponent";
//const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";
  const isSignUp = router.pathname === "/signup";
  const queryClientRef = React.useRef() as any;
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return (
    <UserProvider>
      <QueryClientProvider client={queryClientRef.current}>
        <ChakraProvider>
          <AppStore>
            <Hydrate state={pageProps.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Hydrate>
          </AppStore>
        </ChakraProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </UserProvider>
  );
}
