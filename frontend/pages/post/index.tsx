import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import LinkContent from '../../components/ui/LinkWrapper';
import { BackPort } from '../../config';
import {
    useGetCurrentUserChatsQuery,
    useGetPostsLazyQuery,
    useGetPostsQuery,
} from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';
import { dateFormater } from '../../util/dateFormat';
import { hidingLargeText } from '../../util/hidingLargeText';

import styles from '../../styles/Post.module.scss';

type SortOption = 'time' | 'like';

const PostsPage = () => {
    const [sort, setSotr] = useState<SortOption>('time');
    const [loading, setLoading] = useState(true);
    const [paginIter, setPaginIter] = useState(0);
    const [posts, setPosts] = useState<
        Array<{
            __typename?: 'Post';
            id: string;
            created_at: string;
            title: string;
            description: string;
            img?: string | null;
            user: { __typename?: 'User'; id: string; img?: string | null; login: string };
        }>
    >([]);
    const router = useRouter();
    const [getPosts] = useGetPostsLazyQuery({
        fetchPolicy: 'network-only',
    });

    const redirectPostPage = (postId: string) => {
        router.push('/post/' + postId);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSotr(event.target.value as SortOption);
        setPaginIter(0);
    };

    const downloadMorePosts = async () => {
        const { data, error } = await getPosts({
            variables: {
                sort,
                paginIter: paginIter + 1,
            },
        });

        if (!error) setPosts((prev) => [...prev, ...data?.getPosts!]);

        setPaginIter((prev) => prev + 1);
    };

    useEffect(() => {
        (async () => {
            const { data, error } = await getPosts({
                variables: {
                    sort,
                },
            });

            if (!error) setPosts(data?.getPosts!);

            setLoading(false);
        })();
    }, [sort]);

    if (loading) return null;

    return (
        <>
            <Head>
                <title>Посты</title>
            </Head>
            <Select
                className={styles.SelectSort}
                value={sort}
                label="Сортировка по"
                onChange={handleChange}>
                <MenuItem value="time">По дате</MenuItem>
                <MenuItem value="like">По лайкам</MenuItem>
            </Select>
            <Grid container spacing={2}>
                {posts.length === 0 && (
                    <Typography variant="body1">Интересных посток пока нет</Typography>
                )}
                {posts.map((post) => (
                    <Grid item xs={12} lg={6} xl={4} key={post.id}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={
                                    <LinkContent href={'/' + post.user.id}>
                                        <Avatar
                                            sx={{ bgcolor: red[500] }}
                                            aria-label="recipe"
                                            src={
                                                post.user.img
                                                    ? BackPort + 'img/avatar/' + post.user.img
                                                    : undefined
                                            }>
                                            {post.user.login[0]}
                                        </Avatar>
                                    </LinkContent>
                                }
                                title={post.user.login}
                                subheader={dateFormater(post.created_at)}
                            />
                            {post.img && (
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={BackPort + 'img/post/' + post.img}
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
            <div className={styles.DownloadMore}>
                <Button onClick={downloadMorePosts}>показать ещё</Button>
            </div>
        </>
    );
};

export default PostsPage;
