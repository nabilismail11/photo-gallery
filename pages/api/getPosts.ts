// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Post } from "../../types/post";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const getPosts = async (id?: string) => {
  if (id) {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", id)
      .order("created_at", { ascending: false });
    if (data) {
      return data;
    } else {
      return error;
    }
  } else {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      return data;
    } else {
      return error;
    }
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    //console.log(req.body.data);

    getPosts()
      .then((data) => res.status(200).json({ data }))
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    ////console.log(error);
  }
}
