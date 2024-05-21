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

export const viewCart = gql`
	query viewCart($customerId: String!, $storeId: String!) {
		viewCart(customerId: $customerId, storeId: $storeId) {
			customerDetails {
				name
				email
				phoneNumber
			}
			addressDetails {
				_id
				city
				state
				country
				cityId
				stateId
				countryId
				block
				street
				avenue
				specialDirection
				houseNo
				postalCode
				type
			}
			list {
				variantsDetails {
					quantity
					name
					nameInArabic
					price
				}
				isUnlimited
				priceVariant
				quantityInStockVariants
				_id
				productId
				brand
				productName
				productNameInArabic
				specialInstructions
				description
				descriptionInArabic
				price
				priceAfterDiscount
				categoryIds
				quantityInStock
				quantity
				image {
					url
					thumbnailUrl
				}
				discount {
					discountType
					discountValue
					minPurchase
				}
				variantIds
			}
			storeDeliveryDetails {
				avgPreparation
				avgPreparationUnit
				pickupOrder
				minimumOrder
				minimumOrderAmount
				enableOrderTrackingForCustomers
				costOfDelivery
				enableOwnDelivery
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
