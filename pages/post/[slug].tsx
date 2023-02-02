import { useRouter } from "next/router";
import { usePostContext } from "../../hooks/usePostContext";
import PostDetails from "../../components/PostDetails";
import { useEffect, useState } from "react";
import { Comment } from "../../types/comment";
import { Post } from "../../types/post";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@supabase/auth-helpers-react";
import { useCommentContext } from "../../hooks/useCommentContext";
import { getProfile } from "../../utils/getProfile";
import Link from "next/link";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getServerSideProps() {
  const { data } = await supabaseAdmin
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    props: {
      commentsC: data,
    },
  };
}
const PostPage = ({ commentsC }: { commentsC: Comment[] }) => {
  const { comments, getComments, addComment } = useCommentContext();
  const router = useRouter();
  const { slug } = router.query;
  const session = useSession();
  const { posts, getPosts } = usePostContext();

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

  const post: Post = posts.filter((p) => p.id == slug)[0];
  const [comment, setComment] = useState("");

  let post_id: number;
  let user_id: string;
  if (post) {
    if (post.id && session?.user.id) {
      post_id = post.id;
      user_id = session?.user.id;
    }
  }
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (commentsC) {
      getComments(commentsC);
    }
    if (user_id) {
      getProfile(user_id).then((data) => setUsername(data?.username));
    }
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key == "Enter") {
      createComment();
    }
  };
  const uploadComment = async (comment: Comment) => {
    try {
      await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({ data: comment }),
        headers: { "Content-Type": "application/json" },
      });
      // alert("Comment Uploaded");
      addComment(comment);
      // setLoader(false);
      //console.log(comment);

      setComment("");
    } catch (err) {
      console.error(err);
    }
  };
  const createComment = async () => {
    if (post_id && user_id && comment) {
      const cmt: Comment = {
        post_id: post_id,
        user_id: user_id,
        comment: comment,
        username: username,
      };
      //console.log(cmt);
      await uploadComment(cmt);

      setComment("");
    } else if (!user_id) {
      alert("Please sign in to comment");
      router.replace("/signin");
    }
  };
  const handelClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    createComment();
  };

  return (
    <div className=" mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {post && <PostDetails post={post} admin={false} />}
        <div>
          <h6>Comments</h6>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <input
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              type="text"
              onKeyDown={handleKeyPress}
            />
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-50"
              onClick={handelClick}
            >
              Post
            </button>
          </div>
          <div>
            {comments.map((comment) =>
              comment.post_id == post_id ? (
                <div key={comment.id}>
                  {
                    <Link href={`/user/${comment.user_id}`}>
                      {comment.username}
                    </Link>
                  }{" "}
                  {": "}
                  {comment.comment}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
