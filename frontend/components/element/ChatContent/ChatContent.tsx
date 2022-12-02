import { Box, Button, InputBase, styled, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import styles from './ChatContent.module.scss';
import SendIcon from '@mui/icons-material/Send';
import { useReactiveVar } from '@apollo/client';
import { userData } from '../../../graphql/store/auth';
import { useRouter } from 'next/router';
import {
    useCreateMessageMutation,
    useGetMessagesLazyQuery,
    useNewMessageSubscription,
} from '../../../graphql/generated';
import { TypeMenuContext } from '../../layouts/UserLayout/UserLayout';

const CustomHeader = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const CustomFooter = styled(Box)(({ theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const ChatInput = styled(InputBase)(({ theme }) => ({
    border: `1px solid ${theme.palette.text.disabled}`,
    borderRight: 0,
    borderRadius: `10px 0 0 10px`,
    ':focus': {
        border: `1px solid ${theme.palette.text.secondary}`,
    },
}));

const MessageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

type Message = {
    __typename?: 'Message' | undefined;
    id: string;
    user_id: string;
    text: string;
} | null;

const ChatContent = () => {
    const { bigNav, changeViewNav } = useContext(TypeMenuContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [getMessages] = useGetMessagesLazyQuery();
    const [createMessage] = useCreateMessageMutation();

    const user = useReactiveVar(userData);
    const chatId = window.location.pathname.split('/').at(-1)!;
    const frend = user?.chats?.find((chat) => chat?.id === chatId)?.users![0];

    const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMesssage = async () => {
        if (message.replace(/\s+/g, '')) {
            await createMessage({
                variables: {
                    messageInput: {
                        roomId: chatId,
                        txt: message,
                    },
                },
            });
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }
    };

    useNewMessageSubscription({
        variables: {
            roomId: chatId,
        },
        onData: (options) => {
            setMessages((prev) => [...prev, options.data.data!.newMessage!]);
        },
    });

    useEffect(() => {
        (async () => {
            const { data } = await getMessages({
                variables: { roomId: chatId },
                fetchPolicy: 'network-only',
            });

            setMessages(data!.getMessages!);
        })();
    }, [chatId]);

    const classesChatFooter = `${styles.ChatFooter} ${
        bigNav ? styles.maxWidthBigNav : styles.maxWidthSmallNav
    }`;

    return (
        <div className={styles.ChatContent}>
            <div className={styles.ChatHeader}>
                <CustomHeader className={styles.ChatHeaderContent}>
                    <img
                        src="https://cdn1.flamp.ru/cb0c3eab2e574f178382f0377d00c68f_300_300.jpg"
                        alt="contact"
                        className={styles.ChatHeaderImg}
                    />
                    <div className={styles.ChatHeaderDescription}>
                        <Typography variant="body1">{frend?.login}</Typography>
                        <Typography variant="body2">{frend?.phone}</Typography>
                    </div>
                </CustomHeader>
            </div>
            <MessageContainer className={styles.ChatMessages}>
                {messages?.map((message) => (
                    <div
                        className={
                            message?.user_id === user?.id ? styles.MyMessage : styles.Message
                        }
                        key={message?.id}>
                        {message?.text}
                    </div>
                ))}
            </MessageContainer>
            <CustomFooter className={classesChatFooter}>
                <ChatInput
                    placeholder="Введите сообшение"
                    className={styles.ChatInput}
                    value={message}
                    onChange={changeMessage}
                />
                <Button
                    onClick={sendMesssage}
                    disableRipple
                    variant="contained"
                    endIcon={<SendIcon />}
                    className={styles.ChatButton}>
                    Отправить
                </Button>
            </CustomFooter>
        </div>
    );
};

export default ChatContent;
