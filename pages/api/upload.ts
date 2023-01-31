// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from "@supabase/supabase-js";
import { Post } from '../../types/post';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Data = {
  name: string
}

const sentImage = async (post:Post) => {
   const {data,error} = await supabaseAdmin.from('posts').insert([post]);

   if (data) {
    //console.log(data);
    
   }else{
    //console.log(error);
    
   }
  
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    //console.log(req.body.data);
    
    sentImage(req.body.data)
  } catch (error) {
    //console.log(error);
    
  }  
  res.status(200).json({ name: 'John Doe' })
}
