import { Button, IconButton, Typography } from '@mui/material';
import React, { FC } from 'react';
import { userData } from '../../../graphql/store/auth';
import ModalWrapper from './ModalWrapper/ModalWrapper';

import styles from './ModalWrapper/ModalWrapper.module.scss';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useReactiveVar } from '@apollo/client';
import {
    AcceptCall,
    useAcceptCallMutation,
    useNewCancelCallSubscription,
} from '../../../graphql/generated';
import { useRouter } from 'next/router';
import { CallType } from '../../../type/call.type';

type CallAnswerModalProps = {
    callPayload: { chatId: string; usingVideo: boolean };
    closeModal: () => void;
};

const CallAnswerModal: FC<CallAnswerModalProps> = ({ callPayload, closeModal }) => {
    const router = useRouter();
    const { chatId, usingVideo } = callPayload;
    const user = useReactiveVar(userData);
    const frend = user?.chats!.find((chat) => chat?.id === chatId)?.users![0];
    const [acceptCall] = useAcceptCallMutation();

    const answerCallHandler = async (isAccept: AcceptCall) => {
        if (isAccept === AcceptCall.Accept)
            await router.push({
                pathname: '/call/[id]',
                query: {
                    usingVideo,
                    type: CallType.ANSWER,
                    id: chatId,
                },
            });
        await acceptCall({
            variables: {
                acceptCallInput: {
                    acceptCall: isAccept,
                    chatId,
                    userId: frend?.id!,
                },
            },
        });
        closeModal();
    };

    useNewCancelCallSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => closeModal(),
    });

    return (
        <ModalWrapper>
            <Typography variant="h6">Входяший звонок от {frend!.login}</Typography>
            <Typography variant="body1">Примите или отклоните звонок</Typography>
            <div className={styles.ModalActionCall}>
                <Button
                    size="large"
                    color="success"
                    variant="contained"
                    onClick={answerCallHandler.bind(null, AcceptCall.Accept)}>
                    <CallIcon />
                </Button>
                <Button
                    size="large"
                    color="error"
                    variant="contained"
                    onClick={answerCallHandler.bind(null, AcceptCall.Deny)}>
                    <CallEndIcon />
                </Button>
            </div>
        </ModalWrapper>
    );
};

export default CallAnswerModal;
