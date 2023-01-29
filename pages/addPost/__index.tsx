import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../utils/database.types";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Avatar() {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const [uploading, setUploading] = useState(false);

  const logImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    let uid = "saumit";
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${uid}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, file, { upsert: true });

    console.log(uploadError);
  };

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log(uploadError);

        throw uploadError;
      }

      // onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
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
        onChange={logImage}
        disabled={uploading}
      />
    </div>
  );
}
