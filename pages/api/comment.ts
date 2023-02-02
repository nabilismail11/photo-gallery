// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Data = {
  name: string;
};

const uploadComment = async (comment: Comment) => {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert([comment]);

  if (data) {
    //console.log(data);
  } else {
    //console.log(error);
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    uploadComment(req.body.data);
  } catch (error) {
    ////console.log(error);
  }
  res.status(200).json({ name: "John Doe" });
}
