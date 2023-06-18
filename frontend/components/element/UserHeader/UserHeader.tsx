import { useReactiveVar } from '@apollo/client';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    IconButton,
    Snackbar,
    Typography,
    styled,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { TypeUser, userData } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';

import styles from './UserHeader.module.scss';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { deepOrange } from '@mui/material/colors';
import {
    useNewAvatarSubscription,
    useNewBgSubscription,
    useNewEditUserSubscription,
    useSetAvatarMutation,
    useSetBgMutation,
} from '../../../graphql/generated';
import { BackPort } from '../../../config';
import { SocketIo } from '../../../util/socket';
import { useRouter } from 'next/router';
import EditInfoUserModel from '../../ui/modal/EditInfoUserModel';
import ShowUserDopInfo from '../../ui/modal/ShowUserDopInfo';
import { error } from 'console';

const BoxCardContent = styled(Box)(({ theme }) => ({
    background: theme.palette.background.default,
}));

const BorderAvatar = styled(Box)(({ theme }) => ({
    borderColor: theme.palette.background.default,
}));

const UserHeader: FC<{ user: UserPageInfo | TypeUser }> = ({ user }) => {
    const [userPage, setUserPage] = useState(user);
    const [setAvatar] = useSetAvatarMutation();
    const [setBg] = useSetBgMutation({
        errorPolicy: 'ignore',
    });
    const [showPhotoChange, setShowPhotoChange] = useState(false);
    const router = useRouter();

    const [showEditUser, setShowEditUser] = useState(false);
    const [showDopInfoUser, setShowDopInfoUser] = useState(false);
    const [errorRequest, setErrorRequest] = useState(false);

    const chanheBg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                await setBg({
                    variables: {
                        bg: reader.result as string,
                    },
                });
            } catch {
                setErrorRequest(true);
            }
        };
        return;
    };

    const chanhePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                await setAvatar({
                    variables: {
                        avatar: reader.result as string,
                    },
                });
            } catch {
                setErrorRequest(true);
            }
        };
    };

    const openModalEdit = () => {
        setShowEditUser(true);
    };

    const closeModalEdit = () => {
        setShowEditUser(false);
    };

    const openDopInfoUser = () => {
        setShowDopInfoUser(true);
    };

    const closeDopInfoUser = () => {
        setShowDopInfoUser(false);
    };

    const closeRequestErrorInfo = (event: React.SyntheticEvent | Event, reason?: string) => {
        setErrorRequest(false);
    };

    useEffect(() => {
        if (userPage.id !== user.id) setUserPage(user);
    }, [user.id]);

    useEffect(() => {
        setUserPage(user);
    }, [user]);

    useEffect(() => {
        if (router.query.id !== userData()?.id) {
            SocketIo()?.emit('join', {
                userId: router.query.id,
            });

            SocketIo()?.on('ChangeOnline', (is_onlite: boolean, id: string) =>
                setUserPage((prev: any) => ({ ...prev, is_onlite })),
            );
        }
    }, [router.query.id]);

    useNewAvatarSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            setUserPage({ ...userPage, img: option.data.data?.newAvatar });
        },
    });

    useNewBgSubscription({
        variables: {
            userId: user!.id,
        },
        onData: (option) => {
            console.log(option.data.data?.newBg);

            setUserPage({ ...userPage, bg: option.data.data?.newBg });
        },
    });

    const isAnotherUser = user?.id === userData()?.id;

    useNewEditUserSubscription({
        variables: {
            userId: userPage.id,
        },
        onData: (option) => {
            const { __typename, ...data } = option.data.data?.newEditUser!;
            data.birthday = data!.birthday ? new Date(data.birthday!).getTime().toString() : null;
            setUserPage({ ...userPage!, ...data });
        },
        skip: isAnotherUser,
    });

    return (
        <div className={styles.UserHeader}>
            <Snackbar
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                open={errorRequest}
                autoHideDuration={6000}
                onClose={closeRequestErrorInfo}>
                <Alert
                    onClose={closeRequestErrorInfo}
                    variant="filled"
                    severity="error"
                    sx={{ width: '100%' }}>
                    Фотография слишком большая
                </Alert>
            </Snackbar>
            {showEditUser && (
                <Dialog open={showEditUser} onClose={closeModalEdit}>
                    <EditInfoUserModel user={userPage} close={closeModalEdit} />
                </Dialog>
            )}
            {showDopInfoUser && (
                <Dialog open={showDopInfoUser} onClose={closeDopInfoUser}>
                    <ShowUserDopInfo user={userPage} />
                </Dialog>
            )}
            <div
                className={styles.UserBackground}
                style={{
                    backgroundImage: `url('${
                        userPage.bg ? BackPort + 'img/bg/' + userPage.bg : '/img/bgDefault.jpg'
                    }')`,
                }}>
                {isAnotherUser && (
                    <Button className={styles.ChangeBack} variant="contained" component="label">
                        <input hidden accept="image/*" type="file" onChange={chanheBg} />
                        Изменить фон
                    </Button>
                )}
            </div>
            <BoxCardContent className={styles.UserContent}>
                <Box
                    sx={(theme) => ({
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                    })}
                    className={styles.UserInfo}>
                    <BorderAvatar
                        className={styles.AvatarWrapper}
                        onMouseEnter={() => setShowPhotoChange(true)}
                        onMouseLeave={() => setShowPhotoChange(false)}>
                        <Avatar
                            src={userPage.img ? BackPort + 'img/avatar/' + userPage.img : undefined}
                            sx={{ backgroundColor: deepOrange[500] }}
                            className={styles.UserImg}>
                            {userPage.name[0] + userPage.surname[0]}
                        </Avatar>
                        {isAnotherUser && (
                            <div
                                className={
                                    showPhotoChange
                                        ? styles.ChangeAvatar
                                        : styles.ChangeAvatarHidden
                                }>
                                <IconButton component="label" className={styles.ChangeAvatarBtn}>
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={chanhePhoto}
                                    />
                                    <PhotoCameraIcon />
                                </IconButton>
                            </div>
                        )}
                    </BorderAvatar>
                    <Typography style={{ marginBottom: 2 }} variant="h5">{`${userPage.surname} ${
                        userPage.name
                    } ${userPage.patronymic && userPage.patronymic}`}</Typography>
                    <Typography style={{ marginBottom: 2 }} variant="h6">
                        Логин: {userPage?.login}
                    </Typography>
                    <Typography style={{ marginBottom: 4 }} variant="body1">
                        Телефон: {userPage?.phone}
                    </Typography>
                    {userPage.is_onlite || userPage.id === userData()!.id ? (
                        <Typography variant="body2" color="teal">
                            В сети
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="grey">
                            Не в сети
                        </Typography>
                    )}
                    <div className={styles.UserActions}>
                        {isAnotherUser && (
                            <Button
                                style={{ marginRight: 6, marginTop: 10 }}
                                onClick={openModalEdit}
                                variant="outlined">
                                Редактировать
                            </Button>
                        )}
                        <Button
                            style={{ marginTop: 10 }}
                            onClick={openDopInfoUser}
                            variant="outlined">
                            Подробнее
                        </Button>
                    </div>
                </Box>
            </BoxCardContent>
        </div>
    );
};

export default UserHeader;
