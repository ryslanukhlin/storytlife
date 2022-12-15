import { useReactiveVar } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { TypeUser, userData } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';

import styles from './UserHeader.module.scss';

const UserHeader: FC<{ user: UserPageInfo | TypeUser }> = ({ user }) => {
    return (
        <Box sx={{ boxShadow: 3 }} className={styles.UserHeader}>
            <div className={styles.UserBackground} />
            <div className={styles.UserInfo}>
                <img
                    className={styles.UserImg}
                    src="https://cdn1.flamp.ru/cb0c3eab2e574f178382f0377d00c68f_300_300.jpg"
                />
                <Typography variant="h6">{user?.login}</Typography>
                <Typography variant="body1">{user?.phone}</Typography>
            </div>
        </Box>
    );
};

export default UserHeader;
