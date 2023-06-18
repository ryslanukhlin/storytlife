import { useReactiveVar } from '@apollo/client';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FC } from 'react';
import {
    AcceptCall,
    useCancelCallMutation,
    useNewAcceptCallSubscription,
} from '../../../graphql/generated';
import { Frend, userData } from '../../../graphql/store/auth';
import { CallType } from '../../../type/call.type';
import ModalWrapper from './ModalWrapper/ModalWrapper';

import styles from './ModalWrapper/ModalWrapper.module.scss';

type CallOffetModalProps = {
    frend: Frend;
    closeModal: () => void;
    usingVideo: boolean;
};

const CallOffetModal: FC<CallOffetModalProps> = ({ frend, closeModal, usingVideo }) => {
    const router = useRouter();
    const user = useReactiveVar(userData);
    const [cancelCall] = useCancelCallMutation();

    const cancelCallHandler = () => {
        cancelCall({
            variables: {
                userId: frend.id,
            },
        });
        closeModal();
    };

    useNewAcceptCallSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: (option) => {
            const { acceptCall, chatId } = option.data.data?.newAcceptCall!;
            if (acceptCall === AcceptCall.Accept)
                router.push({
                    pathname: '/call/[id]',
                    query: {
                        usingVideo,
                        type: CallType.OFFER,
                        id: chatId,
                    },
                });
            else closeModal();
        },
    });

    return (
        <ModalWrapper>
            <Typography variant="h6">Звонок {frend.login}</Typography>
            <Typography variant="body1">Подаждите пока пользователь примит звонок</Typography>
            <div className={styles.ModelAction}>
                <Button color="error" variant="contained" onClick={cancelCallHandler}>
                    Отменить
                </Button>
            </div>
        </ModalWrapper>
    );
};

export default CallOffetModal;
