import { gql } from "@apollo/client";

export const getOrderDetails = gql`
	query getOrderDetails($_id: String!) {
		getOrderDetails(_id: $_id) {
			orderType
			orderId
			orderTotal
			phoneNumber
			paymentMethod
			expectedArrivingTime
			deliveryStatus
			addressInfo {
				_id
				city
				state
				country
				block
				street
				avenue
				houseNo
				specialDirection
				postalCode
				type
			}
			productInfo {
				productName
				productNameInArabic
				description
				descriptionInArabic
				image {
					url
					thumbnailUrl
				}
				quantity
				price
				variantName
			}
		}
	}
`;

export const customerArrivedNotification = gql`
	mutation customerArrivedNotification($orderId: String!) {
		customerArrivedNotification(orderId: $orderId) {
			message
		}
	}
`;
