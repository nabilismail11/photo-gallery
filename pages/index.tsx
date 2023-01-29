import Gallery from "../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../types/post";

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
      posts: data,
    },
  };
}

export default function Home({ posts }: { posts: Post[] }) {
  return <Gallery posts={posts} admin={false} />;
}
