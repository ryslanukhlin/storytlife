import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    ApolloLink,
    split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { PropsWithChildren } from 'react';
import { createClient } from 'graphql-ws';
import { authToken } from './store/auth';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const wsLink =
    typeof window !== 'undefined'
        ? new GraphQLWsLink(
              createClient({
                  url: 'ws://localhost:5000/graphql',
              }),
          )
        : null;

const splitLink =
    typeof window !== 'undefined' && wsLink !== null
        ? split(
              ({ query }) => {
                  const definition = getMainDefinition(query);
                  return (
                      definition.kind === 'OperationDefinition' &&
                      definition.operation === 'subscription'
                  );
              },
              wsLink,
              httpLink,
          )
        : httpLink;

const authLink = new ApolloLink((operation, forward) => {
    const token =
        typeof localStorage !== 'undefined'
            ? localStorage.getItem('auth_token') || authToken()
            : authToken();

    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        },
    });

    return forward(operation);
});

const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
    queryDeduplication: true,
});

const ClientApolloProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ClientApolloProvider;
