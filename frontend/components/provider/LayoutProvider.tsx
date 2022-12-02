import { useReactiveVar } from '@apollo/client';
import React, { FC, ReactNode } from 'react';
import { userData } from '../../graphql/store/auth';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import UserLayout from '../layouts/UserLayout/UserLayout';

const LayoutProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const user = useReactiveVar(userData);

    if (!user) {
        return <AuthLayout>{children}</AuthLayout>;
    }
    return <UserLayout>{children}</UserLayout>;
};

export default LayoutProvider;
