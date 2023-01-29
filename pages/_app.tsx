import "../styles/globals.css";
import "../styles/navbar.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import NavBar from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";

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
      <>
        <NavBar />
        <Component {...pageProps} />
      </>
    </SessionContextProvider>
  );
}

export default MyApp;
