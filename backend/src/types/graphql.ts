
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class RegisterInput {
    login: string;
    phone: string;
    password: string;
}

export class LoginInput {
    phone: string;
    password: string;
}

export class MessageInput {
    txt: string;
    roomId: string;
}

export class RegisterObject {
    success: boolean;
}

export class LoginObject {
    access_token: string;
}

export abstract class IMutation {
    abstract registerUser(registerInput?: Nullable<RegisterInput>): Nullable<RegisterObject> | Promise<Nullable<RegisterObject>>;

    abstract loginUser(loginInput?: Nullable<LoginInput>): Nullable<LoginObject> | Promise<Nullable<LoginObject>>;

    abstract createRoom(userId: string): Nullable<Chat> | Promise<Nullable<Chat>>;

    abstract createMessage(messageInput: MessageInput): Nullable<string> | Promise<Nullable<string>>;
}

export class Message {
    id: string;
    text: string;
    created_at: string;
    user_id: string;
    chat_id: string;
}

export class Chat {
    id: string;
    users: Nullable<User>[];
}

export abstract class IQuery {
    abstract getMessages(roomId: string): Nullable<Message>[] | Promise<Nullable<Message>[]>;

    abstract getUser(): User | Promise<User>;

    abstract getUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;
}

export abstract class ISubscription {
    abstract newMessage(roomId: string): Message | Promise<Message>;
}

export class User {
    id: string;
    login: string;
    phone: string;
    password: string;
    created_at: string;
    chats: Nullable<Chat>[];
}

type Nullable<T> = T | null;
