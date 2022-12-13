import { ExpandMore } from '@mui/icons-material';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import { red } from '@mui/material/colors';
import React, { FC, useState } from 'react';

import styles from './Post.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Post } from './Posts';
import { dateFormater } from '../../../util/dateFormat';
import { useAddLikeMutation, useNewLikeSubscription } from '../../../graphql/generated';
import { useReactiveVar } from '@apollo/client';
import { userData } from '../../../graphql/store/auth';
import CommentForm from '../CommentForm/CommentForm';
import Comments from '../Comment/Comments';

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const Post: FC<{ post: Post }> = ({ post }) => {
    const user = useReactiveVar(userData);

    const [likeCount, setLikeCount] = useState(post.likes);
    const [commentCount, setCommentCount] = useState(post.comments.length);
    const [addLike] = useAddLikeMutation();

    const setLike = () => {
        const isLiked = likeCount.find((like) => like.user.id === user?.id);
        if (isLiked) return;

        addLike({
            variables: {
                postId: post.id,
            },
        });
    };

    useNewLikeSubscription({
        variables: {
            postId: post.id,
        },
        onData: (option) => {
            setLikeCount((prev) => [...prev, option.data.data!.newLike]);
        },
    });

    const addComment = () => {
        setCommentCount((prev) => ++prev);
    };

    return (
        <CustomCard variant="outlined" className={styles.Post}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                    </Avatar>
                }
                title={post.title}
                subheader={dateFormater(post.created_at)}
            />
            {post.img && (
                <CardMedia
                    component="img"
                    image={'http://localhost:5000/img/post/' + post.img}
                    alt="Post image"
                    height={300}
                />
            )}

            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {post.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <div className={styles.PostFooter}>
                    <div className={styles.FooterActions}>
                        <IconButton aria-label="add like" onClick={setLike}>
                            <FavoriteIcon />
                        </IconButton>
                        <div className={styles.FooterCount}>{likeCount.length}</div>
                        <IconButton aria-label="add comment">
                            <CommentIcon />
                        </IconButton>
                        <div className={styles.FooterCount}>{commentCount}</div>
                        {/* TODO: реализовать систему ссылок и просмотров */}
                        {/*
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                        <div className={styles.FooterCount}>314</div> */}
                    </div>
                    {/* <div className={styles.FooterActions}>
                        <RemoveRedEyeIcon /> <div className={styles.FooterCount}>314</div>
                    </div> */}
                </div>
            </CardActions>
            <Collapse in unmountOnExit className={styles.CommentsWrapper}>
                <Comments comments={post.comments} postId={post.id} addComment={addComment} />
                <CommentForm postId={post.id} />
            </Collapse>
        </CustomCard>
    );
};

export default Post;
