import { useReactiveVar } from '@apollo/client';
import { Typography } from '@mui/material';
import { chatData } from '../../../graphql/store/chat';
import BoxBorderRight from '../../ui/BoxBorderRight';
import ChatItemList from './ChatItemList';

import styles from './ChatList.module.scss';

const ChatItem = () => {
    const chats = useReactiveVar(chatData);

    return (
        <BoxBorderRight className={styles.ChatList}>
            {chats.length === 0 && (
                <Typography variant="body1">
                    Перейдите в раздел 'сообшения' <br /> и выберете кому хотите написать
                </Typography>
            )}
            {chats.map((contact) => (
                <ChatItemList key={contact?.id} contact={contact!} />
            ))}
        </BoxBorderRight>
    );
};

export default ChatItem;
