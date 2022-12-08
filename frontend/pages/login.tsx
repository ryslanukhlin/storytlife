import { Alert, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useFormik } from 'formik';

import style from '../components/layouts/AuthLayout/AuthLayout.module.scss';
import Link from '../components/ui/Link';
import TextMaskCustom from '../components/ui/PhoneInput';
import React, { useState } from 'react';
import { useLoginUserMutation } from '../graphql/generated';
import { LoadingButton } from '@mui/lab';
import { authToken } from '../graphql/store/auth';

const Login = () => {
    const [phone, setPhone] = React.useState('');
    const [login, { loading }] = useLoginUserMutation({ errorPolicy: 'all' });
    const [errLogin, setErrLogin] = useState(false);

    const formik = useFormik({
        initialValues: { password: '', remember: false },
        onSubmit: async ({ password, remember }) => {
            const request = await login({
                variables: {
                    loginInput: { phone, password },
                },
            });
            if (request.errors) {
                setErrLogin(true);
                setTimeout(() => setErrLogin(false), 5000);
            }

            if (request.data) {
                if (remember)
                    localStorage.setItem('auth_token', request.data.loginUser?.access_token!);
                authToken(request.data.loginUser?.access_token!);
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
                <h1 className={style.AuthTitle}>Авторизация</h1>
                {errLogin && (
                    <Alert severity="error" style={{ marginBottom: 20 }}>
                        Неверный логин или пароль!
                    </Alert>
                )}
                <TextField
                    className={style.AuthInput}
                    label="Телефон"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={changePhone}
                    required
                    InputProps={{
                        inputComponent: TextMaskCustom as any,
                    }}
                />
                <TextField
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={style.AuthInput}
                    label="Пароль"
                    type="password"
                />
                <FormGroup className={style.AuthCheckBox}>
                    <FormControlLabel
                        control={<Checkbox name="remember" onChange={formik.handleChange} />}
                        label="Запомнить меня"
                    />
                </FormGroup>
                <LoadingButton
                    loading={loading}
                    type="submit"
                    className={style.AuthButton}
                    variant="contained">
                    Войти
                </LoadingButton>
                <div>
                    У вас нет аккаунта в storylife?&nbsp;
                    <Link href="/register">Зарегистрироваться!</Link>
                </div>
            </form>
        </>
    );
};

export default Login;
