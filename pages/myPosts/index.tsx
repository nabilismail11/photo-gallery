import Gallery from "../../components/Gallery";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../types/post";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../components/Loading";
import { usePostContext } from "../../hooks/usePostContext";

export default function Home() {
  const session = useSession();
  const { posts, getPosts } = usePostContext();
  const getPost = async () => {
    let response = await fetch("http://localhost:3000/api/getPosts", {
      method: "GET",
    });
    return await response.json();
  };
  //console.log(posts.length);

  if (posts.length == 0) {
    //console.log("wjdsikd");

    getPost().then((response) => {
      getPosts(response.data);
    });
  }
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
