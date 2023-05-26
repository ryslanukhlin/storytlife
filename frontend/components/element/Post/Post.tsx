import { ExpandMore } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    IconButton,
    Menu,
    MenuItem,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import { red } from '@mui/material/colors';
import React, { FC, useMemo, useRef, useState } from 'react';

import styles from './Post.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Post } from './Posts';
import { dateFormater } from '../../../util/dateFormat';
import {
    useAddLikeMutation,
    useDeletePostMutation,
    useEditPostMutation,
    useNewDeletePostSubscription,
    useNewEditPostSubscription,
    useNewLikeSubscription,
} from '../../../graphql/generated';
import { useReactiveVar } from '@apollo/client';
import { userData } from '../../../graphql/store/auth';
import CommentForm from '../CommentForm/CommentForm';
import Comments from '../Comment/Comments';
import { BackPort } from '../../../config';
import LinkContent from '../../ui/LinkWrapper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeletePostModal from '../../ui/modal/DeletePostModal';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const Post: FC<{ post: Post }> = ({ post: postOption }) => {
    const [post, setPost] = useState(postOption);
    const user = useReactiveVar(userData);
    const commentInput = useRef<HTMLInputElement>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [commentCount, setCommentCount] = useState(post.comments.length);
    const [editForm, setEditForm] = useState<{
        title: string;
        description: string;
        image: File | null;
        errTitle: string | null;
        errDescription: string | null;
    }>({
        title: post.title,
        description: post.description,
        image: null,
        errTitle: null,
        errDescription: null,
    });

    const [addLike] = useAddLikeMutation();
    const [deletePostMutation] = useDeletePostMutation();
    const [editPost] = useEditPostMutation();
    const isLiked = likeCount.find((like) => like.user.id === user?.id);

    const changeImagePost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setEditForm((prev) => ({ ...prev, image: file }));
    };

    const deleteImagePost = () => {
        setEditForm((prev) => ({ ...prev, image: null }));
    };

    const chanheEditForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitEditForm = () => {
        if (!editForm.title.trim())
            setEditForm((prev) => ({ ...prev, errTitle: 'Обезательное поле!' }));
        if (!editForm.description.trim())
            setEditForm((prev) => ({ ...prev, errDescription: 'Обезательное поле!' }));
        if (editForm.errTitle || editForm.errDescription) return;

        if (editForm.image) {
            const reader = new FileReader();
            reader.readAsDataURL(editForm.image);
            reader.onloadend = async function () {
                editPost({
                    variables: {
                        postId: post.id,
                        editPost: {
                            img: reader.result as string,
                            title: editForm.title,
                            description: editForm.description,
                        },
                    },
                });
            };
        } else
            editPost({
                variables: {
                    postId: post.id,
                    editPost: {
                        img: null,
                        title: editForm.title,
                        description: editForm.description,
                    },
                },
            });

        setEditForm((prev) => ({ ...prev, img: null, errDescription: null, errTitle: null }));
        setEditMode(false);
    };

    const setLike = () => {
        if (isLiked) return;

        addLike({
            variables: {
                postId: post.id,
            },
        });
    };

    const addComment = () => {
        setCommentCount((prev) => ++prev);
    };

    const focusInput = () => {
        commentInput.current?.focus();
    };

    const clickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setAnchorEl(null);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const closeEditMode = () => {
        setEditMode(false);
        closeMenu();
    };

    const openEditMode = () => {
        setEditMode(true);
        closeMenu();
    };

    const deletePost = () => {
        deletePostMutation({
            variables: {
                postId: post.id,
            },
        });
        closeDeleteModal();
    };

    useNewLikeSubscription({
        variables: {
            postId: post.id,
        },
        onData: (option) => {
            setLikeCount((prev) => [...prev, option.data.data!.newLike]);
        },
    });

    useNewDeletePostSubscription({
        variables: {
            postId: post.id,
        },
        onData: () => setIsDelete(true),
    });

    useNewEditPostSubscription({
        variables: {
            postId: post.id,
        },
        onData: (option) => {
            const { title, description, img } = option.data.data?.newEditPost!;
            setPost((prev) => ({ ...prev, title, description, img }));
            setEditForm((prev) => ({ ...prev, title, description }));
        },
    });

    const open = Boolean(anchorEl);

    const srcImg = useMemo(
        () =>
            editMode
                ? editForm.image
                    ? URL.createObjectURL(editForm.image)
                    : ''
                : post.img
                ? BackPort + 'img/post/' + post.img
                : '',
        [editMode, editForm.image, post.img],
    );

    const WrapperImgPost = styled(Box)(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <>
            {isDelete ? (
                <Typography variant="h6">Пост удалён</Typography>
            ) : (
                <CustomCard variant="outlined" className={styles.Post}>
                    {showDeleteModal && (
                        <DeletePostModal deletePost={deletePost} close={closeDeleteModal} />
                    )}
                    <CardHeader
                        avatar={
                            <LinkContent href={'/' + post.user.id}>
                                <Avatar
                                    sx={{ bgcolor: red[500] }}
                                    aria-label="recipe"
                                    src={
                                        post.user.img
                                            ? BackPort + 'img/avatar/' + post.user.img
                                            : undefined
                                    }>
                                    {post.user.login[0]}
                                </Avatar>
                            </LinkContent>
                        }
                        action={
                            post.user.id === user?.id &&
                            (editMode ? (
                                <>
                                    <IconButton onClick={submitEditForm} color="success">
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton onClick={closeEditMode} color="error">
                                        <ClearIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton onClick={clickMenu}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
                                        <MenuItem onClick={openEditMode}>Редактировать</MenuItem>
                                        <MenuItem onClick={openDeleteModal}>Удалить</MenuItem>
                                    </Menu>
                                </>
                            ))
                        }
                        title={post.user.login}
                        subheader={dateFormater(post.created_at)}
                    />
                    <CardMedia component="div">
                        <WrapperImgPost className={styles.PostWrapperPhoto}>
                            <img src={srcImg} className={styles.PostPhoto} />
                        </WrapperImgPost>
                        {editMode && (
                            <div className={styles.PostEditActions}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    component="label"
                                    style={{ marginRight: 12 }}>
                                    Загрузиить изображение
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={changeImagePost}
                                    />
                                </Button>
                                <Button
                                    size="small"
                                    onClick={deleteImagePost}
                                    variant="contained"
                                    color="error">
                                    Удалить фотографию
                                </Button>
                            </div>
                        )}
                    </CardMedia>
                    <CardContent className={styles.PostContent}>
                        {editMode ? (
                            <>
                                <TextField
                                    label="Заголовок"
                                    style={{ marginBottom: 16 }}
                                    name="title"
                                    value={editForm.title}
                                    onChange={chanheEditForm}
                                    error={!!editForm.errTitle}
                                    helperText={editForm.errTitle}
                                />
                                <TextField
                                    multiline
                                    rows={4}
                                    label="Описание"
                                    name="description"
                                    value={editForm.description}
                                    onChange={chanheEditForm}
                                    error={!!editForm.errDescription}
                                    helperText={editForm.errDescription}
                                />
                            </>
                        ) : (
                            <>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {post.description}
                                </Typography>
                            </>
                        )}
                    </CardContent>
                    <CardActions disableSpacing>
                        <div className={styles.PostFooter}>
                            <div className={styles.FooterActions}>
                                <IconButton
                                    aria-label="add like"
                                    onClick={setLike}
                                    color={isLiked ? 'error' : 'default'}>
                                    <FavoriteIcon />
                                </IconButton>
                                <div className={styles.FooterCount}>{likeCount.length}</div>
                                <IconButton aria-label="add comment" onClick={focusInput}>
                                    <CommentIcon />
                                </IconButton>
                                <div className={styles.FooterCount}>{commentCount}</div>
                            </div>
                        </div>
                    </CardActions>
                    <Collapse in unmountOnExit className={styles.CommentsWrapper}>
                        <Comments
                            comments={post.comments}
                            postId={post.id}
                            addComment={addComment}
                        />
                        <CommentForm postId={post.id} commentInput={commentInput} />
                    </Collapse>
                </CustomCard>
            )}
        </>
    );
};

export default Post;
