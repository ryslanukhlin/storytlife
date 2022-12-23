import React from 'react';
import ChatContent from '../../components/element/ChatContent/ChatContent';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';

const ChatActiveted = () => {
    const { loading } = useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: 'network-only',
    });

    if (loading) return null;

    return (
        <div className={styles.ChatPage}>
            <ChatList />
            <ChatContent />
        </div>
    );
};

export default ChatActiveted;
