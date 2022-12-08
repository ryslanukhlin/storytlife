import { Typography } from '@mui/material';
import React, { FC } from 'react';
import { Frend } from '../../../graphql/store/auth';

import styles from './CallHeader.module.scss';

const CallHeader: FC<{ frend: Frend }> = ({ frend }) => {
    return (
        <div className={styles.CallWrapper}>
            <img
                src="https://cdn1.flamp.ru/cb0c3eab2e574f178382f0377d00c68f_300_300.jpg"
                alt="contact"
                className={styles.CallImg}
            />
            <Typography variant="h6">{frend.login}</Typography>
            <Typography variant="body1">{frend.phone}</Typography>
        </div>
    );
};

export default CallHeader;
