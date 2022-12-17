import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useEffect } from 'react';
import { useGetCurrentUserLazyQuery, useGetUserLazyQuery } from '../../graphql/generated';
import { authToken, notificationData, userData } from '../../graphql/store/auth';

const publicPath = ['/login', '/register'];

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [download, setDownload] = React.useState(false);
    const router = useRouter();
    const [getCurrentUser] = useGetCurrentUserLazyQuery();
    const token = useReactiveVar(authToken);

    const getUserRequest = async () => {
        const { data } = await getCurrentUser();

        if (data) {
            const { message_notifications, ...user } = data.getCurrentUser;
            userData(user);
            notificationData(message_notifications);
            if (localStorage.getItem('auth_token')) authToken(localStorage.getItem('auth_token')!);
        }
        setDownload(true);
    };

    useEffect(() => {
        getUserRequest();
    }, [token]);

    if (!download && !publicPath.find((path) => path === router.pathname)) return null;

    if (!publicPath.find((path) => path === router.pathname) && !userData() && download) {
        router.push('/login');
        return null;
    }

    if (!!publicPath.find((path) => path === router.pathname) && userData() && download) {
        router.push('/' + userData()!.id);
        return null;
    }

    return <>{children}</>;
};

export default AuthProvider;
