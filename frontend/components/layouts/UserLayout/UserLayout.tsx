import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import {
    useChanhgeOnlineStatusSubscription,
    useNewAvatarSubscription,
    useNewBgSubscription,
    useNewCreateRoomSubscription,
    useNewCreteCallSubscription,
    useNewNotificationSubscription,
    useSetOnlineStatusMutation,
} from '../../../graphql/generated';
import { notificationData, userData } from '../../../graphql/store/auth';
import Nav from '../../container/nav/Nav';
import CallAnswerModal from '../../ui/modal/CallAnswerModal';

import styles from './UserLayout.module.scss';

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
    const router = useRouter();
    const user = useReactiveVar(userData);
    const notification = useReactiveVar(notificationData);
    const [bigNav, setBigNav] = useState(true);
    const [callFrend, setFrendCall] = useState<AnserCallUser | null>(null);
    const [chanheStatusOnline] = useSetOnlineStatusMutation();

    const changeViewNav = () => setBigNav((prev) => !prev);

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
            userData({ ...user!, chats: [...user!.chats!, option.data.data!.newCreateRoom] });
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

    useChanhgeOnlineStatusSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            console.log('online');

            userData({ ...user!, is_onlite: option.data.data!.chanhgeOnlineStatus });
        },
    });

    useEffect(() => {
        chanheStatusOnline({
            variables: {
                online: true,
            },
        });

        const setOffline = async () =>
            await chanheStatusOnline({
                variables: {
                    online: false,
                },
            });

        window.addEventListener('beforeunload', setOffline);

        return () => {
            window.removeEventListener('beforeunload', setOffline);
        };
    }, []);

    const PageWrapperClasses = `${styles.PageWrapper} ${
        bigNav ? styles.BigNavMargin : styles.MiniNavMargin
    } ${router.pathname !== '/chat' && router.pathname !== '/chat/[id]' && 'PageWrapper'}`;

    if (router.pathname === '/call/[id]') return <>{children}</>;

    return (
        <div className={styles.AuthWrapper}>
            <TypeMenuContext.Provider value={{ bigNav, changeViewNav }}>
                <Nav />
                <Box className={PageWrapperClasses}>{children}</Box>
                {callFrend && <CallAnswerModal callPayload={callFrend} closeModal={closeModal} />}
            </TypeMenuContext.Provider>
        </div>
    );
};

export default UserLayout;
