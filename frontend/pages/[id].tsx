import { useReactiveVar } from '@apollo/client';
import { Divider } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Post from '../components/element/Post/Post';
import Posts from '../components/element/Post/Posts';
import PostForm from '../components/element/PostForm/PostForm';
import UserHeader from '../components/element/UserHeader/UserHeader';
import Container from '../components/ui/Container';
import {
    useGetCurrentUserLazyQuery,
    useGetUserLazyQuery,
    useGetUserQuery,
} from '../graphql/generated';
import { userData } from '../graphql/store/auth';

export type UserPageInfo = {
    __typename?: 'User' | undefined;
    id: string;
    phone: string;
    login: string;
    created_at: string;
    img?: string | null;
    bg?: string | null;
};

const AccountInfo = () => {
    const router = useRouter();
    const user = useReactiveVar(userData);
    const [getAnotherUser] = useGetUserLazyQuery();
    const [currentUser, setCurrentUser] = useState<UserPageInfo>();

    const fetchAnotherUser = async () => {
        const { data } = await getAnotherUser({
            variables: { userId: router.query.id as string },
        });
        if (data?.getUser) setCurrentUser(data.getUser);
        else await router.push('/404');
    };

    const isAnotherUser = user?.id === router.query.id;

    useEffect(() => {
        if (isAnotherUser) {
            const { chats, ...result } = user!;
            setCurrentUser(result);
        } else fetchAnotherUser();
    }, []);

    if (!currentUser) return null;

    return (
        <Container>
            <UserHeader user={currentUser!} />
            {isAnotherUser && <PostForm />}
            <Posts user={currentUser!} />
        </Container>
    );
};

export default AccountInfo;
