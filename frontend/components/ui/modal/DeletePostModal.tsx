import React, { FC } from 'react';
import ModalWrapper from './ModalWrapper/ModalWrapper';
import { Button, Typography } from '@mui/material';

import styles from './ModalWrapper/ModalWrapper.module.scss';

const DeletePostModal: FC<{ close: () => void; deletePost: () => void }> = ({
    close,
    deletePost,
}) => {
    return (
        <ModalWrapper>
            <Typography
                variant="h6"
                component="div"
                color="error"
                style={{ marginBottom: 10, textAlign: 'center' }}>
                Вы действительно хотите удалить пост?
            </Typography>
            <div className={styles.ModalActionCall}>
                <Button onClick={deletePost}>Удалить</Button>
                <Button onClick={close}>Отмена</Button>
            </div>
        </ModalWrapper>
    );
};

export default DeletePostModal;
