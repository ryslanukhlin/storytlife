import { useReactiveVar } from '@apollo/client';
import { Box, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef } from 'react';
import { useDeleteNotificationMutation } from '../../../graphql/generated';
import { notificationData, userData } from '../../../graphql/store/auth';
import { MessageType } from '../ChatContent/ChatContent';
import { BackPort } from '../../../config';
import { ThemeContext } from '../../../pages/_app';

import styles from './Message.module.scss';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const MyMessage = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
}));

const AnotherMessage = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const Message: FC<{ message: MessageType }> = ({ message }) => {
    const router = useRouter();
    const user = useReactiveVar(userData);
    const messageRef = useRef<HTMLDivElement>(null);
    const [deleteNotification] = useDeleteNotificationMutation();
    const themeContext = useContext(ThemeContext);

    const funcVisibleHandler = () => visibleHandler(messageRef.current!);

    const visibleHandler = function (target: HTMLDivElement) {
        // Все позиции элемента
        const targetPosition = {
                top: window.scrollY + target.getBoundingClientRect().top + 95,
                left: window.scrollX + target.getBoundingClientRect().left,
                right: window.scrollX + target.getBoundingClientRect().right,
                bottom: window.scrollY + target.getBoundingClientRect().bottom,
            },
            // Получаем позиции окна
            windowPosition = {
                top: window.scrollY,
                left: window.scrollX,
                right: window.scrollX + document.documentElement.clientWidth,
                bottom: window.scrollY + document.documentElement.clientHeight,
            };
        console.log(
            targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
                targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
                targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
                targetPosition.left < windowPosition.right,
        );

        if (
            targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
            targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
            targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
            targetPosition.left < windowPosition.right
        ) {
            // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
            // Если элемент полностью видно, то запускаем следующий код
            const updateNotif = notificationData()!.reduce((arr: any[], notif) => {
                if (notif?.chat.id === router.query.id) {
                    const messageArr = notif?.messages_id!.reduce((arr: any[], mess) => {
                        if (mess === message?.id) {
                            (async () => {
                                await deleteNotification({
                                    variables: {
                                        deleteInputNotification: {
                                            messageId: mess,
                                            notificationId: notif.id,
                                        },
                                    },
                                });
                            })();
                            return [...arr];
                        }
                        return [...arr, mess];
                    }, []);
                    return [
                        ...arr,
                        {
                            id: notif?.id!,
                            __typename: 'MessageNotification',
                            messages_id: messageArr,
                            chat: { __typename: 'Chat', id: router.query.id! },
                        },
                    ];
                }
                return [...arr, notif];
            }, []);
            notificationData(updateNotif);
            window.removeEventListener('scroll', funcVisibleHandler);
        }
    };

    useEffect(() => {
        if (messageRef.current !== null) {
            const notifRoom = notificationData()!.find((not) => not?.chat.id === router.query.id);
            if (notifRoom) {
                const messageNot = notifRoom?.messages_id?.find((mess) => mess === message?.id);
                if (messageNot) {
                    window.addEventListener('scroll', funcVisibleHandler);
                    funcVisibleHandler();
                }
            }
        }
        return () => {
            window.removeEventListener('scroll', funcVisibleHandler);
        };
    }, [messageRef.current]);

    const downloadFile = (file: { basicName: string; generateName: string }) => {
        fetch(BackPort + 'img/messages_file/' + file.generateName)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = URL.createObjectURL(new Blob([blob]));
                const tag = document.createElement('a');
                tag.href = blobUrl;
                tag.setAttribute('download', file.basicName);
                document.body.appendChild(tag);
                tag.click();
                tag.remove();
            });
    };

    return (
        <div ref={messageRef}>
            {message?.user_id === user?.id ? (
                <MyMessage className={styles.MyMessage} key={message?.id}>
                    {message?.text}
                    <div className={styles.FilesWrapper}>
                        {message?.files.map((file) => (
                            <a
                                className={
                                    themeContext.theme === 'white'
                                        ? styles.FileLink
                                        : styles.FileLinkDark
                                }
                                key={file.generateName}
                                onClick={downloadFile.bind(null, file)}>
                                <InsertDriveFileIcon />

                                <div className={styles.FileName}>{file.basicName}</div>
                            </a>
                        ))}
                    </div>
                </MyMessage>
            ) : (
                <AnotherMessage className={styles.Message} key={message?.id}>
                    {message?.text}
                    <div className={styles.FilesWrapper}>
                        {message?.files.map((file) => (
                            <a
                                className={
                                    themeContext.theme === 'white'
                                        ? styles.FileLink
                                        : styles.FileLinkDark
                                }
                                key={file.generateName}
                                onClick={downloadFile.bind(null, file)}>
                                <InsertDriveFileIcon />
                                <div className={styles.FileName}>{file.basicName}</div>
                            </a>
                        ))}
                    </div>
                </AnotherMessage>
            )}
        </div>
    );
};

export default Message;
