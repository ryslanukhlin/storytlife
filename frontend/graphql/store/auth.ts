import { makeVar } from '@apollo/client';

export const auth = makeVar<boolean>(false);

export const authToken = makeVar<string>('');

export type Frend = {
    __typename?: 'User';
    id: string;
    img?: string | null;
    login: string;
    phone: string;
    is_onlite: boolean;
};

export type Chat = {
    __typename?: 'Chat';
    id: string;
    users?: Array<Frend | null> | null;
};

export type Notification = Array<{
    id: string;
    __typename?: 'MessageNotification';
    messages_id?: Array<string> | null;
    chat: { __typename?: 'Chat'; id: string };
} | null>;

export type TypeUser = {
    __typename?: 'User';
    id: string;
    phone: string;
    login: string;
    name: string;
    surname: string;
    patronymic?: string | null;
    about_me?: string | null;
    email?: string | null;
    place_work?: string | null;
    birthday?: string | null;
    created_at: string;
    img?: string | null;
    bg?: string | null;
    is_onlite: boolean;
};

export const userData = makeVar<TypeUser | null>(null);
export const notificationData = makeVar<Notification | null>(null);
