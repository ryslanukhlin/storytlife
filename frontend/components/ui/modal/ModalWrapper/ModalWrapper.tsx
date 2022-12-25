import React, { FC, useEffect } from 'react';

import styles from './ModalWrapper.module.scss';

import { Box, styled } from '@mui/material';

const BoxModal = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const ModalWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
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
