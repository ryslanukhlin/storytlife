import { Avatar, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { BackPort } from '../../../config';
import { Frend } from '../../../graphql/store/auth';

import styles from './CallHeader.module.scss';

const CallHeader: FC<{ frend: Frend }> = ({ frend }) => {
    return (
        <div className={styles.CallWrapper}>
            <Avatar
                src={frend!.img ? BackPort + 'img/avatar/' + frend!.img : undefined}
                alt="contact"
                className={styles.CallImg}>
                {frend.login[0]}
            </Avatar>
            <Typography variant="h6">{frend.login}</Typography>
            <Typography variant="body1">{frend.phone}</Typography>
        </div>
    );
};

export default memo(CallHeader);
