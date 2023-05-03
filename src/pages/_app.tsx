import { Providers } from "@/components/Providers";
import type { AppProps } from "next/app";
import Head from "next/head";

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Starter | Underdog Protocol</title>
      </Head>

      <Component {...pageProps} />
    </Providers>
  );
}
