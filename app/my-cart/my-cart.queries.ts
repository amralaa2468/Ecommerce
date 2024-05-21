import { gql } from "@apollo/client";

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

export const validateCartQuantities = gql`
	query validateCartQuantities(
		$customerId: String!
		$storeId: String!
		$locationId: String!
	) {
		validateCartQuantities(
			customerId: $customerId
			storeId: $storeId
			locationId: $locationId
		) {
			isValid
			locationId
		}
	}
`;

export const applyPromoV2 = gql`
	query applyPromoV2(
		$storeId: String!
		$couponCode: String!
		$customerId: String
		$locationId: String
	) {
		applyPromoV2(
			storeId: $storeId
			couponCode: $couponCode
			customerId: $customerId
			locationId: $locationId
		) {
			promoId
			list {
				_id
				productId
				brand
				productName
				isUnlimited
				quantityInStock
				productNameInArabic
				specialInstructions
				categoryIds
				description
				descriptionInArabic
				price
				quantity
				variantId
				variantIds
				priceVariant
				quantityInStockVariants
				priceAfterDiscount
			}
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
