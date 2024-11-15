import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <main className="min-w-full flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1 px-4 md:px-8 lg:px-16 xl:px-24 bg-slate-500">
              <Component {...pageProps} />
            </div>

            <div className="px-4 md:px-8 lg:px-16 xl:px-24">
              <Footer />
            </div>
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
