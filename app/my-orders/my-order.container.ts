import { createApolloClient } from '@/apollo/apolloClient';
import { reorder, getOrderTotalPrice } from './my-order.queries';

export const getOrderTotalPriceApi = (orderId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getOrderTotalPrice,
				variables: { orderId },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const reorderApi = (
	orderId: string,
	orderTotal: number,
	paymentMethod: string,
	shippingCharge: number
) => {
	const apolloClient = createApolloClient();

	try {
		const data = apolloClient
			.mutate({
				mutation: reorder,
				variables: {
					orderId,
					orderTotal,
					paymentMethod,
					shippingCharge,
				},
			})
			.then(({ data }) => data);

		return data;
	} catch (error) {
		console.error(error);
	}
};
