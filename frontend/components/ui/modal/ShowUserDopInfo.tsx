import { FC } from 'react';
import { DialogContent, DialogTitle, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TypeUser } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';

type ShowUserDopInfoProps = {
    user: UserPageInfo | TypeUser;
};

type Info = {
    login: string;
    name: string;
    surname: string;
    patronymic: string | undefined | null;
    about_me?: string | null | undefined;
    email?: string | null | undefined;
    place_work?: string | null | undefined;
    birthday?: string | null | undefined;
};

const ShowUserDopInfo: FC<ShowUserDopInfoProps> = ({ user }) => {
    const formatDate = user!.birthday
        ? dayjs(new Date(+user!.birthday)).format('YYYY-MM-DD')
        : null;

    return (
        <>
            <DialogTitle>Основная информация</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">Фамилия: {user!.surname}</Typography>
                <Typography variant="subtitle1">Имя: {user!.name}</Typography>
                {user!.patronymic && (
                    <Typography variant="subtitle1">Отчество: {user!.patronymic}</Typography>
                )}
                <Typography variant="subtitle1">Логин: {user!.login}</Typography>
            </DialogContent>

            <DialogTitle>Дополнительная информация</DialogTitle>
            <DialogContent>
                {user!.about_me && (
                    <Typography variant="subtitle1">
                        Краткая информация: {user!.about_me}
                    </Typography>
                )}
                {user!.about_me && (
                    <Typography variant="subtitle1">Почта: {user!.email}</Typography>
                )}
                {user!.about_me && (
                    <Typography variant="subtitle1">
                        Место работы/учебы: {user!.place_work}
                    </Typography>
                )}
                {formatDate && (
                    <Typography variant="subtitle1">Дата рождения: {formatDate}</Typography>
                )}
            </DialogContent>
        </>
    );
};

export default ShowUserDopInfo;
