import { Divider } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import Post from '../components/element/Post/Post';
import Posts from '../components/element/Post/Posts';
import PostForm from '../components/element/PostForm/PostForm';
import UserHeader from '../components/element/UserHeader/UserHeader';

const AccountInfo = () => {
    return (
        <Container>
            <UserHeader />
            <PostForm />
            <Posts />
        </Container>
    );
};

export default AccountInfo;
