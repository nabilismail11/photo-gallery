import { useState } from "react";
import Image from "next/image";

import { Post } from "../types/post";
import { deleteImage } from "../utils/delete";

import { usePostContext } from "../hooks/usePostContext";
import Link from "next/link";

import { Comment } from "../types/comment";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PostDetails({
  post,
  admin,
  loader,
}: {
  post: Post;
  admin: boolean;
  loader?: Function;
}) {
  const [isLoading, setLoading] = useState(true);

  const { delPost } = usePostContext();

  const deletePost = async () => {
    if (loader) {
      loader(true);
      await deleteImage(post, delPost);
      loader(false);
    }
  };

  return (
    <div className="grid gap-5 max-w-sm">
      <div>
        <Link href={`/post/${post.id}`}>
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
            <Image
              alt=""
              src={post.source + "?width=700&height=1200&quality=1"}
              fill={true}
              sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
              style={{ objectFit: "cover" }}
              className={cn(
                "group-hover:opacity-75 duration-700 ease-in-out",
                isLoading
                  ? "grayscale blur-2xl scale-110"
                  : "grayscale-0 blur-0 scale-100"
              )}
              onLoadingComplete={() => setLoading(false)}
            />
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-5 items-center">
          <div>
            <Link href={`/user/${post.user_id}`}>
              <h3
                className="mt-4 text-sm text-gray-700 text-decoration-line: none"
                style={{ textDecoration: "none" }}
              >
                {post.username}
              </h3>
            </Link>
            <p
              className="mt-1 text-lg font-medium text-gray-900 text-decoration-line: none;"
              style={{ textDecoration: "none" }}
            >
              {post.caption}
            </p>
          </div>
          {admin && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded text-center m-1  h-10"
              onClick={deletePost}
            >
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
