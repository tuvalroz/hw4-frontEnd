import React, { useContext } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import darkModeContext from "./darkModeContext";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
    image: string;
  } | null;
  content: string;
  published: boolean;
  videoUrl?: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  const darkMode = useContext(darkModeContext).darkMode;
  const authorImageSrc = post.author?.image;

  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title } {post.videoUrl && "🎥"}</h2>
      <small>By {authorName}{authorImageSrc && authorImageSrc != "" && <img src={authorImageSrc}/>}</small>
      <ReactMarkdown children={post.content} />
      {post.videoUrl && <video src={post.videoUrl} autoPlay={true} loop={true} />}
      <style jsx>{`
        div {
          color: ${darkMode ? "white" : "inherit"};
          padding: 2rem;
          ${darkMode ? "background-color: gray;" : ""}
        }

        img {
          height: 50px;
          width: 50px;
        }
      `}</style>
    </div>
  );
};

export default Post;
