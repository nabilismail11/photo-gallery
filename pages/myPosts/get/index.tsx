import Gallery from "../../../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../../types/post";
import { useSession } from "@supabase/auth-helpers-react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../../components/Loading";
import { usePostContext } from "../../../hooks/usePostContext";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getServerSideProps() {
  const getPosts = async () => {
    const { data } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    return data;
  };

  const postData = await getPosts();
  console.log(postData);

  return {
    props: {
      postsC: postData,
    },
  };
}
export default function Home({ postsC }: { postsC: Post[] }) {
  const session = useSession();
  const { posts, getPosts } = usePostContext();
  useEffect(() => {
    getPosts(postsC);
  }, []);

  const filter = posts.filter((post) => post.user_id == session?.user.id);

  const [loader, setLoader] = useState(false);

  const initLoader = (bool: boolean) => {
    setLoader(bool);
  };

  return loader ? (
    <LoadingScreen />
  ) : (
    <Gallery posts={filter} admin={true} loader={initLoader} />
  );
}
