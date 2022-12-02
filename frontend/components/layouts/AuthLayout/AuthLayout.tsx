import { IconButton } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import styles from './AuthLayout.module.scss';
import { ThemeContext } from '../../../pages/_app';

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const themeContext = useContext(ThemeContext);

    return (
        <div className={styles.AuthLayout}>
            <div className={styles.AuthContent}>
                <div className={styles.AuthHeader}>
                    <h1>StoryLife</h1>
                    <IconButton
                        onClick={themeContext.changeTheme}
                        style={{ width: 48, height: 48 }}
                        color="inherit">
                        {themeContext.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>
                <div className={styles.AuthForm}>{children}</div>
            </div>
            <div className={styles.AuthImg} />
        </div>
    );
};

export default AuthLayout;
