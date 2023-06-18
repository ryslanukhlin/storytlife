import { useReactiveVar } from '@apollo/client';
import { Avatar, Box, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';
import { BackPort } from '../../../config';
import { Chat, notificationData } from '../../../graphql/store/auth';
import { ThemeContext } from '../../../pages/_app';
import { deepOrange } from '@mui/material/colors';
import { OfflineBadge, OnlineBadge } from '../../ui/OnlineBadge';
import { SocketIo } from '../../../util/socket';

import styles from './ChatList.module.scss';

const CustomBox = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.default,
    },
}));

const ChatItemList: FC<{ contact: Chat }> = ({ contact }) => {
    const [frend, setFrend] = useState(contact.users![0]!);
    const notifications = useReactiveVar(notificationData);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const goToChatPage = (chatId: string) => {
        router.push('/chat/' + chatId);
    };

    const room = notifications!.find((room) => room?.chat.id === contact.id);

    const notificationLenght = room?.messages_id ? room?.messages_id?.length : 0;

    const classListNotification = `${
        theme === 'dark' ? styles.NotificationBd : styles.Notification
    }`;

    useEffect(() => {
        SocketIo()?.emit('join', {
            userId: contact.users![0]?.id!,
        });
        SocketIo()?.on('ChangeOnline', (is_onlite: boolean, id: string) => {
            if (id === contact.users![0]?.id!) setFrend({ ...frend, is_onlite });
        });
    }, []);

    return (
        <CustomBox
            className={styles.ChatListItem}
            key={contact?.id}
            onClick={goToChatPage.bind(null, contact!.id!)}>
            <div className={styles.ChatListContent}>
                {frend.is_onlite ? (
                    <OnlineBadge>
                        <Avatar
                            src={frend.img ? BackPort + 'img/avatar/' + frend.img : undefined}
                            sx={{ backgroundColor: deepOrange[500] }}
                            alt="contact"
                            className={styles.ChatImg}>
                            {frend.login[0]}
                        </Avatar>
                    </OnlineBadge>
                ) : (
                    <OfflineBadge>
                        <Avatar
                            src={frend.img ? BackPort + 'img/avatar/' + frend.img : undefined}
                            sx={{ backgroundColor: deepOrange[500] }}
                            alt="contact"
                            className={styles.ChatImg}>
                            {frend.login[0]}
                        </Avatar>
                    </OfflineBadge>
                )}
                <div className={styles.ChatContent}>
                    <Typography variant="body1">{frend.login}</Typography>
                    <Typography variant="body2">{frend.phone}</Typography>
                </div>
            </div>
            {notificationLenght > 0 && (
                <div className={classListNotification}>{notificationLenght}</div>
            )}
        </CustomBox>
    );
};

export default ChatItemList;
