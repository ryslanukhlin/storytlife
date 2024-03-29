import { Button, Typography } from '@mui/material';
import { FC } from 'react';
import ModalWrapper from './ModalWrapper/ModalWrapper';

const ErrorCallModal: FC<{ children: React.ReactNode; onClose: () => void }> = ({
    children,
    onClose,
}) => {
    return (
        <ModalWrapper>
            <Typography variant="h5" component="div" color="error" sx={{ marginBottom: 1 }}>
                Предупреждение!
            </Typography>
            <div>{children}</div>
            <Button sx={{ marginTop: 2 }} onClick={onClose}>
                Понятно
            </Button>
        </ModalWrapper>
    );
};

export default ErrorCallModal;
