import { IconButton, styled } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import Link from 'next/link';

import styles from './Nav.module.scss';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { userData } from '../../../graphql/store/auth';
import { ThemeContext } from '../../../pages/_app';
import { TypeMenuContext } from '../../layouts/UserLayout/UserLayout';
import BoxBorderRight from '../../ui/BoxBorderRight';

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

const Nav = () => {
    const themeContext = useContext(ThemeContext);
    const { bigNav, changeViewNav } = useContext(TypeMenuContext);

    const NavClasses = `${styles.Nav} ${bigNav ? styles.BigNav : ''}`;

    return (
        <BoxBorderRight className={NavClasses}>
            <div className={styles.NavHeader}>
                {bigNav && <h1 className={styles.NavTitle}>StoryLife</h1>}
                <IconButton
                    onClick={changeViewNav}
                    className={styles.NavClose}
                    size="large"
                    color="inherit"
                    aria-label="menu">
                    <MenuIcon />
                </IconButton>
            </div>
            <nav className={styles.NavContent}>
                <CustomLink
                    href={userData()!.id}
                    className={styles.NavLink + ' ' + styles.NavLinkActive}>
                    <PersonIcon />
                    {bigNav && <div className={styles.NavLinkTxt}>Профиль</div>}
                </CustomLink>
                <CustomLink href="/chat" className={styles.NavLink}>
                    <MessageIcon />
                    {bigNav && <div className={styles.NavLinkTxt}>Сообшения</div>}
                </CustomLink>
                <CustomLink href="/search" className={styles.NavLink}>
                    <SearchIcon />
                    {bigNav && <div className={styles.NavLinkTxt}>Поиск</div>}
                </CustomLink>
                <CustomChangeTheme className={styles.NavLink} onClick={themeContext.changeTheme}>
                    {themeContext.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    {bigNav && <div className={styles.NavLinkTxt}>Ночной режим</div>}
                </CustomChangeTheme>
            </nav>
        </BoxBorderRight>
    );
};

export default Nav;
