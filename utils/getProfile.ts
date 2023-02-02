import {
  useSession,
  useUser,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function getProfile(user_id: string) {
  try {
    let { data, error, status } = await supabaseAdmin
      .from("profiles")
      .select(`username, website, avatar_url`)
      .eq("id", user_id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    //   alert(error);
    ////console.log(error);
  }
}

export { getProfile };
