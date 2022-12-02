import { Box, styled, Typography } from '@mui/material';
import React from 'react';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';

const NotChatBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Chat = () => {
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
