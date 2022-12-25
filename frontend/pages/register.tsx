import React from 'react';
import { Alert, TextField } from '@mui/material';
import AuthLayout from '../components/layouts/AuthLayout/AuthLayout';
import { useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';

import style from '../components/layouts/AuthLayout/AuthLayout.module.scss';
import Link from '../components/ui/Link';
import { useRegisterUserMutation } from '../graphql/generated';
import TextMaskCustom from '../components/ui/PhoneInput';
import Head from 'next/head';

interface ErrorsValid {
    phone?: string;
    login?: string;
    password?: string;
    passwordRepeat?: string;
}

const Register = () => {
    const [register, { loading }] = useRegisterUserMutation({ errorPolicy: 'all' });
    const [phone, setPhone] = React.useState('');
    const [errors, setErrors] = React.useState<ErrorsValid | null>(null);
    const [success, setSuccess] = React.useState(false);

    const formik = useFormik({
        initialValues: { login: '', password: '', passwordRepeat: '' },
        onSubmit: async ({ login, password, passwordRepeat }) => {
            if (password !== passwordRepeat) {
                setErrors({ passwordRepeat: 'Пароли не совпадают' });
                return;
            }
            const request = await register({
                variables: {
                    registerInput: { login, phone, password },
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
                    type="password"
                    required
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={!!errors?.password}
                    helperText={errors?.password}
                />
                <TextField
                    className={style.AuthInput}
                    label="Повторите пароль"
                    type="password"
                    required
                    name="passwordRepeat"
                    onChange={formik.handleChange}
                    value={formik.values.passwordRepeat}
                    error={!!errors?.passwordRepeat}
                    helperText={errors?.passwordRepeat}
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
