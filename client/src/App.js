import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, MyPosts } from "./pages";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import { MyPostsLayout } from "./layouts/MyPostsLayout";

function App() {
  const [categoriesIndex, setCategoriesIndex] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  const isAuth = useSelector(selectIsAuth);
  return (
    <>
      <Header {...{ categoriesIndex, setCategoriesIndex }} />
      <Container sx={{ maxWidth: { xs: "xs", sm: "sm", md: "md", lg: "lg" } }}>
        <Routes>
          <Route
            path="/"
            element={<Home {...{ categoriesIndex, setCategoriesIndex }} />}
          />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/my-posts" element={<MyPostsLayout />}>
            <Route index element={<MyPosts />} />
            <Route path=":id" element={<FullPost />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
