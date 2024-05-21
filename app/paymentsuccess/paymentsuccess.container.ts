import { createApolloClient } from "@/apollo/apolloClient";
import { getOrderDetailsByPaymentReference } from "./paymentsuccess.queries";

export const getOrderDetailsByPaymentReferenceApi = (
	paymentReference: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getOrderDetailsByPaymentReference,
				variables: { paymentReference },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};
