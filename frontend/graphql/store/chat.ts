import { makeVar } from '@apollo/client';
import { Frend } from './auth';

export type Chat = {
    __typename?: 'Chat';
    id: string;
    users?: Array<Frend | null> | null;
} | null;

export const chatData = makeVar<Chat[]>([]);
