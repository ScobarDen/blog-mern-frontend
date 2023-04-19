import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components";
import { TagsBlock } from "../components";
import { CommentsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  fetchPostsByCategory,
  fetchTags,
  selectPosts,
} from "../redux/slices/posts";
import { selectAuth } from "../redux/slices/auth";
import usePagination from "../hooks/usePagination";
import { Box } from "@mui/material";

export const Home = ({ categoriesIndex, setCategoriesIndex }) => {
  const dispatch = useDispatch();
  const {
    posts: { items: postsItems, status: postsStatus },
    tags: { items: tagsItems, status: tagsStatus },
    comments: { items: commentsItems, status: commentsStatus },
  } = useSelector(selectPosts);
  const { data } = useSelector(selectAuth);
  const isLoadingPosts = postsStatus === "loading";
  const isLoadingTags = tagsStatus === "loading";
  const isLoadingComments = commentsStatus === "loading";
  useEffect(() => {
    dispatch(fetchPostsByCategory(0));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  const handleChangeCategory = (event, newValue) => {
    setCategoriesIndex(newValue);
    dispatch(fetchPostsByCategory(newValue));
  };
  const [currentPagePosts, pagination, returnToFirstPage] = usePagination(
    postsItems,
    3
  );
  useEffect(() => {
    if (!currentPagePosts.length) {
      returnToFirstPage();
    }
  }, [currentPagePosts]);
  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={categoriesIndex}
        onChange={handleChangeCategory}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid
          xs={12}
          md={8}
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {(isLoadingPosts ? [...Array(5)] : currentPagePosts).map(
              (post, index) =>
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
                    createdAt={new Date(post.createdAt).toLocaleDateString(
                      "ru",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    viewsCount={post.viewsCount}
                    commentsCount={post.commentsCount}
                    tags={post.tags}
                    isEditable={data?._id === post.user._id}
                  />
                )
            )}
          </Box>

          {pagination}
        </Grid>
        <Grid
          xs={0}
          md={4}
          item
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <TagsBlock items={tagsItems} isLoading={isLoadingTags} />
          <CommentsBlock items={commentsItems} isLoading={isLoadingComments} />
        </Grid>
      </Grid>
    </>
  );
};
