import React, { useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getVideosUrl } from "../mongo/mongo";
import userContext from "../components/userContext";
const jwt = require('jsonwebtoken')
import jwtDecode from "jwt-decode";
import { setup } from "../lib/csrf";

export const getServerSideProps = setup(async (req) => {
  const token = req.headers.cookie?.split(';')
    .find((cookie) => cookie.trim().startsWith('FrontEndToken=')) 
    ?.split('=')[1];

  let email = "";
  if (token != undefined && token != "") {
    let payload: { email: string } = jwtDecode(token);
    email = payload.email;
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: email },
      published: false,
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },

  });
  const urls = await getVideosUrl();

  return {
    props: { drafts, urls },
  };
});

type Props = {
  drafts: PostProps[];
  urls: Map<number, string>;

};

const Drafts: React.FC<Props> = (props) => {
  const [draftsFeed, setDraftsFeed] = useState<PostProps[]>([]);
  const user = useContext(userContext).user;
  const isUserLogged = user?.username != "";
  const { drafts, urls } = props;

  useEffect(() => {
    let newDrafts = drafts.map(draft => {
      let newDraft = { ...draft };
      let url = urls.get(draft.id);
      if (url) {
        newDraft.videoUrl = url;
      }
      return newDraft;
    });

    setDraftsFeed(newDrafts);
  }, [props])

  if (!isUserLogged) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {draftsFeed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
