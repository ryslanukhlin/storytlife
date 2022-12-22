import { useReactiveVar } from '@apollo/client';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import { TypeUser, userData } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';

import styles from './UserHeader.module.scss';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { deepOrange } from '@mui/material/colors';
import {
    useNewAvatarSubscription,
    useNewBgSubscription,
    useSetAvatarMutation,
    useSetBgMutation,
} from '../../../graphql/generated';
import { BackPort } from '../../../config';

const UserHeader: FC<{ user: UserPageInfo | TypeUser }> = ({ user }) => {
    const [userPage, setUserPage] = useState(user);
    const [setAvatar] = useSetAvatarMutation();
    const [setBg] = useSetBgMutation();
    const [showPhotoChange, setShowPhotoChange] = useState(false);

    const chanheBg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setBg({
                variables: {
                    bg: reader.result as string,
                },
            });
        };
    };

    const chanhePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setAvatar({
                variables: {
                    avatar: reader.result as string,
                },
            });
        };
    };

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

    return (
        <Box sx={{ boxShadow: 3 }} className={styles.UserHeader}>
            <div
                className={styles.UserBackground}
                style={{
                    backgroundImage: `url('${
                        userPage.bg ? BackPort + 'img/bg/' + userPage.bg : '/img/bgDefault.jpg'
                    }')`,
                }}>
                <Button className={styles.ChangeBack} variant="contained" component="label">
                    <input hidden accept="image/*" type="file" onChange={chanheBg} />
                    Изменить фон
                </Button>
            </div>
            <div className={styles.UserInfo}>
                <div
                    className={styles.AvatarWrapper}
                    onMouseEnter={() => setShowPhotoChange(true)}
                    onMouseLeave={() => setShowPhotoChange(false)}>
                    <Avatar
                        src={userPage.img ? BackPort + 'img/avatar/' + userPage.img : undefined}
                        sx={{ backgroundColor: deepOrange[500] }}
                        className={styles.UserImg}>
                        R
                    </Avatar>
                    <div
                        className={
                            showPhotoChange ? styles.ChangeAvatar : styles.ChangeAvatarHidden
                        }>
                        <IconButton component="label" className={styles.ChangeAvatarBtn}>
                            <input hidden accept="image/*" type="file" onChange={chanhePhoto} />
                            <PhotoCameraIcon />
                        </IconButton>
                    </div>
                </div>
                <Typography variant="h6">{userPage?.login}</Typography>
                <Typography variant="body1">{userPage?.phone}</Typography>
            </div>
        </Box>
    );
};

export default UserHeader;
