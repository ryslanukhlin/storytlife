import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FC } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ruRU } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ru';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import { useEditUserMutation } from '../../../graphql/generated';
import { TypeUser } from '../../../graphql/store/auth';
import { UserPageInfo } from '../../../pages/[id]';

import styles from './ModalWrapper/ModalWrapper.module.scss';

type EditInfoUserModelProps = {
    close: () => void;
    user: UserPageInfo | TypeUser;
};

const EditInfoUserModel: FC<EditInfoUserModelProps> = ({ close, user }) => {
    const [editUser] = useEditUserMutation();

    const formik = useFormik({
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: {
            login: user!.login,
            name: user!.name,
            surname: user!.surname,
            patronymic: user!.patronymic ?? '',
            about_me: user!.about_me ?? '',
            email: user!.email ?? '',
            place_work: user!.place_work ?? '',
            birthday: user!.birthday ? dayjs(new Date(+user!.birthday)) : null,
        },
        onSubmit: async (variables) => {
            const { birthday, ...data } = variables;

            const date = birthday ? birthday?.format('YYYY-MM-DD') : null;

            editUser({
                variables: {
                    editUser: {
                        ...data,
                        birthday: date,
                    },
                },
            });
            close();
        },
        validate: (values) => {
            let errors: any = {};

            if (!values.login.trim()) errors.login = 'Обезательное поле!';
            if (!values.name.trim()) errors.name = 'Обезательное поле!';
            if (!values.surname.trim()) errors.surname = 'Обезательное поле!';

            return errors;
        },
    });

    const changeDate = async (newValue: Dayjs | null) =>
        await formik.setFieldValue('birthday', newValue);

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Редактировать профиль</DialogTitle>
            <DialogContent className={styles.EditUserInputsWrapper}>
                <TextField
                    name="surname"
                    value={formik.values.surname}
                    onChange={formik.handleChange}
                    error={!!formik.errors.surname}
                    helperText={formik.errors.surname}
                    label="Фамилия"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                    label="Имя"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    name="patronymic"
                    value={formik.values.patronymic}
                    onChange={formik.handleChange}
                    error={!!formik.errors.patronymic}
                    helperText={formik.errors.patronymic}
                    label="Отчество"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    name="login"
                    value={formik.values.login}
                    onChange={formik.handleChange}
                    error={!!formik.errors.login}
                    helperText={formik.errors.login}
                    label="Логин"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogTitle>Дополнительная информация</DialogTitle>
            <DialogContent className={styles.EditUserInputsWrapper}>
                <TextField
                    name="about_me"
                    value={formik.values.about_me}
                    onChange={formik.handleChange}
                    error={!!formik.errors.about_me}
                    helperText={formik.errors.about_me}
                    rows={4}
                    multiline
                    label="Раскажите о себе"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!formik.errors.email}
                    helperText={formik.errors.email}
                    style={{ marginTop: 14 }}
                    label="Почта"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    name="place_work"
                    value={formik.values.place_work}
                    onChange={formik.handleChange}
                    error={!!formik.errors.place_work}
                    helperText={formik.errors.place_work}
                    label="Место работы/учёбы"
                    fullWidth
                    variant="outlined"
                />
                <LocalizationProvider
                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                    adapterLocale="ru"
                    dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={formik.values.birthday}
                        onChange={changeDate}
                        label="Дата рождения"
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button type="submit">Сохранить</Button>
            </DialogActions>
        </form>
    );
};

export default EditInfoUserModel;
