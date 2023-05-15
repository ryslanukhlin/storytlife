import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { userData } from '../graphql/store/auth';

const MainRoute = () => {
    const router = useRouter();

    if (userData()) router.push('/' + userData()?.id);
    else router.push('/login');
};

export default MainRoute;
