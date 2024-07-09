import { Typography } from '@mui/material';
import { chatData } from '../../../graphql/store/chat';
import BoxBorderRight from '../../ui/BoxBorderRight';
import ChatItemList from './ChatItemList';

import styles from './ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../../graphql/generated';
import { useEffect, useState } from 'react';

const ChatItem = () => {
    const [localStoreChats, setLocalStoreChats] = useState(chatData() ?? []);
    
    const data = useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
            setLocalStoreChats(data.getCurrentUser.chats)
        },
        initialFetchPolicy: "no-cache",
        fetchPolicy: 'no-cache',
        nextFetchPolicy: "no-cache",
    });

    useEffect(() => {
        setLocalStoreChats(data.data?.getCurrentUser.chats!)
    }, [data.data?.getCurrentUser.chats])

    return (
        <BoxBorderRight className={styles.ChatList}>
            {localStoreChats && localStoreChats.length === 0 && (
                <Typography variant="body1">
                    Перейдите в раздел 'Поиск' <br /> и выберете кому хотите написать
                </Typography>
            )}
            {localStoreChats && localStoreChats.map((contact) => (
                <ChatItemList key={contact?.id} contact={contact!} />
            ))}
        </BoxBorderRight>
    );
};

export default ChatItem;