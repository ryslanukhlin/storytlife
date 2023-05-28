import React, { useState } from 'react';
import { Alert, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import AuthLayout from '../components/layouts/AuthLayout/AuthLayout';
import { useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';

import style from '../components/layouts/AuthLayout/AuthLayout.module.scss';
import Link from '../components/ui/Link';
import { useRegisterUserMutation } from '../graphql/generated';
import TextMaskCustom from '../components/ui/PhoneInput';
import Head from 'next/head';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface ErrorsValid {
    phone?: string;
    login?: string;
    name?: string;
    surname?: string;
    password?: string;
    passwordRepeat?: string;
}

const Register = () => {
    const [register, { loading }] = useRegisterUserMutation({ errorPolicy: 'all' });

    const [phone, setPhone] = React.useState('');
    const [errors, setErrors] = React.useState<ErrorsValid | null>(null);
    const [success, setSuccess] = React.useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowPasswordReoeat = () => setShowPasswordRepeat((show) => !show);

    const formik = useFormik({
        initialValues: {
            login: '',
            name: '',
            surname: '',
            patronymic: '',
            password: '',
            passwordRepeat: '',
        },
        onSubmit: async (variables) => {
            const { passwordRepeat, ...data } = variables;
            if (data.password !== passwordRepeat) {
                setErrors({ passwordRepeat: 'Пароли не совпадают' });
                return;
            }
            const request = await register({
                variables: {
                    registerInput: { ...data, phone },
                },
            });

            if (request.errors)
                setErrors((request.errors[0].extensions.exception as any).response as ErrorsValid);
            if (request.data?.registerUser?.success) {
                setSuccess(true);
                setErrors(null);
                setTimeout(() => setSuccess(false), 5000);
            }
        },
    });

    const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '+7 (') {
            setPhone('');
            return;
        }
        setPhone(e.target.value);
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Head>
                    <title>Регистрация</title>
                </Head>
                <h1 className={style.AuthTitle}>Зарегистрироваться</h1>
                {success && (
                    <Alert severity="success" style={{ marginBottom: 20 }}>
                        Регистрация прошла успешно!
                    </Alert>
                )}
                <Grid container columnSpacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={style.AuthInput}
                            label="Имя"
                            required
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            error={!!errors?.name}
                            helperText={errors?.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={style.AuthInput}
                            label="Фамилия"
                            required
                            name="surname"
                            onChange={formik.handleChange}
                            value={formik.values.surname}
                            error={!!errors?.surname}
                            helperText={errors?.surname}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={style.AuthInput}
                            label="Отчество"
                            name="patronymic"
                            onChange={formik.handleChange}
                            value={formik.values.patronymic}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={style.AuthInput}
                            label="Логин"
                            required
                            name="login"
                            onChange={formik.handleChange}
                            value={formik.values.login}
                            error={!!errors?.login}
                            helperText={errors?.login}
                        />
                    </Grid>
                </Grid>
                <TextField
                    className={style.AuthInput}
                    label="Телефон"
                    type="tel"
                    value={phone}
                    onChange={changePhone}
                    required
                    InputProps={{
                        inputComponent: TextMaskCustom as any,
                    }}
                    error={!!errors?.phone}
                    helperText={errors?.phone}
                />
                <TextField
                    className={style.AuthInput}
                    label="Пароль"
                    required
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={!!errors?.password}
                    helperText={errors?.password}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                size="small"
                                onClick={handleClickShowPassword}
                                className={style.authIconShowPassword}>
                                <InputAdornment position="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </InputAdornment>
                            </IconButton>
                        ),
                    }}
                />
                <TextField
                    className={style.AuthInput}
                    label="Повторите пароль"
                    required
                    name="passwordRepeat"
                    onChange={formik.handleChange}
                    value={formik.values.passwordRepeat}
                    error={!!errors?.passwordRepeat}
                    helperText={errors?.passwordRepeat}
                    type={showPasswordRepeat ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                size="small"
                                onClick={handleClickShowPasswordReoeat}
                                className={style.authIconShowPassword}>
                                <InputAdornment position="end">
                                    {showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                                </InputAdornment>
                            </IconButton>
                        ),
                    }}
                />
                <LoadingButton
                    loading={loading}
                    type="submit"
                    className={style.AuthButton}
                    variant="contained">
                    Создать аккаунт
                </LoadingButton>
                <div>
                    У вас уже есть аккаунта в storylife? <Link href="/login">Авторизоваться!</Link>
                </div>
            </form>
        </>
    );
};

export default Register;
