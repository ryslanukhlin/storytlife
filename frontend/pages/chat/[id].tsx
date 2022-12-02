import React from 'react';
import ChatContent from '../../components/element/ChatContent/ChatContent';
import ChatList from '../../components/element/ChatList/ChatList';

import styles from '../../components/element/ChatList/ChatList.module.scss';

const ChatActiveted = () => {
    return (
        <div className={styles.ChatPage}>
            <ChatList />
            <ChatContent />
        </div>
    );
};

export default ChatActiveted;
