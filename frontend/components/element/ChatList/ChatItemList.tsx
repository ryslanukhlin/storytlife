import { useReactiveVar } from '@apollo/client';
import { Box, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { Chat, notificationData, userData } from '../../../graphql/store/auth';
import { ThemeContext } from '../../../pages/_app';

import styles from './ChatList.module.scss';

const CustomBox = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.default,
    },
}));

const ChatItemList: FC<{ contact: Chat }> = ({ contact }) => {
    const notifications = useReactiveVar(notificationData);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const goToChatPage = (chatId: string) => {
        router.push('/chat/' + chatId);
    };

    const userContact = contact!.users![0];

    const room = notifications!.find((room) => room?.chat.id === contact.id);

    const notificationLenght = room?.messages_id ? room?.messages_id?.length : 0;

    const classListNotification = `${
        theme === 'dark' ? styles.NotificationBd : styles.Notification
    }`;

    return (
        <CustomBox
            className={styles.ChatListItem}
            key={contact?.id}
            onClick={goToChatPage.bind(null, contact!.id!)}>
            <div className={styles.ChatListContent}>
                <img
                    src="https://cdn1.flamp.ru/cb0c3eab2e574f178382f0377d00c68f_300_300.jpg"
                    alt="contact"
                    className={styles.ChatImg}
                />
                <div className={styles.ChatContent}>
                    <Typography variant="body1">{userContact?.login}</Typography>
                    <Typography variant="body2">{userContact?.phone}</Typography>
                </div>
            </div>
            {notificationLenght > 0 && (
                <div className={classListNotification}>{notificationLenght}</div>
            )}
        </CustomBox>
    );
};

export default ChatItemList;
