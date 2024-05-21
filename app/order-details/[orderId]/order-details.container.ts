import { createApolloClient } from "@/apollo/apolloClient";
import {
	getOrderDetails,
	customerArrivedNotification,
} from "./order-details.queries";

export const getOrderDetailsApi = (_id: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getOrderDetails,
				variables: { _id },
			})
			.then(({ data }) => data.getOrderDetails);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const customerArrivedNotificationApi = (orderId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.mutate({
				mutation: customerArrivedNotification,
				variables: { orderId },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};
