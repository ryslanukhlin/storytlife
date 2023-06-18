import Head from 'next/head';
import React from 'react';
import ChatContent from '../../components/element/ChatContent/ChatContent';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';
import useWidth from '../../hook/useWidth';

const ChatActiveted = () => {
    const width = useWidth();
    const { loading } = useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: 'cache-first',
    });

    if (loading) return null;

    return (
        <div className={styles.ChatPage}>
            <Head>
                <title>Сообшения</title>
            </Head>
            {width > 640 && <ChatList />}
            <ChatContent />
        </div>
    );
};

export default ChatActiveted;
