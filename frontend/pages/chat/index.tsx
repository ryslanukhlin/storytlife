import { Box, styled, Typography } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';
import useWidth from '../../hook/useWidth';

const NotChatBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Chat = () => {
    const { loading } = useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: 'network-only',
    });

    if (loading) return null;

    return (
        <div className={styles.ChatPage}>
            <Head>
                <title>Сообшения</title>
            </Head>
            <ChatList />
            <NotChatBox className={styles.NotActiveChat}>
                <Typography variant="body1">Выберете кому вы хотите написать сообшение</Typography>
            </NotChatBox>
        </div>
    );
};

export default Chat;
