import { useReactiveVar } from '@apollo/client';
import { Typography } from '@mui/material';
import { chatData } from '../../../graphql/store/chat';
import BoxBorderRight from '../../ui/BoxBorderRight';
import ChatItemList from './ChatItemList';

import styles from './ChatList.module.scss';
import { useGetCurrentUserChatsQuery } from '../../../graphql/generated';

const ChatItem = () => {
    useGetCurrentUserChatsQuery({
        onCompleted(data) {
            chatData(data.getCurrentUser.chats);
        },
        fetchPolicy: 'network-only', // Used for first execution
    });

    return (
        <BoxBorderRight className={styles.ChatList}>
            {chatData().length === 0 && (
                <Typography variant="body1">
                    Перейдите в раздел 'Поиск' <br /> и выберете кому хотите написать
                </Typography>
            )}
            {chatData().map((contact) => (
                <ChatItemList key={contact?.id} contact={contact!} />
            ))}
        </BoxBorderRight>
    );
};

export default ChatItem;
