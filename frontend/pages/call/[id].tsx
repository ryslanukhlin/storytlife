import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
//@ts-ignore
import freeice from 'freeice';
import {
    TypeCreate,
    useAnswerOnCallPageMutation,
    useChangeAudioMutation,
    useChangeVideoMutation,
    useCreateCandidateMutation,
    useCreateOfferMutation,
    useLeaveCallMutation,
    useNewAnswerOnCallPageSubscription,
    useNewChangeAudioSubscription,
    useNewChangeVideoSubscription,
    useNewCreateCandidateSubscription,
    useNewCreateOfferSubscription,
    useNewLeaveCallSubscription,
} from '../../graphql/generated';
import { userData } from '../../graphql/store/auth';
import { CallType } from '../../type/call.type';
import CallFooter from '../../components/element/CallFooter/CallFooter';
import CallHeader from '../../components/element/CallHeader/CallHeader';
import MicOffIcon from '@mui/icons-material/MicOff';

import styles from '../../styles/Call.module.scss';
import { chatData } from '../../graphql/store/chat';
import { Avatar, Box, styled } from '@mui/material';
import Head from 'next/head';
import { BackPort } from '../../config';

const VideoWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
}));

const config = { iceServers: freeice() };

const CallPage = () => {
    const router = useRouter();
    const user = useReactiveVar(userData);
    const pc = useRef(new RTCPeerConnection(config));
    const localStream = useRef<MediaStream>();
    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const [createOffetMutation] = useCreateOfferMutation();
    const [createCandidate] = useCreateCandidateMutation();
    const [answerOnCallPage] = useAnswerOnCallPageMutation();
    const [leaveCallMutation] = useLeaveCallMutation();
    const [changeVideo] = useChangeVideoMutation();
    const [changeMicro] = useChangeAudioMutation();

    const frend = chatData().find((chat) => chat?.id === router.query.id)?.users![0];

    const connected = useRef(false);
    const answerConnected = useRef(false);
    const createtOfferIsWork = useRef(false);

    const [offMicro, setOffMicro] = useState(false);
    const [offVideo, setOffVideo] = useState(router.query.usingVideo === 'false');
    const [offMicroFrend, setOffMicroFrend] = useState(false);
    const [offVideoFrend, setOffVideoFrend] = useState(router.query.usingVideo === 'false');

    const createOffer = async () => {
        createtOfferIsWork.current = true;
        const offer = await pc.current.createOffer();

        await pc.current.setLocalDescription(new RTCSessionDescription(offer));

        await createOffetMutation({
            variables: {
                createOfferInput: {
                    payload: JSON.stringify(offer),
                    userId: frend?.id!,
                    connection: TypeCreate.Offer,
                },
            },
        });
        createtOfferIsWork.current = false;
    };

    const initPc = async () => {
        localStream.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const dataChanel = pc.current.createDataChannel('test');

        dataChanel.onopen = () => (connected.current = true);
        dataChanel.onclose = () => (connected.current = false);

        localVideo.current!.srcObject = localStream.current!;

        localStream.current!.getTracks().forEach((track) => {
            pc.current.addTrack(track, localStream.current!);
        });

        pc.current.ontrack = (event) => {
            remoteVideo.current!.srcObject = event.streams[0];
        };

        pc.current.onicecandidate = (event) => {
            if (event.candidate)
                createCandidate({
                    variables: {
                        createCandidateInput: {
                            candidate: JSON.stringify(event.candidate),
                            userId: frend?.id!,
                        },
                    },
                });
        };

        if (router.query.type === CallType.OFFER) {
            const interval = setInterval(async () => {
                if (createtOfferIsWork.current) return;
                if (connected.current) clearInterval(interval);
                await createOffer();
            }, 500);
        }
        if (router.query.type === CallType.ANSWER) {
            const interval = setInterval(() => {
                if (connected.current) clearInterval(interval);
                answerOnCallPage({
                    variables: {
                        userId: frend?.id!,
                    },
                });
            }, 500);
        }
    };

    useNewCreateOfferSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: async (options) => {
            const { connection, payload } = options.data.data?.newCreateOffer!;
            if (connection === TypeCreate.Offer) {
                const offer: RTCSessionDescriptionInit = JSON.parse(payload);
                await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(new RTCSessionDescription(answer));

                await createOffetMutation({
                    variables: {
                        createOfferInput: {
                            userId: frend?.id!,
                            payload: JSON.stringify(answer),
                            connection: TypeCreate.Answer,
                        },
                    },
                });
            } else if (connection === TypeCreate.Answer) {
                try {
                    const answer: RTCSessionDescriptionInit = JSON.parse(payload);
                    // Тут происходит ошибка, которая ниначно не влияет, не понял как исправить
                    await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (e) {
                    console.log(e);
                }
            }
        },
    });

    useNewCreateCandidateSubscription({
        variables: { userId: user?.id! },
        onData: async (option) => {
            try {
                await pc.current.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(option.data.data?.newCreateCandidate!)),
                );
            } catch (e) {
                console.log(e);
            }
        },
    });

    useNewAnswerOnCallPageSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => {
            answerConnected.current = true;
        },
    });

    useNewLeaveCallSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => router.back(),
    });

    useNewChangeVideoSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => setOffVideoFrend((prev) => !prev),
    });

    useNewChangeAudioSubscription({
        variables: {
            userId: user?.id!,
        },
        onData: () => setOffMicroFrend((prev) => !prev),
    });

    const toggleCamer = () => {
        const videoTrack = localStream.current?.getTracks().find((track) => track.kind === 'video');
        if (!offVideo) {
            videoTrack!.enabled = false;
            setOffVideo(true);
            changeVideo({
                variables: {
                    userId: frend?.id!,
                },
            });
        } else {
            videoTrack!.enabled = true;
            setOffVideo(false);
            changeVideo({
                variables: {
                    userId: frend?.id!,
                },
            });
        }
    };

    const toggleMicro = () => {
        const audioTrack = localStream.current?.getTracks().find((track) => track.kind === 'audio');
        if (audioTrack?.enabled) {
            audioTrack.enabled = false;
            setOffMicro(true);
            changeMicro({
                variables: {
                    userId: frend?.id!,
                },
            });
        } else {
            audioTrack!.enabled = true;
            setOffMicro(false);
            changeMicro({
                variables: {
                    userId: frend?.id!,
                },
            });
        }
    };

    const leaveCall = () => {
        leaveCallMutation({
            variables: {
                userId: frend?.id!,
            },
        });
        router.back();
    };

    useEffect(() => {
        initPc();
    }, []);

    return (
        <div className={styles.CallWrapper}>
            <Head>
                <title>Звонок {frend?.login}</title>
            </Head>
            <CallHeader frend={frend!} />
            <div className={styles.VideoContainerWrapper}>
                <VideoWrapper className={styles.MyVideo}>
                    <video
                        className={offVideo ? styles.VideoDeactivated : ''}
                        ref={localVideo}
                        autoPlay
                        muted
                    />
                    {offVideo && (
                        <Avatar
                            src={user!.img ? BackPort + 'img/avatar/' + user!.img : undefined}
                            alt="contact"
                            className={styles.CallImg}>
                            {user!.login[0]}
                        </Avatar>
                    )}
                </VideoWrapper>
                <VideoWrapper className={styles.FrendVideo}>
                    <video
                        ref={remoteVideo}
                        autoPlay
                        className={offVideoFrend ? styles.VideoDeactivated : ''}
                    />
                    {offVideoFrend && (
                        <Avatar
                            src={user!.img ? BackPort + 'img/avatar/' + user!.img : undefined}
                            alt="contact"
                            className={styles.CallImg}>
                            {frend!.login[0]}
                        </Avatar>
                    )}
                    {offMicroFrend && (
                        <div className={styles.MicroOff}>
                            <MicOffIcon fontSize="large" />
                        </div>
                    )}
                </VideoWrapper>
            </div>
            <CallFooter
                offMicro={offMicro}
                offVideo={offVideo}
                toggleCamer={toggleCamer}
                toggleMicro={toggleMicro}
                leaveCall={leaveCall}
            />
        </div>
    );
};

export default CallPage;
