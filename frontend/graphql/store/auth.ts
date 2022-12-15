import { makeVar } from '@apollo/client';

export const auth = makeVar<boolean>(false);

export const authToken = makeVar<string>('');

export type Frend = {
    __typename?: 'User';
    id: string;
    login: string;
    phone: string;
};
export type TypeUser = {
    __typename?: 'User';
    id: string;
    phone: string;
    login: string;
    created_at: string;
    chats?: Array<{
        __typename?: 'Chat';
        id: string;
        users?: Array<Frend | null> | null;
    } | null> | null;
};

export const userData = makeVar<TypeUser | null>(null);
