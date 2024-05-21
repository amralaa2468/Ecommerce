import { createApolloClient } from "@/apollo/apolloClient";

import {
	addToCart,
	validateCartQuantities,
	applyPromoV2,
	changeQuantity,
	removeFromCart,
} from "./my-cart.queries";

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

export const validateCartQuantitiesApi = (
	customerId: string,
	storeId: string,
	locationId: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: validateCartQuantities,
				variables: { customerId, storeId, locationId },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const applyPromoV2Api = (
	storeId: string,
	couponCode: string,
	customerId: string,
	locationId: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: applyPromoV2,
				variables: { storeId, couponCode, customerId, locationId },
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
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
