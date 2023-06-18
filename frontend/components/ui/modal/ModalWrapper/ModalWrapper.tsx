import { FC, useEffect, ReactNode } from 'react';
import { Box, styled } from '@mui/material';

import styles from './ModalWrapper.module.scss';

const BoxModal = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const ModalWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    return (
        <div className={styles.ModalWrapper}>
            <BoxModal className={styles.Modal}>{children}</BoxModal>
        </div>
    );
};

export default ModalWrapper;
