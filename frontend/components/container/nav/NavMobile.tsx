import { IconButton, styled } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC, useContext } from 'react';
import Link from 'next/link';

import styles from './Nav.module.scss';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { notificationData, userData } from '../../../graphql/store/auth';
import { ThemeContext } from '../../../pages/_app';
import { TypeMenuContext } from '../../layouts/UserLayout/UserLayout';
import BoxBorderRight from '../../ui/BoxBorderRight';
import { useReactiveVar } from '@apollo/client';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { SocketIo } from '../../../util/socket';

const CustomLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.default,
    },
}));

const CustomChangeTheme = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.default,
    },
}));

const CustomLoggoutTheme = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    ':hover': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.background.default,
    },
}));

const NavMobile: FC<{ onDrawer: () => void }> = ({ onDrawer }) => {
    const router = useRouter();
    const notifications = useReactiveVar(notificationData);
    const themeContext = useContext(ThemeContext);

    const countNotification = notifications!.filter(
        (notif) => !!notif && !!notif!.messages_id && notif!.messages_id!.length,
    );

    const themeChange = () => {
        themeContext.changeTheme();
        onDrawer();
    };

    const loggoutUser = () => {
        SocketIo()?.disconnect();
        userData(null);
        localStorage.removeItem('auth_token');
        onDrawer();
        router.push('/login');
    };

    const NavClasses = `${styles.Nav} ${styles.BigNav}`;
    const NotificationClasses = `${
        themeContext.theme === 'dark' ? styles.NotificationBlack : styles.Notification
    } ${styles.MiniNotification}`;

    return (
        <BoxBorderRight className={NavClasses}>
            <div>
                <nav className={styles.NavContent}>
                    <CustomLink
                        href={'/' + userData()!.id}
                        onClick={onDrawer}
                        className={styles.NavLink + ' ' + styles.NavLinkActive}>
                        <PersonIcon />
                        <div className={styles.NavLinkTxt}>Профиль</div>
                    </CustomLink>
                    <CustomLink href="/post" className={styles.NavLink} onClick={onDrawer}>
                        <NewspaperIcon />
                        <div className={styles.NavLinkTxt}>Посты</div>
                    </CustomLink>
                    <CustomLink
                        href="/chat"
                        onClick={onDrawer}
                        className={styles.NavLink + ' ' + styles.NavLinkNotification}>
                        <div className={styles.NanContent}>
                            <MessageIcon />
                            <div className={styles.NavLinkTxt}>Сообщения</div>
                        </div>
                        {countNotification!.length! > 0 && (
                            <div className={NotificationClasses}>{countNotification!.length}</div>
                        )}
                    </CustomLink>
                    <CustomLink href="/search" className={styles.NavLink} onClick={onDrawer}>
                        <SearchIcon />
                        <div className={styles.NavLinkTxt}>Поиск</div>
                    </CustomLink>
                    <CustomChangeTheme className={styles.NavLink} onClick={themeChange}>
                        {themeContext.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        <div className={styles.NavLinkTxt}>Ночной режим</div>
                    </CustomChangeTheme>
                </nav>
            </div>
            <CustomLoggoutTheme className={styles.NavLink} onClick={loggoutUser}>
                <LogoutIcon />
                <div className={styles.NavLinkTxt}>Выйти</div>
            </CustomLoggoutTheme>
        </BoxBorderRight>
    );
};

export default NavMobile;
