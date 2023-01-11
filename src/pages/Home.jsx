import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components";
import { TagsBlock } from "../components";
import { CommentsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags, selectPosts } from "../redux/slices/posts";
import { selectAuth } from "../redux/slices/auth";

export const Home = () => {
  const dispatch = useDispatch();
  const {
    posts: { items: postsItems, status: postsStatus },
    tags: { items: tagsItems, status: tagsStatus },
  } = useSelector(selectPosts);
  const { data } = useSelector(selectAuth);
  const isLoadingPosts = postsStatus === "loading";
  const isLoadingTags = tagsStatus === "loading";
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isLoadingPosts ? [...Array(5)] : postsItems).map((post, index) =>
            isLoadingPosts ? (
              <Post isLoading={true} key={index} />
            ) : (
              <Post
                key={post._id}
                _id={post._id}
                title={post.title}
                imageUrl={post.imageUrl}
                user={{
                  avatarUrl: post.user.avatarUrl,
                  fullName: post.user.fullName,
                }}
                createdAt={new Date(post.createdAt).toLocaleDateString("ru", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                viewsCount={post.viewsCount}
                commentsCount={3} // todo: Сделать комменты
                tags={post.tags}
                isEditable={data?._id === post.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tagsItems} isLoading={isLoadingTags} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
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
          />
        </Grid>
      </Grid>
    </>
  );
};
