import { useReactiveVar } from '@apollo/client';
import { Box, styled } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef } from 'react';
import { useDeleteNotificationMutation } from '../../../graphql/generated';
import { notificationData, userData } from '../../../graphql/store/auth';
import { MessageType } from '../ChatContent/ChatContent';

import styles from './Message.module.scss';

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

    const funcVisibleHandler = () => visibleHandler(messageRef.current!);

    const visibleHandler = function (target: HTMLDivElement) {
        // Все позиции элемента
        const targetPosition = {
                top: window.pageYOffset + target.getBoundingClientRect().top + 100,
                left: window.pageXOffset + target.getBoundingClientRect().left,
                right: window.pageXOffset + target.getBoundingClientRect().right,
                bottom: window.pageYOffset + target.getBoundingClientRect().bottom,
            },
            // Получаем позиции окна
            windowPosition = {
                top: window.pageYOffset,
                left: window.pageXOffset,
                right: window.pageXOffset + document.documentElement.clientWidth,
                bottom: window.pageYOffset + document.documentElement.clientHeight,
            };

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
        const notifRoom = notificationData()!.find((not) => not?.chat.id === router.query.id);
        if (notifRoom) {
            const messageNot = notifRoom?.messages_id?.find((mess) => mess === message?.id);
            if (messageNot) {
                window.addEventListener('scroll', funcVisibleHandler);
                funcVisibleHandler();
            }
        }
        return () => {
            window.removeEventListener('scroll', funcVisibleHandler);
        };
    }, []);

    return (
        <div ref={messageRef}>
            {message?.user_id === user?.id ? (
                <MyMessage className={styles.MyMessage} key={message?.id}>
                    {message?.text}
                </MyMessage>
            ) : (
                <AnotherMessage className={styles.Message} key={message?.id}>
                    {message?.text}
                </AnotherMessage>
            )}
        </div>
    );
};

export default Message;
