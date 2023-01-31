import Gallery from "../../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../types/post";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../components/Loading";
import { usePostContext } from "../../hooks/usePostContext";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  const session = useSession();
  const { posts } = usePostContext();
  const filter = posts.filter((post) => post.user_id == session?.user.id);

  const [loader, setLoader] = useState(false);

  const initLoader = (bool: boolean) => {
    setLoader(bool);
  };

  useEffect(() => {}, [loader]);

  return loader ? (
    <LoadingScreen />
  ) : (
    <Gallery posts={filter} admin={true} loader={initLoader} />
  );
}
