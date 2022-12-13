import { Avatar, Button, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { FC, useState } from 'react';
import { useAddCommentMutation } from '../../../graphql/generated';

import styles from './CommentForm.module.scss';

const CommentForm: FC<{ postId: string }> = ({ postId }) => {
    const [txt, setTxt] = useState('');
    const [addComment] = useAddCommentMutation();

    const changeTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTxt(e.target.value);
    };

    const sendComment = () => {
        if (!txt) return;
        addComment({
            variables: {
                createCommentInput: {
                    txt,
                    postId,
                },
            },
        });
    };

    return (
        <div className={styles.CommentForm}>
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" className={styles.Avatar}>
                R
            </Avatar>
            <TextField
                label="Написать коментарий"
                variant="outlined"
                fullWidth
                className={styles.Input}
                size="small"
                multiline
                value={txt}
                onChange={changeTxt}
            />
            <Button variant="contained" className={styles.Button} onClick={sendComment}>
                Отправить
            </Button>
        </div>
    );
};

export default CommentForm;
