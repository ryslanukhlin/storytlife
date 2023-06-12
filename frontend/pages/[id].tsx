import { useReactiveVar } from '@apollo/client';
import { Divider } from '@mui/material';
import Head from 'next/head';
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
    useNewEditUserSubscription,
} from '../graphql/generated';
import { userData } from '../graphql/store/auth';
import Gallery from '../components/element/Gallery/Gallery';

export type UserPageInfo = {
    __typename?: 'User' | undefined;
    id: string;
    phone: string;
    name: string;
    surname: string;
    patronymic?: string | null;
    about_me?: string | null;
    email?: string | null;
    place_work?: string | null;
    birthday?: string | null;
    login: string;
    created_at: string;
    img?: string | null;
    bg?: string | null;
    is_onlite: boolean;
    gallery: string[];
};

const AccountInfo = () => {
    const router = useRouter();
    const user = useReactiveVar(userData);
    const [getAnotherUser] = useGetUserLazyQuery();
    const [currentUser, setCurrentUser] = useState<UserPageInfo>();

    const fetchAnotherUser = async () => {
        const { data } = await getAnotherUser({
            variables: { userId: router.query.id as string },
            fetchPolicy: 'network-only',
        });
        if (data?.getUser) setCurrentUser(data.getUser);
        else await router.push('/404');
    };

    const isAnotherUser = user?.id === router.query.id;

    useEffect(() => {
        if (isAnotherUser) {
            setCurrentUser(user!);
        } else fetchAnotherUser();
    }, [router.query.id, user]);

    if (!currentUser) return null;

    return (
        <Container>
            <Head>
                <title>
                    {isAnotherUser ? 'Моя страничка' : 'Страничка - ' + currentUser.login}
                </title>
            </Head>
            <UserHeader user={currentUser!} />
            <Gallery currentUserId={currentUser!.id} gallery={currentUser!.gallery} />
            {isAnotherUser && <PostForm />}
            <Posts user={currentUser!} />
        </Container>
    );
};

export default AccountInfo;
