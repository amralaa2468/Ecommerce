import { gql } from '@apollo/client';

export const getOrderTotalPrice = gql`
	query getOrderTotalPrice($orderId: String!) {
		getOrderTotalPrice(orderId: $orderId)
	}
`;

export const reorder = gql`
	mutation reorder(
		$orderId: String!
		$orderTotal: Float!
		$paymentMethod: String!
		$shippingCharge: Float!
	) {
		reorder(
			orderId: $orderId
			orderTotal: $orderTotal
			paymentMethod: $paymentMethod
			shippingCharge: $shippingCharge
		) {
			paymentLink
			orderId
			_id
		}
	}
`;
