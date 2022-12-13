import React, { FC } from 'react';

import styles from './Comment.module.scss';
import { Avatar, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Comment } from '../Post/Posts';
import { dateFormater } from '../../../util/dateFormat';

const Comment: FC<{ comment: Comment }> = ({ comment }) => {
    return (
        <div className={styles.Comment}>
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" className={styles.Avatar}>
                R
            </Avatar>
            <div>
                <Typography variant="body1">{comment.user.login}</Typography>
                <Typography variant="body2">{dateFormater(comment.created_at)}</Typography>
                <Typography variant="subtitle1">{comment.txt}</Typography>
            </div>
        </div>
    );
};

export default Comment;
