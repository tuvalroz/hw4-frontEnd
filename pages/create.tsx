import React, { useContext, useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { Upload } from "../components/Upload";
import darkModeContext from "../components/darkModeContext";
import userContext from "../components/userContext";
import { handleExpiredToken } from "../common/Utils";

const Draft: React.FC = () => {
  const darkMode = useContext(darkModeContext).darkMode;
  const { username, email, token, imageUrl } = useContext(userContext).user;
  const setUser = useContext(userContext).setUser;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFileFormData, setSelectedFileFormData] = useState<FormData>(new FormData());
  const [isUploading, setIsUploading] = useState(false);
  const ref: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus()
  }, []);

  const submitData = async (e: React.SyntheticEvent) => {
    setIsUploading(true);
    e.preventDefault();
    let videoUrl = undefined;

    if (selectedFileFormData.get('inputFile')) {
      let videoData = await postVideoInColudinary(selectedFileFormData);
      if (videoData.url == "-1") {
        alert("Faild to upload video")
        setIsUploading(false);
        return
      }
      videoUrl = videoData.url;
    }

    try {
      const body = { title, content, email, videoUrl }; // need to check in the backend if the videoId is empty
      let response = await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify(body),
      });
      if (response.status == 401) {
        handleExpiredToken(setUser, Router);
      }
      else {
        await Router.push(`/drafts`);
      }
      await response.json();

      setIsUploading(false);

    } catch (error) {
      console.error(error);
      setIsUploading(false);

    }
  };

  const postVideoInColudinary = async (formData: FormData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const res = await response;
      const data = await res.json();

      return data;

    } catch (error) {
      console.log(error);
      return { url: "-1" }
    }
  }

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            ref={ref}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <Upload setFormData={setSelectedFileFormData} />
          <br />
          {!isUploading ?
            <input disabled={!content || !title} type="submit" value="Create" />
            :
            <div className="spinner-container">
              <div className="loading-spinner">
              </div>
            </div>
          }

          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }


        a{
          ${darkMode ? "color: white" : ""}
        }
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loading-spinner{
          width: 50px;
          height: 50px;
          border: 10px solid #f3f3f3; /* Light grey */
          border-top: 10px solid #383636; /* Black */
          border-radius: 50%;
          animation: spinner 1.5s linear infinite;

        }
      `}</style>
    </Layout>
  );
};

export default Draft;
