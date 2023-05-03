import { Providers } from "@/components/Providers";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
