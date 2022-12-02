import { useReactiveVar } from '@apollo/client';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    styled,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useCreateRoomMutation, useGetUsersQuery } from '../graphql/generated';
import { userData } from '../graphql/store/auth';

const CardCustom = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const Search = () => {
    const router = useRouter();
    const user = useReactiveVar(userData);

    const { data, loading, error } = useGetUsersQuery();
    const [createRoom] = useCreateRoomMutation();

    const sendMessage = async (userId: string) => {
        const chat = user?.chats?.find(
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

        userData({ ...userData()!, chats: [...userData()?.chats!, data!.createRoom!] });
        router.push('/chat/' + data?.createRoom?.id);
    };

    if (loading && error) return null;

    return (
        <Grid container spacing={2} className="PageWrapper">
            {data?.getUsers!.map((user) => (
                <Grid key={user?.id} item xs={12} lg={3} md={4} sm={6} xl={2}>
                    <CardCustom variant="outlined">
                        <CardMedia
                            image="https://cdn1.flamp.ru/df271521a12773528a59498632d7ba6a.jpg"
                            component="img"
                            height="200"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {user?.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.login}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={sendMessage.bind(null, user?.id!)}>
                                Написать сообшение
                            </Button>
                        </CardActions>
                    </CardCustom>
                </Grid>
            ))}
        </Grid>
    );
};

export default Search;
