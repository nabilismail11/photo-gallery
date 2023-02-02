import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfile } from "../../utils/getProfile";
import { createClient } from "@supabase/supabase-js";
import { Profile } from "../../types/profile";

import UserProfile from "../../components/User";
import Gallery from "../../components/Gallery";
import { usePostContext } from "../../hooks/usePostContext";
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getServerSideProps() {
  const { data } = await supabaseAdmin.from("profiles").select("*");

  return {
    props: {
      profiles: data,
    },
  };
}

export default function User({ profiles }: { profiles: Profile[] }) {
  const { posts, getPosts } = usePostContext();
  const [selectedUser, setSelectedUser] = useState<Profile | undefined>();
  const router = useRouter();
  const { uid } = router.query;

  const getPost = async () => {
    let response = await fetch("/api/getPosts", {
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
  // let selectedUser;
  const filter = posts.filter((post) => post.user_id == uid);
  useEffect(() => {
    if (profiles) {
      for (const profile in profiles) {
        if (Object.prototype.hasOwnProperty.call(profiles, profile)) {
          const element = profiles[profile];
          if (element.id == uid) {
            setSelectedUser(element);
          }
        }
      }
    }
  }, []);

  //console.log(posts);

  return (
    <div>
      <UserProfile profile={selectedUser} />
      <Gallery posts={filter} admin={false} />
    </div>
  );
}
