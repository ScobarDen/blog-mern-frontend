import React, { useRef } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import { fetchComments, fetchPosts } from "../../redux/slices/posts";

export const AddComment = () => {
  const dispatch = useDispatch();
  const { data: person } = useSelector(selectAuth);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onSubmit",
  });
  const handleComment = async (text) => {
    try {
      await axios.post(`/comments/${id}`, {
        "text": text.text
      });
      await dispatch(fetchComments());
    } catch (err) {
      console.log(err);
      alert("Не удалось оставить комментарий");
    }
  };
  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={person.avatarUrl} />
        <div className={styles.form}>
          <form onSubmit={handleSubmit(handleComment)}>
            <TextField
              label="Написать комментарий"
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              {...register("text", { required: "Введите текст комментария" })}
            />
            <Button type="submit" variant="contained">
              Отправить
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
