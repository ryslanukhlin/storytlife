import {
    Alert,
    Avatar,
    Box,
    IconButton,
    Snackbar,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    useCreateMessageMutation,
    useGetMessagesLazyQuery,
    useNewMessageSubscription,
    useCreateCallMutation,
    CreateCallResult,
} from '../../../graphql/generated';
import { TypeMenuContext } from '../../layouts/UserLayout/UserLayout';
import CallOffetModal from '../../ui/modal/CallOffetModal';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Message from '../Message/Message';
import { BackPort } from '../../../config';
import { deepOrange } from '@mui/material/colors';
import { OfflineBadge, OnlineBadge } from '../../ui/OnlineBadge';
import { chatData } from '../../../graphql/store/chat';
import ErrorCallModal from '../../ui/modal/ErrorCallModal';
import { checkMediaDevices } from '../../../util/checkMediaDevices';
import { SocketIo } from '../../../util/socket';
import { useRouter } from 'next/router';

import styles from './ChatContent.module.scss';
import SendIcon from '@mui/icons-material/Send';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

const CustomHeader = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const CustomFooter = styled(Box)(({ theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const MessageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export type MessageType = {
    __typename?: 'Message' | undefined;
    id: string;
    user_id: string;
    files: Array<{
        basicName: string;
        generateName: string;
    }>;
    text: string;
} | null;

const ChatContent = () => {
    const router = useRouter();
    const blockMessagesRef = useRef<HTMLDivElement>(null);
    const { bigNav } = useContext(TypeMenuContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [call, setCall] = useState<{ usingVideo: boolean } | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [errorRequest, setErrorRequest] = useState(false);
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
        if (files) {
            const data = new FormData();

            Array.from(files).forEach((file) => {
                data.append('files', file);
            });

            data.append('roomId', chatId);
            data.append('txt', message);
            data.append('userId', frend?.id!);
            const response = await fetch(BackPort + 'chat', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
                    ContentType: 'application/json',
                },
                body: data,
            });
            if (response.status === 413) {
                setErrorRequest(true);
                setFiles(null);
            }
        } else if (message.replace(/\s+/g, '')) {
            await createMessage({
                variables: {
                    messageInput: {
                        roomId: chatId,
                        txt: message,
                        userId: frend?.id!,
                    },
                },
            });
        }
        setMessage('');
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
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
        const { data } = await createCall({
            variables: {
                createCallInput: {
                    chatId,
                    userId: frend?.id!,
                    usingVideo,
                },
            },
        });
        if (data?.createCall === CreateCallResult.Success) setCall({ usingVideo });
        else setCallErr('Ваш собеседних уже разговаривает с кем-то');
    };

    const changeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
        console.log(files);
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

    useEffect(() => {
        if (!frend) return;
        SocketIo()?.emit('join', {
            userId: frend!.id,
        });
        SocketIo()?.on('ChangeOnline', (is_onlite: boolean, id: string) =>
            setFrend({ ...frend, is_onlite }),
        );
    }, []);

    const keyDownCallback = async (e: KeyboardEvent) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            await sendMesssage();
        }
    };

    const closeRequestErrorInfo = (event: React.SyntheticEvent | Event, reason?: string) => {
        setErrorRequest(false);
    };

    useLayoutEffect(() => {
        document.addEventListener('keydown', keyDownCallback);

        return () => document.removeEventListener('keydown', keyDownCallback);
    }, [message, files]);

    useEffect(() => {
        setFrend(chatData().find((chat) => chat?.id === chatId)?.users![0]!);
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

    if (!frend) {
        router.push('/404');
        return null;
    }

    return (
        <div className={styles.ChatContent}>
            <Snackbar
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                open={errorRequest}
                autoHideDuration={6000}
                onClose={closeRequestErrorInfo}>
                <Alert
                    onClose={closeRequestErrorInfo}
                    variant="filled"
                    severity="error"
                    sx={{ width: '100%' }}>
                    Фотография слишком большая
                </Alert>
            </Snackbar>
            {call && (
                <CallOffetModal
                    frend={frend!}
                    closeModal={closeCall}
                    usingVideo={call.usingVideo}
                />
            )}
            {callErr && <ErrorCallModal onClose={onClose}>{callErr}</ErrorCallModal>}
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
                                    {frend.login[0]}
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
                                    {frend.login[0]}
                                </Avatar>
                            </OfflineBadge>
                        )}

                        <div className={styles.ChatHeaderDescription}>
                            <Typography variant="body1">{frend?.login}</Typography>
                            <Typography variant="body2">{frend?.phone}</Typography>
                        </div>
                    </div>
                    <div className={styles.ChatListCallActions}>
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
                <IconButton component="label" size="medium" className={styles.FilesButton}>
                    <AttachFileIcon />
                    <input type="file" multiple hidden onChange={changeFiles} />
                </IconButton>
                <TextField
                    autoFocus
                    placeholder="Введите сообшение"
                    className={styles.ChatInput}
                    value={message}
                    fullWidth
                    onChange={changeMessage}
                />
                <IconButton className={styles.SendButton} onClick={sendMesssage}>
                    <SendIcon />
                </IconButton>
            </CustomFooter>
        </div>
    );
};

export default ChatContent;
