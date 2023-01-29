import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Database } from "../../utils/database.types";
import SignUp from "../signup";

import { Post } from "../../types/post";

const index = () => {
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const user = useUser();
  const [image, SetImage] = useState("");
  const [username, setUsername] = useState<string>("");
  const [fileU, setFileU] = useState<File | string>("");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");

  const uploadPost = async (post: Post) => {
    try {
      await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: post }),
        headers: { "Content-Type": "application/json" },
      });
      SetImage("");
      setCaption("");
    } catch (err) {
      console.error(err);
    }
  };

  async function getProfile() {
    try {
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // console.log(data.username);

        setUsername(data.username);
        console.log(username);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    }
  }
  const previewFile = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      SetImage(reader.result as string);
    };
  };
  const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    let uid = "saumit";
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = event.target.files[0];
    setFileU(file);

    previewFile(file);
    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${uid}.${fileExt}`;
    const filePath = `${fileName}`;

    // let { error: uploadError } = await supabase.storage
    //   .from("posts")
    //   .upload(filePath, file, { upsert: true });

    // console.log(uploadError);
  };

  const handleUpload: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    await getProfile();
    if (!user) throw new Error("No user");
    console.log(user);

    const fileName = user.id + "/" + uuidv4();

    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(fileName, fileU);
    setLoading(false);
    if (data) {
      console.log(data);

      const post: Post = {
        href: "/",
        source:
          "https://eadmdwacvzflwjvwxxlq.supabase.co/storage/v1/object/public/post-images/" +
          fileName,
        caption: caption,
        user_id: user.id,
        username: username,
      };
      uploadPost(post);
    } else {
      console.log(error);
    }
  };

  return !session ? (
    <SignUp />
  ) : (
    <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto mt-10">
      <img
        className="object-scale-down h-48 w-96 pt-2"
        src={
          image
            ? image
            : "https://eadmdwacvzflwjvwxxlq.supabase.co/storage/v1/object/public/posts/saumit.png"
        }
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">New Post</div>
        <form className="w-full max-w-sm">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Caption"
              aria-label="Caption"
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              value={caption}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
            >
              <label className="button primary block" htmlFor="single">
                {loading ? "Uploading ..." : "Select"}
              </label>
            </button>

            <input
              style={{
                visibility: "hidden",
                position: "absolute",
              }}
              type="file"
              id="single"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={loading}
            />
          </div>
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded mt-2"
            type="button"
            onClick={handleUpload}
          >
            Upload
          </button>
        </form>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #photography
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
      </div>
    </div>
  );
};

export default index;
