import Gallery from "../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../types/post";
import { usePostContext } from "../hooks/usePostContext";
import { useEffect } from "react";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getServerSideProps() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    props: {
      postsS: data,
    },
  };
}

export default function Home({ postsS }: { postsS: Post[] }) {
  const { posts, getPosts } = usePostContext();
  // //console.log(posts);

  useEffect(() => {
    if (postsS) {
      getPosts(postsS);
    }
  }, []);

  return (
    <div>
      <Gallery posts={posts} admin={false} />
    </div>
  );
}
