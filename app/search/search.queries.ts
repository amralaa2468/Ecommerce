import { gql } from "@apollo/client";

export const getProducts = gql`
	query getProducts(
		$storeId: String!
		$search: String
		$categoryId: String
		$locationId: String
	) {
		getProducts(
			storeId: $storeId
			search: $search
			categoryId: $categoryId
			locationId: $locationId
		) {
			list {
				_id
				variantsCount
				variantsInfo {
					_id
					name
				}
				quantityVariants
				isUnlimited
				productName
				productNameInArabic
				storeId
				quantity
				price
				priceAfterDiscount
				weight
				description
				image {
					url
					thumbnailUrl
				}
			}
		}
	}
`;

export const addToCart = gql`
	mutation addToCart(
		$customerId: String!
		$productId: String!
		$variantIds: [String]!
		$quantity: Int!
		$specialInstructions: String!
		$locationId: String!
	) {
		addToCart(
			customerId: $customerId
			productId: $productId
			variantIds: $variantIds
			quantity: $quantity
			specialInstructions: $specialInstructions
			locationId: $locationId
		) {
			message
		}
	}
`;

export const changeQuantity = gql`
	mutation changeQuantity($_id: String!, $quantity: Int!) {
		changeQuantity(_id: $_id, quantity: $quantity) {
			message
		}
	}
`;

export const removeFromCart = gql`
	mutation removeFromCart($_id: String!) {
		removeFromCart(_id: $_id) {
			message
		}
	}
`;
