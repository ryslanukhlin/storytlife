import { Button, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { userData } from '../../../graphql/store/auth';
import ModalWrapper from './ModalWrapper/ModalWrapper';
import { useReactiveVar } from '@apollo/client';
import {
    AcceptCall,
    useAcceptCallMutation,
    useNewCancelCallSubscription,
} from '../../../graphql/generated';
import { useRouter } from 'next/router';
import { CallType } from '../../../type/call.type';
import { chatData } from '../../../graphql/store/chat';
import { checkMediaDevices } from '../../../util/checkMediaDevices';

import styles from './ModalWrapper/ModalWrapper.module.scss';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';

type CallAnswerModalProps = {
    callPayload: { chatId: string; usingVideo: boolean };
    closeModal: () => void;
};

const CallAnswerModal: FC<CallAnswerModalProps> = ({ callPayload, closeModal }) => {
    const router = useRouter();
    const { chatId, usingVideo } = callPayload;
    const user = useReactiveVar(userData);
    const frend = chatData().find((chat) => chat?.id === chatId)?.users![0];
    const [acceptCall] = useAcceptCallMutation();
    const [errorDevice, setErrorDevice] = useState(false);

    const answerCallHandler = async (isAccept: AcceptCall) => {
        const isHaveMicroAndAudio = await checkMediaDevices();
        if (isAccept === AcceptCall.Accept && isHaveMicroAndAudio) {
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
        } else {
            await acceptCall({
                variables: {
                    acceptCallInput: {
                        acceptCall: AcceptCall.Deny,
                        chatId,
                        userId: frend?.id!,
                    },
                },
            });
        }
        if (isHaveMicroAndAudio) closeModal();
        else {
            setErrorDevice(true);
        }
    };

    useNewCancelCallSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => closeModal(),
    });

    useEffect(() => {
        checkMediaDevices();
    }, []);

    return (
        <ModalWrapper>
            {errorDevice ? (
                <>
                    {' '}
                    <Typography variant="h5" component="div" color="error" sx={{ marginBottom: 1 }}>
                        Предупреждение!
                    </Typography>
                    <div>На устройстве должны быть видео и аудио записываюшее устройства!</div>
                    <Button sx={{ marginTop: 2 }} onClick={closeModal}>
                        Понятно
                    </Button>
                </>
            ) : (
                <>
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
                </>
            )}
        </ModalWrapper>
    );
};

export default CallAnswerModal;
