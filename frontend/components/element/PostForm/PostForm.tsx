import { Box, Button, FormGroup, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useCreatePostMutation } from '../../../graphql/generated';

import styles from './PostForm.module.scss';

const PostForm = () => {
    const [nameImage, setNameImage] = useState<String>();
    const [createPost] = useCreatePostMutation();

    const formik = useFormik({
        initialValues: { title: '', description: '', image: null },
        onSubmit: async ({ title, description, image }) => {
            if (nameImage) {
                const file: File = image as unknown as File;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async function () {
                    createPost({
                        variables: {
                            createPost: {
                                img: reader.result as string,
                                title,
                                description,
                            },
                        },
                    });
                };
            } else {
                createPost({
                    variables: {
                        createPost: {
                            img: null,
                            title,
                            description,
                        },
                    },
                });
            }
        },
    });

    const chandeImagePost = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        await formik.setFieldValue('image', file);
        setNameImage(file.name);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{ boxShadow: 3 }} className={styles.PostForm}>
                <Typography variant="h5">Что нового у вас произошло?</Typography>
                <TextField
                    label="Загаловок"
                    className={styles.Input}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <TextField
                    label="Описание"
                    multiline
                    className={styles.InputDescription}
                    rows={4}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                <div className={styles.PostActions}>
                    <Button variant="text" component="label">
                        {nameImage ?? 'Загрузиить изображение'}
                        <input type="file" accept="image/*" hidden onChange={chandeImagePost} />
                    </Button>
                    <Button variant="contained" type="submit">
                        Опубликовать
                    </Button>
                </div>
            </Box>
        </form>
    );
};

export default PostForm;
