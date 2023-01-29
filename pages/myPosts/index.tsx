import Gallery from "../../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../types/post";
import { useSession } from "@supabase/auth-helpers-react";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getStaticProps() {
  //   console.log(session);

  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  // .eq("user_id", session?.user.id);

  return {
    props: {
      posts: data,
    },
  };
}

export default function Home({ posts }: { posts: Post[] }) {
  const session = useSession();
  posts = posts.filter((post) => {
    return post.user_id == session?.user.id;
  });

  return <Gallery posts={posts} admin={true} />;
}
