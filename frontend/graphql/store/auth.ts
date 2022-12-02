import { makeVar } from '@apollo/client';

export const auth = makeVar<boolean>(false);

export const authToken = makeVar<string>('');

type typeUser = {
    __typename?: 'User';
    id: string;
    phone: string;
    login: string;
    created_at: string;
    chats?: Array<{
        __typename?: 'Chat';
        id: string;
        users?: Array<{
            __typename?: 'User';
            id: string;
            login: string;
            phone: string;
        } | null> | null;
    } | null> | null;
};

export const userData = makeVar<typeUser | null>(null);
