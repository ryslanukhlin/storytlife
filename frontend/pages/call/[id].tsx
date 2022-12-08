import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { LegacyRef, useEffect, useReducer, useRef, useState } from 'react';
//@ts-ignore
import freeice from 'freeice';
import {
    AcceptCall,
    TypeCreate,
    useAcceptCallMutation,
    useAnswerOnCallPageMutation,
    useCreateCandidateMutation,
    useCreateOfferMutation,
    useLeaveCallMutation,
    useNewAnswerOnCallPageSubscription,
    useNewCreateCandidateSubscription,
    useNewCreateOfferSubscription,
    useNewLeaveCallSubscription,
} from '../../graphql/generated';
import { userData } from '../../graphql/store/auth';
import { CallType } from '../../type/call.type';
import CallFooter from '../../components/element/CallFooter/CallFooter';
import CallHeader from '../../components/element/CallHeader/CallHeader';

import styles from '../../styles/Call.module.scss';

const config = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

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
    const frend = user?.chats?.find((chat) => chat?.id === router.query.id)?.users![0];
    const connected = useRef(false);
    const answerConnected = useRef(false);
    const createtOfferIsWork = useRef(false);

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

    const toggleCamer = () => {
        const videoTrack = localStream.current?.getTracks().find((track) => track.kind === 'video');
        if (videoTrack?.enabled) videoTrack.enabled = false;
        else videoTrack!.enabled = true;
    };

    const toggleMicro = () => {
        const videoTrack = localStream.current?.getTracks().find((track) => track.kind === 'audio');
        if (videoTrack?.enabled) videoTrack.enabled = false;
        else videoTrack!.enabled = true;
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
            <CallHeader frend={frend!} />
            <div className={styles.VideoWrapper}>
                <video ref={localVideo} autoPlay muted />
                <video ref={remoteVideo} autoPlay />
            </div>
            <CallFooter toggleCamer={toggleCamer} toggleMicro={toggleMicro} leaveCall={leaveCall} />
        </div>
    );
};

export default CallPage;
