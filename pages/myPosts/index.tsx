import Gallery from "../../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../types/post";
import { useSession } from "@supabase/auth-helpers-react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../components/Loading";
import { usePostContext } from "../../hooks/usePostContext";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const { posts, getPosts } = usePostContext();

  useEffect(() => {
    if (posts.length == 0) {
      router.replace("/myPosts/get");
    }
  }, []);

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
