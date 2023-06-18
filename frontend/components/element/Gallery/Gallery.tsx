import { Alert, Box, Button, Snackbar, Typography, styled } from '@mui/material';
import { FC, useContext, useState } from 'react';
import { BackPort } from '../../../config';
import {
    useDeleteImgGalleryMutation,
    useNewDeleteGallerySubscription,
    useNewGallerySubscription,
} from '../../../graphql/generated';
import GalleryFullScreen from '../GalleryFullScreen/GalleryFullScreen';
import { ThemeContext } from '../../../pages/_app';
import { useReactiveVar } from '@apollo/client';
import { userData } from '../../../graphql/store/auth';

import styles from './Gallery.module.scss';
import ClearIcon from '@mui/icons-material/Clear';

const DeleteImg = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Gallery: FC<{ gallery: string[]; currentUserId: string }> = ({ gallery, currentUserId }) => {
    const user = useReactiveVar(userData);
    const [images, setImages] = useState(gallery);
    const [activeFullScreeiImg, setActiveFullScreeiImg] = useState<number | null>(null);
    const [deleteImgMutation] = useDeleteImgGalleryMutation();
    const [errorRequest, setErrorRequest] = useState(false);
    const { theme } = useContext(ThemeContext);

    const changeFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const data = new FormData();

        Array.from(e.target.files).forEach((file) => {
            data.append('files', file);
        });

        const request = await fetch(BackPort + 'user/gallery', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
                ContentType: 'application/json',
            },
            body: data,
        });
        if (request.status === 413) setErrorRequest(true);
    };

    const deleteImg = async (imgName: string) => {
        await deleteImgMutation({
            variables: {
                imgName,
            },
        });
    };

    const openImage = (index: number) => setActiveFullScreeiImg(index);
    const closeImage = () => setActiveFullScreeiImg(null);

    const closeRequestErrorInfo = (event: React.SyntheticEvent | Event, reason?: string) => {
        setErrorRequest(false);
    };

    useNewGallerySubscription({
        variables: {
            userId: currentUserId,
        },
        onData: (option) => {
            setImages((prev) => [...prev, ...option.data.data!.newGallery]);
        },
    });

    useNewDeleteGallerySubscription({
        variables: {
            userId: currentUserId,
        },
        onData: (option) => {
            setImages(images.filter((img) => img !== option.data.data!.newDeleteGallery));
        },
    });

    const isCurrentUser = currentUserId === user?.id;

    return (
        <>
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
            {activeFullScreeiImg !== null && (
                <GalleryFullScreen
                    isCurrentUser={isCurrentUser}
                    activeImg={activeFullScreeiImg}
                    images={images}
                    closeImage={closeImage}
                />
            )}
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.divider,
                    borderRadius: '4px',
                    padding: '16px',
                }}
                className={styles.Gallery}>
                <div className={styles.GalleryScroll}>
                    {images.length !== 0 ? (
                        images.map((image, index) => (
                            <div key={image} className={styles.GalleryImgWrapper}>
                                <img
                                    onClick={openImage.bind(null, index)}
                                    className={
                                        theme === 'white'
                                            ? styles.GalleryImg
                                            : styles.GalleryImgDark
                                    }
                                    src={BackPort + 'img/images_gallery/' + image}
                                />
                                {isCurrentUser && (
                                    <DeleteImg
                                        onClick={deleteImg.bind(null, image)}
                                        className={styles.DeleteImg}>
                                        <ClearIcon />
                                    </DeleteImg>
                                )}
                            </div>
                        ))
                    ) : (
                        <Typography variant="body1">Здесь пусто</Typography>
                    )}
                </div>
                {isCurrentUser && (
                    <Button component="label" variant="contained" className={styles.ButtonDownload}>
                        Загрузить фото
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={changeFiles}
                        />
                    </Button>
                )}
            </Box>
        </>
    );
};

export default Gallery;
