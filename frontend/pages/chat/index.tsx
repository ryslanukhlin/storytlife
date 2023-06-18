import { Box, styled, Typography } from '@mui/material';
import Head from 'next/head';
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
        fetchPolicy: 'cache-first', // Used for first execution
    });

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
