import { useReactiveVar } from '@apollo/client';
import { styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { userData } from '../../../graphql/store/auth';
import { ThemeContext } from '../../../pages/_app';
import BoxBorderRight from '../../ui/BoxBorderRight';
import ChatItemList from './ChatItemList';

import styles from './ChatList.module.scss';

const ChatItem = () => {
    const user = useReactiveVar(userData);

    return (
        <BoxBorderRight className={styles.ChatList}>
            {user?.chats?.length === 0 && (
                <Typography variant="body1">
                    Перейдите в раздел 'сообшения' <br /> и выберете кому хотите написать
                </Typography>
            )}
            {user?.chats!.map((contact) => (
                <ChatItemList key={contact?.id} contact={contact!} />
            ))}
        </BoxBorderRight>
    );
};

export default ChatItem;
