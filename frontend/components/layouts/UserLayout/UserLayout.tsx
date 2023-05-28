import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import {
    useNewAvatarSubscription,
    useNewBgSubscription,
    useNewCreateRoomSubscription,
    useNewCreteCallSubscription,
    useNewEditUserSubscription,
    useNewNotificationSubscription,
} from '../../../graphql/generated';
import { notificationData, userData } from '../../../graphql/store/auth';
import { chatData } from '../../../graphql/store/chat';
import useWidth from '../../../hook/useWidth';
import Header from '../../container/header/Header';
import Nav from '../../container/nav/Nav';
import CallAnswerModal from '../../ui/modal/CallAnswerModal';

import styles from './UserLayout.module.scss';
import { io } from 'socket.io-client';
import { SocketIoPort } from '../../../config';
import { SocketIo } from '../../../util/socket';

type ViewMenuContext = {
    bigNav: boolean;
    changeViewNav: () => void;
};

export const TypeMenuContext = createContext<ViewMenuContext>({} as ViewMenuContext);

type AnserCallUser = {
    chatId: string;
    usingVideo: boolean;
};

const UserLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const width = useWidth();
    const router = useRouter();
    const user = useReactiveVar(userData);
    const notification = useReactiveVar(notificationData);
    const [bigNav, setBigNav] = useState(localStorage && localStorage.getItem('bigNav') === 'true');
    const [callFrend, setFrendCall] = useState<AnserCallUser | null>(null);

    const changeViewNav = () => {
        localStorage.setItem('bigNav', String(!bigNav));
        setBigNav((prev) => !prev);
    };

    const closeModal = () => setFrendCall(null);

    useNewCreteCallSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: (option) => {
            const { chatId, usingVideo } = option.data.data?.newCreteCall!;
            setFrendCall({
                chatId,
                usingVideo,
            });
        },
    });

    useNewCreateRoomSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: (option) => {
            chatData([...chatData(), option.data.data!.newCreateRoom]);
        },
    });

    useNewNotificationSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: (option) => {
            const newNotification = option.data.data?.newNotification;
            const isCreatedRoomNotification = notification!.find(
                (notif) => notif?.chat.id === newNotification?.chat.id,
            );

            if (isCreatedRoomNotification) {
                const updateNotification = notification!.reduce((arr: any[], notif) => {
                    if (notif?.chat.id === newNotification?.chat.id) {
                        return [...arr, newNotification!];
                    }
                    return [...arr, notif];
                }, []);
                notificationData(updateNotification);
            } else {
                notificationData([...notification!, newNotification!]);
            }
        },
    });

    useNewAvatarSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            userData({ ...user!, img: option.data.data!.newAvatar });
        },
    });

    useNewBgSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            userData({ ...user!, bg: option.data.data!.newBg });
        },
    });

    useNewEditUserSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            const { __typename, ...data } = option.data.data?.newEditUser!;
            data.birthday = data!.birthday ? new Date(data.birthday!).getTime().toString() : null;
            userData({ ...userData()!, ...data });
        },
    });

    useEffect(() => {
        SocketIo(
            io(SocketIoPort, {
                query: {
                    userId: userData()?.id,
                },
            }),
        );
    });

    const PageWrapperClasses = `${styles.PageWrapper} ${
        bigNav ? styles.BigNavMargin : styles.MiniNavMargin
    } ${router.pathname !== '/chat' && router.pathname !== '/chat/[id]' && 'PageWrapper'}`;

    if (router.pathname === '/call/[id]') return <>{children}</>;

    return (
        <div className={styles.AuthWrapper}>
            <TypeMenuContext.Provider value={{ bigNav, changeViewNav }}>
                {width >= 768 ? <Nav /> : <Header />}
                <Box className={PageWrapperClasses}>{children}</Box>
                {callFrend && <CallAnswerModal callPayload={callFrend} closeModal={closeModal} />}
            </TypeMenuContext.Provider>
        </div>
    );
};

export default UserLayout;
