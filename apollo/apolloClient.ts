import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const createAuthLink = (token: string | null) =>
	setContext(async (_, { headers }) => {
		return {
			headers: {
				...headers,
				accessToken: token ? `Bearer ${token}` : '',
			},
		};
	});

const authMiddleware = (token: string | null) => {
	const authLink = createAuthLink(token);
	return authLink;
};

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_URL,
});

const errorLink = onError(({ response, graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		if (!response || !response.data) {
			graphQLErrors?.forEach((error) => {
				switch (error.extensions.code) {
					case 'BAD_USER_INPUT':
						return error;
				}
			});
		}
	}
});

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
	const splitLink = authMiddleware(null).concat(errorLink).concat(httpLink);
	return new ApolloClient({
		defaultOptions: {
			query: {
				errorPolicy: 'all',
			},
			mutate: {
				errorPolicy: 'all',
			},
		},
		link: splitLink,
		cache: new InMemoryCache({
			addTypename: false,
		}),
	});
};
