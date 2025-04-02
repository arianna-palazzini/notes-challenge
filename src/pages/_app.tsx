import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NotesList from "@/components/NotesList";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-8">
        <NotesList />
        {/* <Component {...pageProps} /> */}
      </div>
    </div>
  );
}
