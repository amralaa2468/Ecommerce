import { createApolloClient } from "@/apollo/apolloClient";
import {
	getProducts,
	viewCart,
	addToCart,
	changeQuantity,
	removeFromCart,
} from "./new-category.queries";

export const getProductsApi = (
	storeId: string,
	search: string,
	categoryId: string | string[],
	locationId: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getProducts,
				variables: { storeId, search, categoryId, locationId },
			})
			.then(({ data }) => data.getProducts.list);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const viewCartApi = (customerId: string, storeId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: viewCart,
				variables: { customerId, storeId },
			})
			.then(({ data }) => data.viewCart);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const addToCartApi = (
	customerId: string,
	productId: string,
	variantId: string | null[],
	quantity: number,
	specialInstructions: string,
	locationId: string
) => {
	const apolloClient = createApolloClient();
	const validVariantIds =
		variantId === undefined
			? []
			: ((variantId as (string | null)[])
					.filter((el) => el !== null)
					.map((el) => `"${el}"`) as string[]);

	const escapedSpecialInstructions = specialInstructions.replace(
		/[\n\r]+/g,
		" "
	);

	try {
		const data = apolloClient
			.mutate({
				mutation: addToCart,
				variables: {
					customerId,
					productId,
					variantIds: validVariantIds,
					quantity,
					specialInstructions: escapedSpecialInstructions,
					locationId,
				},
			})
			.then(({ data }) => data);

		return data;
	} catch (error) {
		console.error(error);
	}
};

export const changeQuantityApi = (_id: string, quantity: number) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.mutate({
				mutation: changeQuantity,
				variables: { _id, quantity },
			})
			.then(({ data }) => data.changeQuantity);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const removeFromCartApi = (_id: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.mutate({
				mutation: removeFromCart,
				variables: { _id },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};
