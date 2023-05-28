import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import Card from '../components/ui/Card';
import { BackPort } from '../config';
import { useCreateRoomMutation, useGetUsersQuery } from '../graphql/generated';
import { red } from '@mui/material/colors';

import styles from '../styles/Search.module.scss';
import { chatData } from '../graphql/store/chat';
import LinkContent from '../components/ui/LinkWrapper';
import Head from 'next/head';
import { useState } from 'react';

const Search = () => {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const { data, loading, error, refetch } = useGetUsersQuery();
    const [createRoom] = useCreateRoomMutation();

    const sendMessage = async (userId: string) => {
        const chat = chatData().find(
            (chat) => (chat!.users as Array<{ id: string }>)[0].id === userId,
        );

        if (chat) {
            router.push('/chat/' + chat.id);
            return;
        }

        const { data, errors } = await createRoom({
            variables: {
                userId,
            },
        });

        chatData([...chatData(), data!.createRoom!]);
        router.push('/chat/' + data?.createRoom?.id);
    };

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        refetch({ search: e.target.value });
    };

    if (loading && error) return null;

    return (
        <Grid container spacing={2}>
            <Head>
                <title>Поиск контактов</title>
            </Head>
            <TextField
                value={search}
                onChange={changeSearch}
                style={{ marginLeft: 16, marginTop: 16 }}
                fullWidth
                label="Поиск"
            />
            {data?.getUsers!.map((user) => (
                <Grid key={user?.id} item xs={12} lg={3} md={4} sm={6} xl={2}>
                    <Card variant="outlined">
                        <CardMedia component="div">
                            <LinkContent href={'/' + user?.id}>
                                <Avatar
                                    sx={{ bgcolor: red[500] }}
                                    className={styles.Avatar}
                                    aria-label="recipe"
                                    src={
                                        user!.img ? BackPort + 'img/avatar/' + user!.img : undefined
                                    }>
                                    {user?.login[0]}
                                </Avatar>
                            </LinkContent>
                        </CardMedia>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {user?.surname + ' ' + user?.name}
                                {user?.patronymic && ' ' + user?.patronymic}
                            </Typography>
                            <Typography gutterBottom variant="body1" component="div">
                                {user?.login}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.phone}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={sendMessage.bind(null, user?.id!)}>
                                Написать сообшение
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Search;
