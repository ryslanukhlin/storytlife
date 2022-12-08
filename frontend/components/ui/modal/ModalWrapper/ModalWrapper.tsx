import React, { FC, useEffect } from 'react';

import styles from './ModalWrapper.module.scss';

const ModalWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    return (
        <div className={styles.ModalWrapper}>
            <div className={styles.Modal}>{children}</div>
        </div>
    );
};

export default ModalWrapper;
