import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum AcceptCall {
  Accept = 'Accept',
  Deny = 'Deny'
}

export type AcceptCallInput = {
  acceptCall: AcceptCall;
  chatId: Scalars['String'];
  userId: Scalars['String'];
};

export type AcceptCallType = {
  __typename?: 'AcceptCallType';
  acceptCall: AcceptCall;
  chatId: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  id: Scalars['String'];
  users: Array<Maybe<User>>;
};

export type Comment = {
  __typename?: 'Comment';
  created_at: Scalars['String'];
  id: Scalars['String'];
  post: Post;
  txt: Scalars['String'];
  user: User;
};

export type CreateCallInput = {
  chatId: Scalars['String'];
  userId: Scalars['String'];
  usingVideo: Scalars['Boolean'];
};

export type CreateCallType = {
  __typename?: 'CreateCallType';
  chatId: Scalars['String'];
  usingVideo: Scalars['Boolean'];
};

export type CreateCandidateInput = {
  candidate: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateCommentInput = {
  postId: Scalars['String'];
  txt: Scalars['String'];
};

export type CreateOfferInput = {
  connection: TypeCreate;
  payload: Scalars['String'];
  userId: Scalars['String'];
};

export type CreatePostInput = {
  description: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type DeleteInputNotification = {
  messageId: Scalars['String'];
  notificationId: Scalars['String'];
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['String'];
  post: Post;
  user: User;
};

export type LoginInput = {
  password: Scalars['String'];
  phone: Scalars['String'];
};

export type LoginObject = {
  __typename?: 'LoginObject';
  access_token: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  chat_id: Scalars['String'];
  created_at: Scalars['String'];
  id: Scalars['String'];
  text: Scalars['String'];
  user_id: Scalars['String'];
};

export type MessageInput = {
  roomId: Scalars['String'];
  txt: Scalars['String'];
  userId: Scalars['String'];
};

export type MessageNotification = {
  __typename?: 'MessageNotification';
  chat: Chat;
  id: Scalars['String'];
  messages_id?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptCall: Scalars['String'];
  addComment: Scalars['String'];
  addLike: Scalars['String'];
  answerOnCallPage: Scalars['String'];
  cancelCall: Scalars['String'];
  createCall: Scalars['String'];
  createCandidate: Scalars['String'];
  createMessage: Scalars['String'];
  createOffer: Scalars['String'];
  createPost: Scalars['String'];
  createRoom: Chat;
  deleteNotification: Scalars['String'];
  leaveCall: Scalars['String'];
  loginUser?: Maybe<LoginObject>;
  registerUser?: Maybe<RegisterObject>;
};


export type MutationAcceptCallArgs = {
  acceptCallInput: AcceptCallInput;
};


export type MutationAddCommentArgs = {
  createCommentInput: CreateCommentInput;
};


export type MutationAddLikeArgs = {
  postId: Scalars['String'];
};


export type MutationAnswerOnCallPageArgs = {
  userId: Scalars['String'];
};


export type MutationCancelCallArgs = {
  userId: Scalars['String'];
};


export type MutationCreateCallArgs = {
  createCallInput: CreateCallInput;
};


export type MutationCreateCandidateArgs = {
  createCandidateInput: CreateCandidateInput;
};


export type MutationCreateMessageArgs = {
  messageInput: MessageInput;
};


export type MutationCreateOfferArgs = {
  createOfferInput: CreateOfferInput;
};


export type MutationCreatePostArgs = {
  createPost: CreatePostInput;
};


export type MutationCreateRoomArgs = {
  userId: Scalars['String'];
};


export type MutationDeleteNotificationArgs = {
  deleteInputNotification: DeleteInputNotification;
};


export type MutationLeaveCallArgs = {
  userId: Scalars['String'];
};


export type MutationLoginUserArgs = {
  loginInput?: InputMaybe<LoginInput>;
};


export type MutationRegisterUserArgs = {
  registerInput?: InputMaybe<RegisterInput>;
};

export type NewCreateType = {
  __typename?: 'NewCreateType';
  connection: TypeCreate;
  payload: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  comments: Array<Comment>;
  created_at: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['String'];
  img?: Maybe<Scalars['String']>;
  likes: Array<Like>;
  title: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser: User;
  getMessages: Array<Maybe<Message>>;
  getPost?: Maybe<Post>;
  getPosts: Array<Post>;
  getUser?: Maybe<User>;
  getUserPosts: Array<Post>;
  getUsers: Array<Maybe<User>>;
};


export type QueryGetMessagesArgs = {
  roomId: Scalars['String'];
};


export type QueryGetPostArgs = {
  postId: Scalars['String'];
};


export type QueryGetUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserPostsArgs = {
  userId: Scalars['String'];
};

export type RegisterInput = {
  login: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
};

export type RegisterObject = {
  __typename?: 'RegisterObject';
  success: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAcceptCall: AcceptCallType;
  newAnswerOnCallPage: Scalars['String'];
  newCancelCall: Scalars['String'];
  newComment: Comment;
  newCreateCandidate: Scalars['String'];
  newCreateOffer: NewCreateType;
  newCreateRoom: Chat;
  newCreteCall: CreateCallType;
  newLeaveCall: Scalars['String'];
  newLike: Like;
  newMessage: Message;
  newNotification: MessageNotification;
  newPost: Post;
};


export type SubscriptionNewAcceptCallArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewAnswerOnCallPageArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewCancelCallArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewCommentArgs = {
  postId: Scalars['String'];
};


export type SubscriptionNewCreateCandidateArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewCreateOfferArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewCreateRoomArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewCreteCallArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewLeaveCallArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewLikeArgs = {
  postId: Scalars['String'];
};


export type SubscriptionNewMessageArgs = {
  roomId: Scalars['String'];
};


export type SubscriptionNewNotificationArgs = {
  userId: Scalars['String'];
};


export type SubscriptionNewPostArgs = {
  userId: Scalars['String'];
};

export enum TypeCreate {
  Answer = 'ANSWER',
  Offer = 'OFFER'
}

export type User = {
  __typename?: 'User';
  chats: Array<Maybe<Chat>>;
  created_at: Scalars['String'];
  id: Scalars['String'];
  login: Scalars['String'];
  message_notifications: Array<Maybe<MessageNotification>>;
  password: Scalars['String'];
  phone: Scalars['String'];
};

export type RegisterUserMutationVariables = Exact<{
  registerInput?: InputMaybe<RegisterInput>;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'RegisterObject', success: boolean } | null };

export type LoginUserMutationVariables = Exact<{
  loginInput?: InputMaybe<LoginInput>;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser?: { __typename?: 'LoginObject', access_token: string } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, phone: string, login: string, created_at: string, chats: Array<{ __typename?: 'Chat', id: string, users: Array<{ __typename?: 'User', id: string, login: string, phone: string } | null> } | null>, message_notifications: Array<{ __typename?: 'MessageNotification', id: string, messages_id?: Array<string> | null, chat: { __typename?: 'Chat', id: string } } | null> } };

export type GetUserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, phone: string, login: string, created_at: string } | null };

export type CreateCallMutationVariables = Exact<{
  createCallInput: CreateCallInput;
}>;


export type CreateCallMutation = { __typename?: 'Mutation', createCall: string };

export type NewCreteCallSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCreteCallSubscription = { __typename?: 'Subscription', newCreteCall: { __typename?: 'CreateCallType', chatId: string, usingVideo: boolean } };

export type AcceptCallMutationVariables = Exact<{
  acceptCallInput: AcceptCallInput;
}>;


export type AcceptCallMutation = { __typename?: 'Mutation', acceptCall: string };

export type NewAcceptCallSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewAcceptCallSubscription = { __typename?: 'Subscription', newAcceptCall: { __typename?: 'AcceptCallType', acceptCall: AcceptCall, chatId: string } };

export type CancelCallMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type CancelCallMutation = { __typename?: 'Mutation', cancelCall: string };

export type NewCancelCallSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCancelCallSubscription = { __typename?: 'Subscription', newCancelCall: string };

export type NewNotificationSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewNotificationSubscription = { __typename?: 'Subscription', newNotification: { __typename?: 'MessageNotification', id: string, messages_id?: Array<string> | null, chat: { __typename?: 'Chat', id: string } } };

export type CreateOfferMutationVariables = Exact<{
  createOfferInput: CreateOfferInput;
}>;


export type CreateOfferMutation = { __typename?: 'Mutation', createOffer: string };

export type NewCreateOfferSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCreateOfferSubscription = { __typename?: 'Subscription', newCreateOffer: { __typename?: 'NewCreateType', connection: TypeCreate, payload: string } };

export type CreateCandidateMutationVariables = Exact<{
  createCandidateInput: CreateCandidateInput;
}>;


export type CreateCandidateMutation = { __typename?: 'Mutation', createCandidate: string };

export type NewCreateCandidateSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCreateCandidateSubscription = { __typename?: 'Subscription', newCreateCandidate: string };

export type AnswerOnCallPageMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type AnswerOnCallPageMutation = { __typename?: 'Mutation', answerOnCallPage: string };

export type NewAnswerOnCallPageSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewAnswerOnCallPageSubscription = { __typename?: 'Subscription', newAnswerOnCallPage: string };

export type LeaveCallMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type LeaveCallMutation = { __typename?: 'Mutation', leaveCall: string };

export type NewLeaveCallSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewLeaveCallSubscription = { __typename?: 'Subscription', newLeaveCall: string };

export type CreateRoomMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Chat', id: string, users: Array<{ __typename?: 'User', id: string, login: string, phone: string } | null> } };

export type CreateMessageMutationVariables = Exact<{
  messageInput: MessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: string };

export type NewMessageSubscriptionVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'Message', id: string, user_id: string, text: string } };

export type NewCreateRoomSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewCreateRoomSubscription = { __typename?: 'Subscription', newCreateRoom: { __typename?: 'Chat', id: string, users: Array<{ __typename?: 'User', id: string, login: string, phone: string } | null> } };

export type GetMessagesQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'Message', id: string, user_id: string, text: string } | null> };

export type DeleteNotificationMutationVariables = Exact<{
  deleteInputNotification: DeleteInputNotification;
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotification: string };

export type GetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: Array<{ __typename?: 'Post', id: string, created_at: string, title: string, description: string, img?: string | null, user: { __typename?: 'User', login: string } }> };

export type GetUserPostsQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserPostsQuery = { __typename?: 'Query', getUserPosts: Array<{ __typename?: 'Post', id: string, description: string, img?: string | null, created_at: string, title: string, user: { __typename?: 'User', login: string }, likes: Array<{ __typename?: 'Like', user: { __typename?: 'User', id: string } }>, comments: Array<{ __typename?: 'Comment', id: string, txt: string, created_at: string, user: { __typename?: 'User', login: string } }> }> };

export type GetPostQueryVariables = Exact<{
  postId: Scalars['String'];
}>;


export type GetPostQuery = { __typename?: 'Query', getPost?: { __typename?: 'Post', id: string, title: string, description: string, created_at: string, img?: string | null, user: { __typename?: 'User', login: string }, likes: Array<{ __typename?: 'Like', user: { __typename?: 'User', id: string } }>, comments: Array<{ __typename?: 'Comment', id: string, txt: string, created_at: string, user: { __typename?: 'User', login: string } }> } | null };

export type CreatePostMutationVariables = Exact<{
  createPost: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: string };

export type NewPostSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewPostSubscription = { __typename?: 'Subscription', newPost: { __typename?: 'Post', id: string, description: string, img?: string | null, created_at: string, title: string, user: { __typename?: 'User', login: string }, likes: Array<{ __typename?: 'Like', user: { __typename?: 'User', id: string } }>, comments: Array<{ __typename?: 'Comment', id: string, txt: string, created_at: string, user: { __typename?: 'User', login: string } }> } };

export type AddLikeMutationVariables = Exact<{
  postId: Scalars['String'];
}>;


export type AddLikeMutation = { __typename?: 'Mutation', addLike: string };

export type NewLikeSubscriptionVariables = Exact<{
  postId: Scalars['String'];
}>;


export type NewLikeSubscription = { __typename?: 'Subscription', newLike: { __typename?: 'Like', user: { __typename?: 'User', id: string } } };

export type AddCommentMutationVariables = Exact<{
  createCommentInput: CreateCommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: string };

export type NewCommentSubscriptionVariables = Exact<{
  postId: Scalars['String'];
}>;


export type NewCommentSubscription = { __typename?: 'Subscription', newComment: { __typename?: 'Comment', id: string, txt: string, created_at: string, user: { __typename?: 'User', login: string } } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', id: string, login: string, phone: string } | null> };


export const RegisterUserDocument = gql`
    mutation RegisterUser($registerInput: RegisterInput) {
  registerUser(registerInput: $registerInput) {
    success
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($loginInput: LoginInput) {
  loginUser(loginInput: $loginInput) {
    access_token
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    phone
    login
    created_at
    chats {
      id
      users {
        id
        login
        phone
      }
    }
    message_notifications {
      id
      messages_id
      chat {
        id
      }
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($userId: String!) {
  getUser(userId: $userId) {
    id
    phone
    login
    created_at
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const CreateCallDocument = gql`
    mutation CreateCall($createCallInput: CreateCallInput!) {
  createCall(createCallInput: $createCallInput)
}
    `;
export type CreateCallMutationFn = Apollo.MutationFunction<CreateCallMutation, CreateCallMutationVariables>;

/**
 * __useCreateCallMutation__
 *
 * To run a mutation, you first call `useCreateCallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCallMutation, { data, loading, error }] = useCreateCallMutation({
 *   variables: {
 *      createCallInput: // value for 'createCallInput'
 *   },
 * });
 */
export function useCreateCallMutation(baseOptions?: Apollo.MutationHookOptions<CreateCallMutation, CreateCallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCallMutation, CreateCallMutationVariables>(CreateCallDocument, options);
      }
export type CreateCallMutationHookResult = ReturnType<typeof useCreateCallMutation>;
export type CreateCallMutationResult = Apollo.MutationResult<CreateCallMutation>;
export type CreateCallMutationOptions = Apollo.BaseMutationOptions<CreateCallMutation, CreateCallMutationVariables>;
export const NewCreteCallDocument = gql`
    subscription NewCreteCall($userId: String!) {
  newCreteCall(userId: $userId) {
    chatId
    usingVideo
  }
}
    `;

/**
 * __useNewCreteCallSubscription__
 *
 * To run a query within a React component, call `useNewCreteCallSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCreteCallSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCreteCallSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewCreteCallSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCreteCallSubscription, NewCreteCallSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCreteCallSubscription, NewCreteCallSubscriptionVariables>(NewCreteCallDocument, options);
      }
export type NewCreteCallSubscriptionHookResult = ReturnType<typeof useNewCreteCallSubscription>;
export type NewCreteCallSubscriptionResult = Apollo.SubscriptionResult<NewCreteCallSubscription>;
export const AcceptCallDocument = gql`
    mutation AcceptCall($acceptCallInput: AcceptCallInput!) {
  acceptCall(acceptCallInput: $acceptCallInput)
}
    `;
export type AcceptCallMutationFn = Apollo.MutationFunction<AcceptCallMutation, AcceptCallMutationVariables>;

/**
 * __useAcceptCallMutation__
 *
 * To run a mutation, you first call `useAcceptCallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptCallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptCallMutation, { data, loading, error }] = useAcceptCallMutation({
 *   variables: {
 *      acceptCallInput: // value for 'acceptCallInput'
 *   },
 * });
 */
export function useAcceptCallMutation(baseOptions?: Apollo.MutationHookOptions<AcceptCallMutation, AcceptCallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptCallMutation, AcceptCallMutationVariables>(AcceptCallDocument, options);
      }
export type AcceptCallMutationHookResult = ReturnType<typeof useAcceptCallMutation>;
export type AcceptCallMutationResult = Apollo.MutationResult<AcceptCallMutation>;
export type AcceptCallMutationOptions = Apollo.BaseMutationOptions<AcceptCallMutation, AcceptCallMutationVariables>;
export const NewAcceptCallDocument = gql`
    subscription NewAcceptCall($userId: String!) {
  newAcceptCall(userId: $userId) {
    acceptCall
    chatId
  }
}
    `;

/**
 * __useNewAcceptCallSubscription__
 *
 * To run a query within a React component, call `useNewAcceptCallSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewAcceptCallSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewAcceptCallSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewAcceptCallSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewAcceptCallSubscription, NewAcceptCallSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewAcceptCallSubscription, NewAcceptCallSubscriptionVariables>(NewAcceptCallDocument, options);
      }
export type NewAcceptCallSubscriptionHookResult = ReturnType<typeof useNewAcceptCallSubscription>;
export type NewAcceptCallSubscriptionResult = Apollo.SubscriptionResult<NewAcceptCallSubscription>;
export const CancelCallDocument = gql`
    mutation CancelCall($userId: String!) {
  cancelCall(userId: $userId)
}
    `;
export type CancelCallMutationFn = Apollo.MutationFunction<CancelCallMutation, CancelCallMutationVariables>;

/**
 * __useCancelCallMutation__
 *
 * To run a mutation, you first call `useCancelCallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelCallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelCallMutation, { data, loading, error }] = useCancelCallMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCancelCallMutation(baseOptions?: Apollo.MutationHookOptions<CancelCallMutation, CancelCallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelCallMutation, CancelCallMutationVariables>(CancelCallDocument, options);
      }
export type CancelCallMutationHookResult = ReturnType<typeof useCancelCallMutation>;
export type CancelCallMutationResult = Apollo.MutationResult<CancelCallMutation>;
export type CancelCallMutationOptions = Apollo.BaseMutationOptions<CancelCallMutation, CancelCallMutationVariables>;
export const NewCancelCallDocument = gql`
    subscription NewCancelCall($userId: String!) {
  newCancelCall(userId: $userId)
}
    `;

/**
 * __useNewCancelCallSubscription__
 *
 * To run a query within a React component, call `useNewCancelCallSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCancelCallSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCancelCallSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewCancelCallSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCancelCallSubscription, NewCancelCallSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCancelCallSubscription, NewCancelCallSubscriptionVariables>(NewCancelCallDocument, options);
      }
export type NewCancelCallSubscriptionHookResult = ReturnType<typeof useNewCancelCallSubscription>;
export type NewCancelCallSubscriptionResult = Apollo.SubscriptionResult<NewCancelCallSubscription>;
export const NewNotificationDocument = gql`
    subscription NewNotification($userId: String!) {
  newNotification(userId: $userId) {
    id
    messages_id
    chat {
      id
    }
  }
}
    `;

/**
 * __useNewNotificationSubscription__
 *
 * To run a query within a React component, call `useNewNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewNotificationSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewNotificationSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewNotificationSubscription, NewNotificationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewNotificationSubscription, NewNotificationSubscriptionVariables>(NewNotificationDocument, options);
      }
export type NewNotificationSubscriptionHookResult = ReturnType<typeof useNewNotificationSubscription>;
export type NewNotificationSubscriptionResult = Apollo.SubscriptionResult<NewNotificationSubscription>;
export const CreateOfferDocument = gql`
    mutation CreateOffer($createOfferInput: CreateOfferInput!) {
  createOffer(createOfferInput: $createOfferInput)
}
    `;
export type CreateOfferMutationFn = Apollo.MutationFunction<CreateOfferMutation, CreateOfferMutationVariables>;

/**
 * __useCreateOfferMutation__
 *
 * To run a mutation, you first call `useCreateOfferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOfferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOfferMutation, { data, loading, error }] = useCreateOfferMutation({
 *   variables: {
 *      createOfferInput: // value for 'createOfferInput'
 *   },
 * });
 */
export function useCreateOfferMutation(baseOptions?: Apollo.MutationHookOptions<CreateOfferMutation, CreateOfferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOfferMutation, CreateOfferMutationVariables>(CreateOfferDocument, options);
      }
export type CreateOfferMutationHookResult = ReturnType<typeof useCreateOfferMutation>;
export type CreateOfferMutationResult = Apollo.MutationResult<CreateOfferMutation>;
export type CreateOfferMutationOptions = Apollo.BaseMutationOptions<CreateOfferMutation, CreateOfferMutationVariables>;
export const NewCreateOfferDocument = gql`
    subscription NewCreateOffer($userId: String!) {
  newCreateOffer(userId: $userId) {
    connection
    payload
  }
}
    `;

/**
 * __useNewCreateOfferSubscription__
 *
 * To run a query within a React component, call `useNewCreateOfferSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCreateOfferSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCreateOfferSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewCreateOfferSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCreateOfferSubscription, NewCreateOfferSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCreateOfferSubscription, NewCreateOfferSubscriptionVariables>(NewCreateOfferDocument, options);
      }
export type NewCreateOfferSubscriptionHookResult = ReturnType<typeof useNewCreateOfferSubscription>;
export type NewCreateOfferSubscriptionResult = Apollo.SubscriptionResult<NewCreateOfferSubscription>;
export const CreateCandidateDocument = gql`
    mutation CreateCandidate($createCandidateInput: CreateCandidateInput!) {
  createCandidate(createCandidateInput: $createCandidateInput)
}
    `;
export type CreateCandidateMutationFn = Apollo.MutationFunction<CreateCandidateMutation, CreateCandidateMutationVariables>;

/**
 * __useCreateCandidateMutation__
 *
 * To run a mutation, you first call `useCreateCandidateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCandidateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCandidateMutation, { data, loading, error }] = useCreateCandidateMutation({
 *   variables: {
 *      createCandidateInput: // value for 'createCandidateInput'
 *   },
 * });
 */
export function useCreateCandidateMutation(baseOptions?: Apollo.MutationHookOptions<CreateCandidateMutation, CreateCandidateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCandidateMutation, CreateCandidateMutationVariables>(CreateCandidateDocument, options);
      }
export type CreateCandidateMutationHookResult = ReturnType<typeof useCreateCandidateMutation>;
export type CreateCandidateMutationResult = Apollo.MutationResult<CreateCandidateMutation>;
export type CreateCandidateMutationOptions = Apollo.BaseMutationOptions<CreateCandidateMutation, CreateCandidateMutationVariables>;
export const NewCreateCandidateDocument = gql`
    subscription NewCreateCandidate($userId: String!) {
  newCreateCandidate(userId: $userId)
}
    `;

/**
 * __useNewCreateCandidateSubscription__
 *
 * To run a query within a React component, call `useNewCreateCandidateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCreateCandidateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCreateCandidateSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewCreateCandidateSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCreateCandidateSubscription, NewCreateCandidateSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCreateCandidateSubscription, NewCreateCandidateSubscriptionVariables>(NewCreateCandidateDocument, options);
      }
export type NewCreateCandidateSubscriptionHookResult = ReturnType<typeof useNewCreateCandidateSubscription>;
export type NewCreateCandidateSubscriptionResult = Apollo.SubscriptionResult<NewCreateCandidateSubscription>;
export const AnswerOnCallPageDocument = gql`
    mutation AnswerOnCallPage($userId: String!) {
  answerOnCallPage(userId: $userId)
}
    `;
export type AnswerOnCallPageMutationFn = Apollo.MutationFunction<AnswerOnCallPageMutation, AnswerOnCallPageMutationVariables>;

/**
 * __useAnswerOnCallPageMutation__
 *
 * To run a mutation, you first call `useAnswerOnCallPageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnswerOnCallPageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [answerOnCallPageMutation, { data, loading, error }] = useAnswerOnCallPageMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAnswerOnCallPageMutation(baseOptions?: Apollo.MutationHookOptions<AnswerOnCallPageMutation, AnswerOnCallPageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AnswerOnCallPageMutation, AnswerOnCallPageMutationVariables>(AnswerOnCallPageDocument, options);
      }
export type AnswerOnCallPageMutationHookResult = ReturnType<typeof useAnswerOnCallPageMutation>;
export type AnswerOnCallPageMutationResult = Apollo.MutationResult<AnswerOnCallPageMutation>;
export type AnswerOnCallPageMutationOptions = Apollo.BaseMutationOptions<AnswerOnCallPageMutation, AnswerOnCallPageMutationVariables>;
export const NewAnswerOnCallPageDocument = gql`
    subscription NewAnswerOnCallPage($userId: String!) {
  newAnswerOnCallPage(userId: $userId)
}
    `;

/**
 * __useNewAnswerOnCallPageSubscription__
 *
 * To run a query within a React component, call `useNewAnswerOnCallPageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewAnswerOnCallPageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewAnswerOnCallPageSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewAnswerOnCallPageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewAnswerOnCallPageSubscription, NewAnswerOnCallPageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewAnswerOnCallPageSubscription, NewAnswerOnCallPageSubscriptionVariables>(NewAnswerOnCallPageDocument, options);
      }
export type NewAnswerOnCallPageSubscriptionHookResult = ReturnType<typeof useNewAnswerOnCallPageSubscription>;
export type NewAnswerOnCallPageSubscriptionResult = Apollo.SubscriptionResult<NewAnswerOnCallPageSubscription>;
export const LeaveCallDocument = gql`
    mutation LeaveCall($userId: String!) {
  leaveCall(userId: $userId)
}
    `;
export type LeaveCallMutationFn = Apollo.MutationFunction<LeaveCallMutation, LeaveCallMutationVariables>;

/**
 * __useLeaveCallMutation__
 *
 * To run a mutation, you first call `useLeaveCallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveCallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveCallMutation, { data, loading, error }] = useLeaveCallMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLeaveCallMutation(baseOptions?: Apollo.MutationHookOptions<LeaveCallMutation, LeaveCallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveCallMutation, LeaveCallMutationVariables>(LeaveCallDocument, options);
      }
export type LeaveCallMutationHookResult = ReturnType<typeof useLeaveCallMutation>;
export type LeaveCallMutationResult = Apollo.MutationResult<LeaveCallMutation>;
export type LeaveCallMutationOptions = Apollo.BaseMutationOptions<LeaveCallMutation, LeaveCallMutationVariables>;
export const NewLeaveCallDocument = gql`
    subscription NewLeaveCall($userId: String!) {
  newLeaveCall(userId: $userId)
}
    `;

/**
 * __useNewLeaveCallSubscription__
 *
 * To run a query within a React component, call `useNewLeaveCallSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewLeaveCallSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewLeaveCallSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewLeaveCallSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewLeaveCallSubscription, NewLeaveCallSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewLeaveCallSubscription, NewLeaveCallSubscriptionVariables>(NewLeaveCallDocument, options);
      }
export type NewLeaveCallSubscriptionHookResult = ReturnType<typeof useNewLeaveCallSubscription>;
export type NewLeaveCallSubscriptionResult = Apollo.SubscriptionResult<NewLeaveCallSubscription>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($userId: String!) {
  createRoom(userId: $userId) {
    id
    users {
      id
      login
      phone
    }
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($messageInput: MessageInput!) {
  createMessage(messageInput: $messageInput)
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      messageInput: // value for 'messageInput'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const NewMessageDocument = gql`
    subscription NewMessage($roomId: String!) {
  newMessage(roomId: $roomId) {
    id
    user_id
    text
  }
}
    `;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, options);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = Apollo.SubscriptionResult<NewMessageSubscription>;
export const NewCreateRoomDocument = gql`
    subscription NewCreateRoom($userId: String!) {
  newCreateRoom(userId: $userId) {
    id
    users {
      id
      login
      phone
    }
  }
}
    `;

/**
 * __useNewCreateRoomSubscription__
 *
 * To run a query within a React component, call `useNewCreateRoomSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCreateRoomSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCreateRoomSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewCreateRoomSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCreateRoomSubscription, NewCreateRoomSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCreateRoomSubscription, NewCreateRoomSubscriptionVariables>(NewCreateRoomDocument, options);
      }
export type NewCreateRoomSubscriptionHookResult = ReturnType<typeof useNewCreateRoomSubscription>;
export type NewCreateRoomSubscriptionResult = Apollo.SubscriptionResult<NewCreateRoomSubscription>;
export const GetMessagesDocument = gql`
    query GetMessages($roomId: String!) {
  getMessages(roomId: $roomId) {
    id
    user_id
    text
  }
}
    `;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const DeleteNotificationDocument = gql`
    mutation DeleteNotification($deleteInputNotification: DeleteInputNotification!) {
  deleteNotification(deleteInputNotification: $deleteInputNotification)
}
    `;
export type DeleteNotificationMutationFn = Apollo.MutationFunction<DeleteNotificationMutation, DeleteNotificationMutationVariables>;

/**
 * __useDeleteNotificationMutation__
 *
 * To run a mutation, you first call `useDeleteNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationMutation, { data, loading, error }] = useDeleteNotificationMutation({
 *   variables: {
 *      deleteInputNotification: // value for 'deleteInputNotification'
 *   },
 * });
 */
export function useDeleteNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNotificationMutation, DeleteNotificationMutationVariables>(DeleteNotificationDocument, options);
      }
export type DeleteNotificationMutationHookResult = ReturnType<typeof useDeleteNotificationMutation>;
export type DeleteNotificationMutationResult = Apollo.MutationResult<DeleteNotificationMutation>;
export type DeleteNotificationMutationOptions = Apollo.BaseMutationOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const GetPostsDocument = gql`
    query GetPosts {
  getPosts {
    id
    created_at
    title
    description
    img
    user {
      login
    }
  }
}
    `;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetUserPostsDocument = gql`
    query GetUserPosts($userId: String!) {
  getUserPosts(userId: $userId) {
    id
    description
    img
    created_at
    title
    user {
      login
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      txt
      created_at
      user {
        login
      }
    }
  }
}
    `;

/**
 * __useGetUserPostsQuery__
 *
 * To run a query within a React component, call `useGetUserPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPostsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPostsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPostsQuery, GetUserPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPostsQuery, GetUserPostsQueryVariables>(GetUserPostsDocument, options);
      }
export function useGetUserPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPostsQuery, GetUserPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPostsQuery, GetUserPostsQueryVariables>(GetUserPostsDocument, options);
        }
export type GetUserPostsQueryHookResult = ReturnType<typeof useGetUserPostsQuery>;
export type GetUserPostsLazyQueryHookResult = ReturnType<typeof useGetUserPostsLazyQuery>;
export type GetUserPostsQueryResult = Apollo.QueryResult<GetUserPostsQuery, GetUserPostsQueryVariables>;
export const GetPostDocument = gql`
    query GetPost($postId: String!) {
  getPost(postId: $postId) {
    id
    title
    description
    created_at
    img
    user {
      login
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      txt
      created_at
      user {
        login
      }
    }
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($createPost: CreatePostInput!) {
  createPost(createPost: $createPost)
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      createPost: // value for 'createPost'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const NewPostDocument = gql`
    subscription NewPost($userId: String!) {
  newPost(userId: $userId) {
    id
    description
    img
    created_at
    title
    user {
      login
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      txt
      created_at
      user {
        login
      }
    }
  }
}
    `;

/**
 * __useNewPostSubscription__
 *
 * To run a query within a React component, call `useNewPostSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewPostSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewPostSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewPostSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewPostSubscription, NewPostSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewPostSubscription, NewPostSubscriptionVariables>(NewPostDocument, options);
      }
export type NewPostSubscriptionHookResult = ReturnType<typeof useNewPostSubscription>;
export type NewPostSubscriptionResult = Apollo.SubscriptionResult<NewPostSubscription>;
export const AddLikeDocument = gql`
    mutation AddLike($postId: String!) {
  addLike(postId: $postId)
}
    `;
export type AddLikeMutationFn = Apollo.MutationFunction<AddLikeMutation, AddLikeMutationVariables>;

/**
 * __useAddLikeMutation__
 *
 * To run a mutation, you first call `useAddLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLikeMutation, { data, loading, error }] = useAddLikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useAddLikeMutation(baseOptions?: Apollo.MutationHookOptions<AddLikeMutation, AddLikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddLikeMutation, AddLikeMutationVariables>(AddLikeDocument, options);
      }
export type AddLikeMutationHookResult = ReturnType<typeof useAddLikeMutation>;
export type AddLikeMutationResult = Apollo.MutationResult<AddLikeMutation>;
export type AddLikeMutationOptions = Apollo.BaseMutationOptions<AddLikeMutation, AddLikeMutationVariables>;
export const NewLikeDocument = gql`
    subscription NewLike($postId: String!) {
  newLike(postId: $postId) {
    user {
      id
    }
  }
}
    `;

/**
 * __useNewLikeSubscription__
 *
 * To run a query within a React component, call `useNewLikeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewLikeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewLikeSubscription({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useNewLikeSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewLikeSubscription, NewLikeSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewLikeSubscription, NewLikeSubscriptionVariables>(NewLikeDocument, options);
      }
export type NewLikeSubscriptionHookResult = ReturnType<typeof useNewLikeSubscription>;
export type NewLikeSubscriptionResult = Apollo.SubscriptionResult<NewLikeSubscription>;
export const AddCommentDocument = gql`
    mutation AddComment($createCommentInput: CreateCommentInput!) {
  addComment(createCommentInput: $createCommentInput)
}
    `;
export type AddCommentMutationFn = Apollo.MutationFunction<AddCommentMutation, AddCommentMutationVariables>;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      createCommentInput: // value for 'createCommentInput'
 *   },
 * });
 */
export function useAddCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCommentMutation, AddCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, options);
      }
export type AddCommentMutationHookResult = ReturnType<typeof useAddCommentMutation>;
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>;
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<AddCommentMutation, AddCommentMutationVariables>;
export const NewCommentDocument = gql`
    subscription NewComment($postId: String!) {
  newComment(postId: $postId) {
    id
    txt
    created_at
    user {
      login
    }
  }
}
    `;

/**
 * __useNewCommentSubscription__
 *
 * To run a query within a React component, call `useNewCommentSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewCommentSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCommentSubscription({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useNewCommentSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewCommentSubscription, NewCommentSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewCommentSubscription, NewCommentSubscriptionVariables>(NewCommentDocument, options);
      }
export type NewCommentSubscriptionHookResult = ReturnType<typeof useNewCommentSubscription>;
export type NewCommentSubscriptionResult = Apollo.SubscriptionResult<NewCommentSubscription>;
export const GetUsersDocument = gql`
    query getUsers {
  getUsers {
    id
    login
    phone
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;