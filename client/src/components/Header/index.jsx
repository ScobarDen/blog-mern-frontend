import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth, selectIsAuth } from "../../redux/slices/auth";
import { fetchPostsByCategory } from "../../redux/slices/posts";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
import StyledBadge from "../common/HOC/StyledBadge";

export const Header = ({ categoriesIndex, setCategoriesIndex }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { data: currentUser } = useSelector(selectAuth);

  const [clientWidth, setClientWidth] = useState(
    document.documentElement.clientWidth
  );

  useEffect(() => {
    function handleResize() {
      setClientWidth(document.documentElement.clientWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onClickLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <div className={styles.root}>
      <Container sx={{ maxWidth: { xs: "xs", sm: "sm", md: "md", lg: "lg" } }}>
        <div className={styles.inner}>
          <Link
            className={styles.logo}
            onClick={() => {
              dispatch(fetchPostsByCategory(0));
              setCategoriesIndex(0);
            }}
            to="/"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <span>{clientWidth > 550 ? "Scobar's BLOG" : "SB"}</span>
            </Box>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Link to={"/"}>
                  <Button
                    onClick={onClickLogout}
                    variant="contained"
                    color="error"
                  >
                    Выйти
                  </Button>
                </Link>
                <Link to={"/my-posts"}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar src={currentUser.avatarUrl} sx={{ ml: "1rem" }} />
                  </StyledBadge>
                </Link>
              </Box>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
