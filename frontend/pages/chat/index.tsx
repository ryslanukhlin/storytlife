import { Box, styled, Typography } from '@mui/material';
import React from 'react';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';

const NotChatBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Chat = () => {
    useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: 'network-only',
    });

    return (
        <div className={styles.ChatPage}>
            <ChatList />
            <NotChatBox className={styles.NotActiveChat}>
                <Typography variant="body1">Выберете кому вы хотите написать сообшение</Typography>
            </NotChatBox>
        </div>
    );
};

export default Chat;
