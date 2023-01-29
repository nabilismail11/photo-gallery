import React, { useState } from "react";
import Alert from "../../components/Alert";
import { Image } from "../../types/image";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Database } from "../../utils/database.types";
import SignUp from "../signup";
export default function Upload() {
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient<Database>();

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
        setUsername(data.username || name);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    }
  }
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    await getProfile();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      const image: Image = {
        name: name,
        href: "/",
        username: `@${username}`,
        imageSrc: reader.result,
      };
      uploadImage(image);
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
      setErrMsg("something went wrong!");
    };
  };

  const uploadImage = async (image: Image) => {
    try {
      await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: image }),
        headers: { "Content-Type": "application/json" },
      });
      setFileInputState("");
      setPreviewSource("");
      setName("");
      setSuccessMsg("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };
  return !session ? (
    <SignUp />
  ) : (
    <div className="addPost">
      <h1 className="title">Upload an Image</h1>
      <div className="formC">
        <Alert msg={errMsg} type="danger" />
        <Alert msg={successMsg} type="success" />
        <form onSubmit={handleSubmitFile} className="form">
          <input
            type="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            id="fileInput"
            type="file"
            name="image"
            onChange={handleFileInputChange}
            value={fileInputState}
            className="form-input"
          />
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
        {previewSource && (
          <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
        )}
      </div>
    </div>
  );
}
