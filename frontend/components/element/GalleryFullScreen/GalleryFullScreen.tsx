import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BackPort } from '../../../config';
import { Box, IconButton, styled } from '@mui/material';
import { useDeleteImgGalleryMutation } from '../../../graphql/generated';

import styles from './GalleryFullScreen.module.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClearIcon from '@mui/icons-material/Clear';

const DeleteImg = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const GalleryFullScreen: FC<{
    images: string[];
    activeImg: number;
    closeImage: () => void;
    isCurrentUser: boolean;
}> = ({ images, activeImg, closeImage, isCurrentUser }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [activeImgIndex, setActiveImgIndex] = useState(activeImg);
    const [deleteImgMutation] = useDeleteImgGalleryMutation();

    const setLeftActivePhoto = () => {
        setActiveImgIndex((prev) => --prev);
    };

    const setRightActivePhoto = () => {
        setActiveImgIndex((prev) => ++prev);
    };

    const closeImg = (e: React.MouseEvent<HTMLDivElement>) => {
        //@ts-ignore
        if (e.target.localName === 'div') closeImage();
    };

    const deleteImg = async () => {
        const { errors } = await deleteImgMutation({
            variables: {
                imgName: images[activeImgIndex],
            },
        });
        if (!errors && activeImgIndex === images.length - 1) setActiveImgIndex((prev) => --prev);
    };

    useLayoutEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    useEffect(() => {
        if (images.length === 0) closeImage();
        if (imgRef.current)
            imgRef.current.src = BackPort + 'img/images_gallery/' + images[activeImgIndex];
    }, [activeImgIndex, images]);

    return (
        <div onClick={closeImg} className={styles.GalleryFullScreen}>
            {activeImgIndex !== 0 && (
                <IconButton className={styles.LeftRow} onClick={setLeftActivePhoto}>
                    <ArrowBackIosNewIcon />
                </IconButton>
            )}
            <div className={styles.ImgWrapper}>
                <div className={styles.ImgContainer}>
                    <img ref={imgRef} className={styles.ImgContainer} />
                    {isCurrentUser && (
                        <DeleteImg onClick={deleteImg} className={styles.DeleteImg}>
                            <ClearIcon />
                        </DeleteImg>
                    )}
                </div>
            </div>
            {activeImgIndex !== images.length - 1 && (
                <IconButton className={styles.RightRow} onClick={setRightActivePhoto}>
                    <ArrowForwardIosIcon />
                </IconButton>
            )}
        </div>
    );
};

export default GalleryFullScreen;
