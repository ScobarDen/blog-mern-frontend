import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/posts";
import { useEffect } from "react";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const MyPosts = () => {
  const {
    posts: { items: postsItems, status: postsStatus },
  } = useSelector(selectPosts);
  const isAuth = useSelector(selectIsAuth);
  const isLoadingPosts = postsStatus === "loading";
  if (!isAuth) {
    return <Navigate to={"/"} />;
  }

  return <></>;
};
