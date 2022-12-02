import { Box, styled } from '@mui/material';
import React, { createContext, FC, ReactNode, useState } from 'react';
import Nav from '../../container/nav/Nav';

import styles from './UserLayout.module.scss';

type ViewMenuContext = {
    bigNav: boolean;
    changeViewNav: () => void;
};

export const TypeMenuContext = createContext<ViewMenuContext>({} as ViewMenuContext);

const UserLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const [bigNav, setBigNav] = useState(true);

    const changeViewNav = () => setBigNav((prev) => !prev);

    const PageWrapperClasses = `${styles.PageWrapper} ${
        bigNav ? styles.BigNavMargin : styles.MiniNavMargin
    }`;

    return (
        <div className={styles.AuthWrapper}>
            <TypeMenuContext.Provider value={{ bigNav, changeViewNav }}>
                <Nav />
                <Box className={PageWrapperClasses}>{children}</Box>
            </TypeMenuContext.Provider>
        </div>
    );
};

export default UserLayout;
