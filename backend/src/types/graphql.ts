
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TypeCreate {
    ANSWER = "ANSWER",
    OFFER = "OFFER"
}

export enum AcceptCall {
    Accept = "Accept",
    Deny = "Deny"
}

export enum CreateCallResult {
    SUCCESS = "SUCCESS",
    REJECTED = "REJECTED"
}

export class RegisterInput {
    login: string;
    phone: string;
    password: string;
}

export class LoginInput {
    phone: string;
    password: string;
}

export class CreateOfferInput {
    userId: string;
    payload: string;
    connection: TypeCreate;
}

export class CreateCandidateInput {
    candidate: string;
    userId: string;
}

export class MessageInput {
    txt: string;
    roomId: string;
    userId: string;
}

export class CreateCallInput {
    chatId: string;
    userId: string;
    usingVideo: boolean;
}

export class AcceptCallInput {
    chatId: string;
    userId: string;
    acceptCall: AcceptCall;
}

export class DeleteInputNotification {
    notificationId: string;
    messageId: string;
}

export class CreatePostInput {
    title: string;
    description: string;
    img?: Nullable<string>;
}

export class CreateCommentInput {
    postId: string;
    txt: string;
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

    abstract createOffer(createOfferInput: CreateOfferInput): string | Promise<string>;

    abstract createCandidate(createCandidateInput: CreateCandidateInput): string | Promise<string>;

    abstract answerOnCallPage(userId: string): string | Promise<string>;

    abstract leaveCall(userId: string): string | Promise<string>;

    abstract createRoom(userId: string): Chat | Promise<Chat>;

    abstract createMessage(messageInput: MessageInput): string | Promise<string>;

    abstract createCall(createCallInput: CreateCallInput): CreateCallResult | Promise<CreateCallResult>;

    abstract acceptCall(acceptCallInput: AcceptCallInput): string | Promise<string>;

    abstract cancelCall(userId: string): string | Promise<string>;

    abstract deleteNotification(deleteInputNotification: DeleteInputNotification): string | Promise<string>;

    abstract createPost(createPost: CreatePostInput): string | Promise<string>;

    abstract addLike(postId: string): string | Promise<string>;

    abstract addComment(createCommentInput: CreateCommentInput): string | Promise<string>;

    abstract setAvatar(avatar: string): string | Promise<string>;

    abstract setBg(bg: string): string | Promise<string>;

    abstract setOnlineStatus(online: boolean): string | Promise<string>;
}

export class NewCreateType {
    payload: string;
    connection: TypeCreate;
}

export abstract class ISubscription {
    abstract newCreateOffer(userId: string): NewCreateType | Promise<NewCreateType>;

    abstract newCreateCandidate(userId: string): string | Promise<string>;

    abstract newAnswerOnCallPage(userId: string): string | Promise<string>;

    abstract newLeaveCall(userId: string): string | Promise<string>;

    abstract newCreateRoom(userId: string): Chat | Promise<Chat>;

    abstract newMessage(roomId: string): Message | Promise<Message>;

    abstract newNotification(userId: string): MessageNotification | Promise<MessageNotification>;

    abstract newCreteCall(userId: string): CreateCallType | Promise<CreateCallType>;

    abstract newAcceptCall(userId: string): AcceptCallType | Promise<AcceptCallType>;

    abstract newCancelCall(userId: string): string | Promise<string>;

    abstract newPost(userId: string): Post | Promise<Post>;

    abstract newLike(postId: string): Like | Promise<Like>;

    abstract newComment(postId: string): Comment | Promise<Comment>;

    abstract newAvatar(userId: string): string | Promise<string>;

    abstract newBg(userId: string): string | Promise<string>;

    abstract chanhgeOnlineStatus(userId: string): boolean | Promise<boolean>;
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

export class CreateCallType {
    chatId: string;
    usingVideo: boolean;
}

export class AcceptCallType {
    chatId: string;
    acceptCall: AcceptCall;
}

export abstract class IQuery {
    abstract getMessages(roomId: string): Nullable<Message>[] | Promise<Nullable<Message>[]>;

    abstract getUserPosts(userId: string): Post[] | Promise<Post[]>;

    abstract getPosts(): Post[] | Promise<Post[]>;

    abstract getPost(postId: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract getCurrentUser(): User | Promise<User>;

    abstract getUser(userId: string): Nullable<User> | Promise<Nullable<User>>;

    abstract getUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;
}

export class Comment {
    id: string;
    created_at: string;
    txt: string;
    post: Post;
    user: User;
}

export class Like {
    id: string;
    post: Post;
    user: User;
}

export class Post {
    id: string;
    title: string;
    created_at: string;
    description: string;
    img?: Nullable<string>;
    user: User;
    likes: Like[];
    comments: Comment[];
}

export class MessageNotification {
    id: string;
    messages_id?: Nullable<string[]>;
    chat: Chat;
}

export class User {
    id: string;
    login: string;
    phone: string;
    password: string;
    created_at: string;
    is_onlite: boolean;
    img?: Nullable<string>;
    bg?: Nullable<string>;
    chats: Nullable<Chat>[];
    message_notifications: Nullable<MessageNotification>[];
}

type Nullable<T> = T | null;
