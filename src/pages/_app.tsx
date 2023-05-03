import { Providers } from "@/components/Providers";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Head from "next/head";

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
