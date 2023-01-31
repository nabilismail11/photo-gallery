import { createClient } from "@supabase/supabase-js";
import { usePostContext } from "../hooks/usePostContext";


import { Post } from "../types/post";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  
  export const deletePost = async (post:Post,delPost:Function) => {
    
    const { data,error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', post.id)
    .select()
    
  if (error) {
    alert(error);
    
  } else {
    console.log(data);
    delPost(post);
    alert("Post Successfully deleted");
    


  }


}

export const deleteImage = async (post: Post,delPost:Function) => {

  if (post) {

    const { error } = await supabaseAdmin
      .storage
      .from('post-images')
      .remove([post.user_id + "/" + post.source.split("/").at(-1)])
    if (error) {
      alert(error);
      return

    } else {
      await deletePost(post,delPost)

    }

  }
}