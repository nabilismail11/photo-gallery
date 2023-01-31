import "../styles/globals.css";
import "../styles/navbar.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import NavBar from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";

import { PostContextProvider } from "../context/postContext";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const [supabase] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <PostContextProvider>
        <Head>
          <title>Image Gallery</title>
          <meta property="og:title" content="Image Gallery" key="title" />
        </Head>
        <NavBar />
        <Component {...pageProps} />
      </PostContextProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
