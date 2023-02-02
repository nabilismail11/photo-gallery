import { useState, useEffect } from "react";
import { Profile } from "../types/profile";
import { Database } from "../utils/database.types";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const UserProfile = ({ profile }: { profile: Profile | undefined }) => {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      ////console.log("Error downloading image: ", error);
    }
  }
  useEffect(() => {
    if (profile?.avatar_url) downloadImage(profile?.avatar_url);
  }, [profile?.avatar_url]);
  //console.log(profile?.avatar_url);

  return (
    <div className="">
      <div className="w-full  flex flex-row items-center justify-center mx-auto bg-[#FFFBFB] rounded-lg shadow-xl">
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full  flex flex-col items-center justify-center">
            <figure className="rounded-full overflow-hidden m-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="avatar image "
                  style={{ height: 100, width: 100 }}
                />
              ) : (
                <div
                  className="avatar no-image"
                  style={{ height: 150, width: 200 }}
                />
              )}
            </figure>
          </div>
          <div className="w-full space-y-4 flex flex-col  justify-center items-center">
            <div className="flex-col justify-center">
              <h1 className="text-center md:text-left text-2xl font-bold text-gray-900">
                {profile && profile.username}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
