import { makeVar } from '@apollo/client';

export const auth = makeVar<boolean>(false);

export const authToken = makeVar<string>('');

export type Frend = {
    __typename?: 'User';
    id: string;
    img?: string | null;
    login: string;
    phone: string;
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
    created_at: string;
    img?: string | null;
    bg?: string | null;
    chats?: Array<{
        __typename?: 'Chat';
        id: string;
        users?: Array<Frend | null> | null;
    } | null> | null;
};

export const userData = makeVar<TypeUser | null>(null);
export const notificationData = makeVar<Notification | null>(null);
