import { Box, Button, FormGroup, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useCreatePostMutation } from '../../../graphql/generated';

import styles from './PostForm.module.scss';

const PostForm = () => {
    const [nameImage, setNameImage] = useState<String>();
    const [createPost] = useCreatePostMutation();

    const formik = useFormik({
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: { title: '', description: '', image: null },
        onSubmit: async ({ title, description, image }, { resetForm }) => {
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
            } else
                createPost({
                    variables: {
                        createPost: {
                            img: null,
                            title,
                            description,
                        },
                    },
                });
            resetForm();
        },
        validate: (values) => {
            let errors: any = {};

            if (!values.title.trim()) errors.title = 'Обезательное поле!';
            if (!values.description.trim()) errors.description = 'Обезательное поле!';

            return errors;
        },
    });

    const changeImagePost = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        await formik.setFieldValue('image', file);
        setNameImage(file.name);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{ boxShadow: 3 }} className={styles.PostForm}>
                <Typography variant="h5">Что нового у вас произошло?</Typography>
                <TextField
                    label="Заголовок"
                    className={styles.Input}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={!!formik.errors.title}
                    helperText={formik.errors.title}
                />
                <TextField
                    label="Описание"
                    multiline
                    className={styles.InputDescription}
                    rows={4}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={!!formik.errors.description}
                    helperText={formik.errors.description}
                />
                <div className={styles.PostActions}>
                    <Button variant="text" component="label">
                        {nameImage ?? 'Загрузить изображение'}
                        <input type="file" accept="image/*" hidden onChange={changeImagePost} />
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
