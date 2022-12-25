import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useGetUserPostsLazyQuery, useNewPostSubscription } from '../../../graphql/generated';
import { TypeUser, userData } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';
import PostComponent from './Post';

export interface Comment {
    __typename?: 'Comment';
    id: string;
    txt: string;
    created_at: string;
    user: { __typename?: 'User'; id: string; login: string; img?: string | null };
}

export interface Post {
    __typename?: 'Post' | undefined;
    id: string;
    description: string;
    img?: string | null;
    created_at: string;
    title: string;
    user: {
        __typename?: 'User' | undefined;
        id: string;
        login: string;
        img?: string | null;
    };
    likes: {
        __typename?: 'Like' | undefined;
        user: {
            __typename?: 'User' | undefined;
            id: string;
        };
    }[];
    comments: Comment[];
}

const Posts: FC<{ user: UserPageInfo | TypeUser }> = ({ user }) => {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [getPosts] = useGetUserPostsLazyQuery();
    console.log(posts);

    const downloadPosts = async () => {
        const { data } = await getPosts({
            variables: {
                userId: router.query.id as string,
            },
        });

        setPosts(data?.getUserPosts as Post[]);
    };

    useNewPostSubscription({
        variables: {
            userId: user.id,
        },
        onData: (option) => {
            console.log(option.data.data?.newPost!);

            const { created_at } = option.data.data?.newPost!;
            option.data.data!.newPost.created_at = new Date(created_at).getTime().toString();
            setPosts((prev) => [...prev, option.data.data?.newPost as Post]);
        },
    });

    useEffect(() => {
        downloadPosts();
    }, [router.query.id]);

    return (
        <>
            {posts?.map((post) => (
                <PostComponent key={post.id} post={post} />
            ))}
        </>
    );
};

export default Posts;
