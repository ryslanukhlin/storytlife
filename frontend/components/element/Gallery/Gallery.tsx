import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Paper,
    Typography,
    styled,
} from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import CardUserPage from '../../ui/CardHeader';
import { BackPort } from '../../../config';

import styles from './Gallery.module.scss';
import {
    useDeleteImgGalleryMutation,
    useNewDeleteGallerySubscription,
    useNewGallerySubscription,
} from '../../../graphql/generated';
import ClearIcon from '@mui/icons-material/Clear';
import GalleryFullScreen from '../GalleryFullScreen/GalleryFullScreen';
import Image from 'next/image';
import { ThemeContext } from '../../../pages/_app';

const DeleteImg = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Gallery: FC<{ gallery: string[]; currentUserId: string }> = ({ gallery, currentUserId }) => {
    const [images, setImages] = useState(gallery);
    const [activeFullScreeiImg, setActiveFullScreeiImg] = useState<number | null>(null);
    const [deleteImgMutation] = useDeleteImgGalleryMutation();

    const { theme } = useContext(ThemeContext);

    const changeFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const data = new FormData();

        Array.from(e.target.files).forEach((file) => {
            data.append('files', file);
        });

        await fetch(BackPort + 'user/gallery', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
                ContentType: 'application/json',
            },
            body: data,
        });
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

    return (
        <>
            {activeFullScreeiImg !== null && (
                <GalleryFullScreen
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
                <div>
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
                                <DeleteImg
                                    onClick={deleteImg.bind(null, image)}
                                    className={styles.DeleteImg}>
                                    <ClearIcon />
                                </DeleteImg>
                            </div>
                        ))
                    ) : (
                        <Typography style={{ marginBottom: 14 }} variant="body1">
                            Здесь пусто
                        </Typography>
                    )}
                </div>
                <Button component="label" variant="contained" className={styles.ButtonDownload}>
                    Загрузить фото
                    <input type="file" multiple hidden onChange={changeFiles} />
                </Button>
            </Box>
        </>
    );
};

export default Gallery;
