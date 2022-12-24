import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { useRouter } from 'next/router';
import React from 'react';
import Card from '../../components/ui/Card';
import { BackPort } from '../../config';
import { useGetCurrentUserChatsQuery, useGetPostsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';
import { dateFormater } from '../../util/dateFormat';
import { hidingLargeText } from '../../util/hidingLargeText';

const PostsPage = () => {
    const router = useRouter();
    const { data, loading, error } = useGetPostsQuery({
        fetchPolicy: 'network-only',
    });

    if (loading || error) return null;

    const redirectPostPage = (postId: string) => {
        router.push('/post/' + postId);
    };

    return (
        <Grid container spacing={2}>
            {data?.getPosts.length === 0 && (
                <Typography variant="body1">Интересных посток пока нет</Typography>
            )}
            {data?.getPosts.map((post) => (
                <Grid item xs={12} lg={6} xl={4} key={post.id}>
                    <Card variant="outlined">
                        <CardHeader
                            avatar={
                                <Avatar
                                    sx={{ bgcolor: red[500] }}
                                    aria-label="recipe"
                                    src={
                                        post.user.img
                                            ? BackPort + 'img/avatar/' + post.user.img
                                            : undefined
                                    }>
                                    R
                                </Avatar>
                            }
                            title={post.user.login}
                            subheader={dateFormater(post.created_at)}
                        />
                        {post.img && (
                            <CardMedia
                                component="img"
                                height="194"
                                image={'http://localhost:5000/img/post/' + post.img}
                                alt="Paella dish"
                            />
                        )}

                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary">
                                {post.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {hidingLargeText(post.description)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={redirectPostPage.bind(null, post.id)}>
                                Подробнее
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PostsPage;
