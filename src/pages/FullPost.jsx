import React, { useEffect, useState } from "react";

import { Post, AddComment, CommentsBlock } from "../components";
import { useParams } from "react-router-dom";
import axios from "../axios";

export const FullPost = () => {
  const [dataPost, setDataPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

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
  }, []);

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
        commentsCount={3} // todo: Сделать комменты
        tags={dataPost.tags}
        isFullPost
      >
        <p>{dataPost.text}</p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <AddComment />
      </CommentsBlock>
    </>
  );
};
