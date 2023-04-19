import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  selectAuthPosts,
  selectPosts,
} from "../../redux/slices/posts";
import { selectIsAuth, selectIsAuthLoaded } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Post } from "../../components";
import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";

export const MyPosts = () => {
  const {
    posts: { status: postsStatus },
  } = useSelector(selectPosts);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isLoadingAuth = useSelector(selectIsAuthLoaded);
  const currentUserPosts = useSelector(selectAuthPosts);
  const isLoadingPosts = postsStatus === "loading";
  useEffect(() => {
    if (isLoadingAuth) {
      dispatch(fetchPosts());
    }
  }, [isLoadingAuth]);
  if (!isAuth && isLoadingAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Typography variant="h2" component="h1" mb={2}>
        Мои статьи
      </Typography>
      <Grid container spacing={2}>
        {(isLoadingPosts && !isLoadingAuth
          ? [...Array(5)]
          : currentUserPosts
        ).map((post, index) =>
          isLoadingPosts ? (
            <Grid item xs={12} md={6} key={index}>
              <Post isLoading={true} />
            </Grid>
          ) : (
            <Grid item xs={12} md={6} key={post._id}>
              <Post
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
                commentsCount={post.commentsCount}
                tags={post.tags}
                isEditable={true}
              />
            </Grid>
          )
        )}
      </Grid>
    </>
  );
};
