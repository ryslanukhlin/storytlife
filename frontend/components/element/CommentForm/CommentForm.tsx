import { useReactiveVar } from '@apollo/client';
import { Avatar, Button, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { FC, useRef, useState } from 'react';
import { BackPort } from '../../../config';
import { useAddCommentMutation } from '../../../graphql/generated';
import { userData } from '../../../graphql/store/auth';

import styles from './CommentForm.module.scss';

const CommentForm: FC<{
    postId: string;
    commentInput: React.MutableRefObject<HTMLInputElement | undefined>;
}> = ({ postId, commentInput }) => {
    const user = useReactiveVar(userData);
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
        setTxt('');
    };

    return (
        <div className={styles.CommentForm}>
            <Avatar
                sx={{ bgcolor: red[500] }}
                aria-label="recipe"
                className={styles.Avatar}
                src={user?.img ? BackPort + 'img/avatar/' + user?.img : undefined}>
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
                inputRef={commentInput}
            />
            <Button variant="contained" className={styles.Button} onClick={sendComment}>
                Отправить
            </Button>
        </div>
    );
};

export default CommentForm;
