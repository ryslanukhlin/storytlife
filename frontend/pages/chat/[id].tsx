import Head from 'next/head';
import { useReducer } from 'react';
import ChatContent from '../../components/element/ChatContent/ChatContent';
import ChatList from '../../components/element/ChatList/ChatList';
import { useGetCurrentUserChatsQuery } from '../../graphql/generated';
import { chatData } from '../../graphql/store/chat';
import useWidth from '../../hook/useWidth';
import { useRouter } from 'next/router';

import styles from '../../components/element/ChatList/ChatList.module.scss';

const ChatActiveted = () => {
    const router = useRouter();
    const width = useWidth();
    const chatId = window.location.pathname.split('/').at(-1)!;
    useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: router.query.refetch === 'true' ? 'network-only' : 'cache-and-network',
    });

    if (!chatData().find((chat) => chat?.id === chatId)?.users![0]!) {
        router.push('/404');
        return null;
    }

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
