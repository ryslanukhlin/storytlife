import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useGetUserPostsLazyQuery, useNewPostSubscription } from '../../../graphql/generated';
import { userData } from '../../../graphql/store/auth';
import PostComponent from './Post';

export interface Comment {
    __typename?: 'Comment';
    id: string;
    txt: string;
    created_at: string;
    user: { __typename?: 'User'; login: string };
}

export interface Post {
    __typename?: 'Post' | undefined;
    id: string;
    description: string;
    img?: string | null;
    created_at: string;
    title: string;
    likes: {
        __typename?: 'Like' | undefined;
        user: {
            __typename?: 'User' | undefined;
            id: string;
        };
    }[];
    comments: Comment[];
}

const Posts = () => {
    const user = useReactiveVar(userData);
    const [posts, setPosts] = useState<Post[]>([]);
    const [getPosts] = useGetUserPostsLazyQuery();

    const downloadPosts = async () => {
        const { data } = await getPosts();

        setPosts(data?.getUserPosts as Post[]);
    };

    useNewPostSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: (option) => {
            const { created_at } = option.data.data?.newPost!;
            option.data.data!.newPost.created_at = new Date(created_at).getTime().toString();
            setPosts((prev) => [...prev, option.data.data?.newPost as Post]);
        },
    });

    useEffect(() => {
        downloadPosts();
    }, []);

    return (
        <>
            {posts?.map((post) => (
                <PostComponent key={post.id} post={post} />
            ))}
        </>
    );
};

export default Posts;
