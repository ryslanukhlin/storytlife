import { Avatar, Box, Button, IconButton, InputBase, styled, Typography } from '@mui/material';
import React, { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatContent.module.scss';
import SendIcon from '@mui/icons-material/Send';
import { useReactiveVar } from '@apollo/client';
import { userData } from '../../../graphql/store/auth';
import { useRouter } from 'next/router';
import {
    useCreateMessageMutation,
    useGetMessagesLazyQuery,
    useNewMessageSubscription,
    useCreateCallMutation,
    useChanhgeOnlineStatusSubscription,
} from '../../../graphql/generated';
import { TypeMenuContext } from '../../layouts/UserLayout/UserLayout';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import CallOffetModal from '../../ui/modal/CallOffetModal';
import Message from '../Message/Message';
import { BackPort } from '../../../config';
import { deepOrange } from '@mui/material/colors';
import { OfflineBadge, OnlineBadge } from '../../ui/OnlineBadge';
import { chatData } from '../../../graphql/store/chat';
import ErrorCall from '../../ui/modal/ErrorCall';
import { checkMediaDevices } from '../../../util/checkMediaDevices';

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

export type MessageType = {
    __typename?: 'Message' | undefined;
    id: string;
    user_id: string;
    text: string;
} | null;

const ChatContent = () => {
    const router = useRouter();
    const blockMessagesRef = useRef<HTMLDivElement>(null);
    const { bigNav } = useContext(TypeMenuContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [call, setCall] = useState<{ usingVideo: boolean } | null>(null);

    const [callErr, setCallErr] = useState<string | null>(null);

    const [getMessages] = useGetMessagesLazyQuery();
    const [createMessage] = useCreateMessageMutation();
    const [createCall] = useCreateCallMutation();

    const chatId = window.location.pathname.split('/').at(-1)!;

    const [frend, setFrend] = useState(chatData().find((chat) => chat?.id === chatId)?.users![0]!);

    const closeCall = () => {
        setCall(null);
    };

    const onClose = () => {
        setCallErr(null);
    };

    const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMesssage = async () => {
        if (message.replace(/\s+/g, '')) {
            const { data, errors } = await createMessage({
                variables: {
                    messageInput: {
                        roomId: chatId,
                        txt: message,
                        userId: frend?.id!,
                    },
                },
            });
            setMessage('');
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }
    };

    const callHandler = async (usingVideo: boolean) => {
        if (!frend.is_onlite) {
            setCallErr('Пользователь должен быть в сети чтобы вы смогли ему позвонить!');
            return;
        }
        if (!(await checkMediaDevices())) {
            setCallErr('На устройстве должны быть видео и аудио записываюшее устройства!');
            return;
        }
        setCall({ usingVideo });
        createCall({
            variables: {
                createCallInput: {
                    chatId,
                    userId: frend?.id!,
                    usingVideo,
                },
            },
        });
    };

    useNewMessageSubscription({
        variables: {
            roomId: chatId,
        },
        onData: (options) => {
            setMessages((prev) => [...prev, options.data.data!.newMessage!]);
        },
    });

    const scrollBotton = () => {
        window.scrollTo({ top: blockMessagesRef.current?.scrollHeight });
    };

    useChanhgeOnlineStatusSubscription({
        variables: {
            userId: frend!.id,
        },
        onData: (option) => {
            setFrend({ ...frend, is_onlite: option.data.data!.chanhgeOnlineStatus });
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

    useLayoutEffect(() => {
        setTimeout(() => {
            scrollBotton();
        }, 100);
    }, []);

    const classesChatFooter = `${styles.ChatFooter} ${
        bigNav ? styles.maxWidthBigNav : styles.maxWidthSmallNav
    }`;

    const classesChatHeader = `${styles.ChatHeaderContent} ${
        bigNav ? styles.maxWidthBigNav : styles.maxWidthSmallNav
    }`;

    return (
        <div className={styles.ChatContent}>
            {call && (
                <CallOffetModal
                    frend={frend!}
                    closeModal={closeCall}
                    usingVideo={call.usingVideo}
                />
            )}
            {callErr && <ErrorCall onClose={onClose}>{callErr}</ErrorCall>}
            <div className={styles.ChatHeader}>
                <CustomHeader className={classesChatHeader}>
                    <div className={styles.ChatHeaderUserInfo}>
                        {frend?.is_onlite ? (
                            <OnlineBadge>
                                <Avatar
                                    src={
                                        frend!.img
                                            ? BackPort + 'img/avatar/' + frend!.img
                                            : undefined
                                    }
                                    alt="contact"
                                    sx={{ backgroundColor: deepOrange[500] }}
                                    className={styles.ChatHeaderImg}>
                                    R
                                </Avatar>
                            </OnlineBadge>
                        ) : (
                            <OfflineBadge>
                                <Avatar
                                    src={
                                        frend!.img
                                            ? BackPort + 'img/avatar/' + frend!.img
                                            : undefined
                                    }
                                    alt="contact"
                                    sx={{ backgroundColor: deepOrange[500] }}
                                    className={styles.ChatHeaderImg}>
                                    R
                                </Avatar>
                            </OfflineBadge>
                        )}

                        <div className={styles.ChatHeaderDescription}>
                            <Typography variant="body1">{frend?.login}</Typography>
                            <Typography variant="body2">{frend?.phone}</Typography>
                        </div>
                    </div>
                    <div>
                        <IconButton size="large" onClick={callHandler.bind(null, false)}>
                            <LocalPhoneIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="large" onClick={callHandler.bind(null, true)}>
                            <VideocamOutlinedIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                </CustomHeader>
            </div>
            <MessageContainer className={styles.ChatMessages} ref={blockMessagesRef}>
                {messages?.map((message) => (
                    <Message key={message?.id} message={message} />
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
