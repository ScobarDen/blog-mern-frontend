import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios, { baseURL } from "../../axios";

export const AddPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef(null);
  const [isImage, setIsImage] = useState(false);
  const [isWebImage, setIsWebImage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`posts/${id}`)
        .then(({ data }) => {
          setText(data.text);
          setTitle(data.title);
          setTags(data.tags);
          setImageUrl(data.imageUrl);
          if (data.imageUrl) {
            setIsImage(true);
            setIsWebImage(true);
          }
          setIsEdit(true);
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при получении статьи");
        });
    }
  }, []);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const imageFile = e.target.files[0];
      formData.append("image", imageFile);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
      setIsImage(true);
    } catch (err) {
      alert("error uploading");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const delimiters = /[ ,;_?]+/;
      const fields = {
        title,
        text,
        imageUrl: isImage ? (isWebImage ? imageUrl : baseURL + imageUrl) : "",
        tags: Array.isArray(tags)
          ? tags
          : tags.split(delimiters).filter((tag) => tag !== ""),
      };
      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      const { _id } = data;
      navigate(`/posts/${isEdit ? id : _id}`);
    } catch (e) {
      console.warn(e);
      alert("Ошибка при создании статьи");
    }
  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={isWebImage ? imageUrl : baseURL + imageUrl}
          alt="Uploaded"
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdit ? "Изменить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
