import { createClient } from "@supabase/supabase-js";




import { useSession } from "@supabase/auth-helpers-react";
import { Post } from "../types/post";
import { NextRouter, Router } from "next/router";
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  
export const deletePost = async (id:number)=>{

    console.log(id);
const { error } = await supabaseAdmin
.from('posts')
.delete()
.eq('id', id)

if (error) {
    console.log(error);
    
}else{
    console.log("deleted");
    
    
}


}

export const deleteImage = async (post:Post, router:NextRouter) =>{
    
    if (post) {
        console.log("invoked");
        
        
        
        const { error } = await supabaseAdmin
          .storage
          .from('post-images')
          .remove([post.user_id+"/"+post.source.split("/").at(-1)])
        if(error) {
          console.log(error);
          return
          
        } else {
            console.log(post.source.split("/").at(-1));
            deletePost(post.id)
            
        }
        
    }
}
