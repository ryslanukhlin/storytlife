import { useReactiveVar } from '@apollo/client';
import { styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import React from 'react';
import { userData } from '../../../graphql/store/auth';
import BoxBorderRight from '../../ui/BoxBorderRight';

import styles from './ChatList.module.scss';

const CustomBox = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.default,
    },
}));

const ChatItem = () => {
    const router = useRouter();
    const user = useReactiveVar(userData);

    const goToChatPage = (chatId: string) => {
        router.push('/chat/' + chatId);
    };

    return (
        <BoxBorderRight className={styles.ChatList}>
            {user?.chats?.length === 0 && (
                <Typography variant="body1">
                    Перейдите в раздел 'сообшения' <br /> и выберете кому хотите написать
                </Typography>
            )}
            {user?.chats!.map((contact) => {
                const user = contact!.users![0];

                return (
                    <CustomBox
                        className={styles.ChatListItem}
                        key={contact?.id}
                        onClick={goToChatPage.bind(null, contact!.id!)}>
                        <img
                            src="https://cdn1.flamp.ru/cb0c3eab2e574f178382f0377d00c68f_300_300.jpg"
                            alt="contact"
                            className={styles.ChatImg}
                        />
                        <div className={styles.ChatContent}>
                            <Typography variant="body1">{user?.login}</Typography>
                            <Typography variant="body2">{user?.phone}</Typography>
                        </div>
                    </CustomBox>
                );
            })}
        </BoxBorderRight>
    );
};

export default ChatItem;
