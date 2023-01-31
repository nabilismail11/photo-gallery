import BlurImage from "./BlurImage";
import { Post } from "../types/post";

export default function Gallery({
  posts,
  admin,
  loader,
}: {
  posts: Post[];
  admin: boolean;
  loader?: Function;
}) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {posts.map((post) => (
          <BlurImage key={post.id} post={post} admin={admin} loader={loader} />
        ))}
      </div>
    </div>
  );
}
