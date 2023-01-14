import React, { useEffect, useState } from "react";

import { Post, AddComment, CommentsBlock } from "../components";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { selectPosts } from "../redux/slices/posts";

export const FullPost = () => {
  const [dataPost, setDataPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { comments } = useSelector(selectPosts);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setDataPost(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [comments]);

  if (isLoading || !dataPost.tags) {
    return <Post isLoading={true} />;
  }

  return (
    <>
      <Post
        _id={dataPost._id}
        title={dataPost.title}
        imageUrl={dataPost.imageUrl}
        user={dataPost.user}
        createdAt={new Date(dataPost.createdAt).toLocaleDateString("ru", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        viewsCount={dataPost.viewsCount}
        commentsCount={dataPost.commentsCount}
        tags={dataPost.tags}
        isFullPost
      >
        <ReactMarkdown children={dataPost.text} />
      </Post>
      <CommentsBlock items={dataPost.comments} isLoading={false}>
        <AddComment />
      </CommentsBlock>
    </>
  );
};
