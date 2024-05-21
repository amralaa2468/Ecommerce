import { createApolloClient } from "@/apollo/apolloClient";
import {
	addToCart,
	getProductDetails,
	productVariantsPrice,
	viewCart,
} from "./product.queries";

export const addToCartApi = (
	customerId: string,
	productId: string,
	variantId: string | null[],
	quantity: number,
	specialInstructions: string,
	locationId: string
) => {
	const apolloClient = createApolloClient();
	// const validVariantIds =
	// 	variantId === undefined
	// 		? []
	// 		: ((variantId as (string | null)[])
	// 				.filter((el) => el !== null)
	// 				.map((el) => `"${el}"`) as string[]);

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
					variantIds: variantId,
					quantity,
					specialInstructions: escapedSpecialInstructions,
					locationId,
				},
			})
			.then(({ data }) => data.addToCart);

		return data;
	} catch (error) {
		console.error(error);
	}
};

export const getProductDetailsApi = (
	storeId: string,
	_id: string,
	locationId: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getProductDetails,
				variables: { storeId, _id, locationId },
			})
			.then(({ data }) => data.getProductDetails);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const productVariantsPriceApi = (
	storeId: string,
	productId: string,
	variantIds: string
) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: productVariantsPrice,
				variables: { storeId, productId, variantIds },
			})
			.then(({ data }) => data.productVariantsPrice);
		return data;
	} catch (err) {
		console.error(err);
	}
};
