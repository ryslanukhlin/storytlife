import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { createContext, FC, ReactNode, useState } from 'react';
import { useNewCreteCallSubscription } from '../../../graphql/generated';
import { userData } from '../../../graphql/store/auth';
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
    const [bigNav, setBigNav] = useState(true);
    const [callFrend, setFrendCall] = useState<AnserCallUser | null>(null);

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
