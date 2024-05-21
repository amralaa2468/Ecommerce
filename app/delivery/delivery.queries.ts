import { gql } from "@apollo/client";

export const getStates = gql`
	query getStates($search: String, $cityId: String!, $storeId: String!) {
		getStates(search: $search, cityId: $cityId, storeId: $storeId) {
			_id
			name
			nameInArabic
		}
	}
`;

export const getShippingFee = gql`
	query getShippingFee($storeId: String!, $stateId: String!) {
		getShippingFee(storeId: $storeId, stateId: $stateId) {
			_id
			cost
			city
			state {
				id
				name
			}
		}
	}
`;

export const estimateDeliveryFee = gql`
	query estimateDeliveryFee($storeId: String!, $customerId: String!) {
		estimateDeliveryFee(storeId: $storeId, customerId: $customerId) {
			vendor_delivery_fee
			service_delivery_fee
		}
	}
`;

export const deliveryAddress = gql`
	mutation deliveryAddress(
		$_id: String!
		$stateId: String!
		$cityId: String!
		$countryId: String!
		$type: String!
		$block: String
		$street: String
		$avenue: String
		$houseNo: String
		$apartmentNo: String
		$floorNo: String
		$officeNo: String
		$specialDirection: String
		$postalCode: String
		$longitude: String
		$latitude: String
	) {
		deliveryAddress(
			_id: $_id
			stateId: $stateId
			cityId: $cityId
			countryId: $countryId
			type: $type
			block: $block
			street: $street
			avenue: $avenue
			houseNo: $houseNo
			apartmentNo: $apartmentNo
			floorNo: $floorNo
			officeNo: $officeNo
			specialDirection: $specialDirection
			postalCode: $postalCode
			longitude: $longitude
			latitude: $latitude
		) {
			_id
			city
			country
			state
			block
			street
			avenue
			houseNo
			specialDirection
			postalCode
			type
		}
	}
`;

export const personalDetails = gql`
	mutation personalDetails(
		$_id: String!
		$phoneNumber: String!
		$email: String
		$name: String!
	) {
		personalDetails(
			_id: $_id
			phoneNumber: $phoneNumber
			email: $email
			name: $name
		) {
			countryCode
			phoneNumber
			country
			deviceToken
			email
			name
			language
		}
	}
`;

export const placeOrder = gql`
	mutation placeOrder(
		$storeId: String!
		$customerId: String!
		$addressId: String!
		$orderTotal: Float!
		$shippingCharge: Float!
		$paymentMethod: String!
		$expectedTime: Int!
		$expectedTimeUnit: String!
		$orderType: String
		$promoId: String
		$internationalDeliveryType: String
		$orderDetails: [OrderDetailsInput]
		$locationId: String
		$isGift: Boolean
		$giftMessage: String
		$specialRemarks: String
		$pickupCarrierInfo: PickupCarrierInfoInput
	) {
		placeOrder(
			storeId: $storeId
			customerId: $customerId
			addressId: $addressId
			orderTotal: $orderTotal
			shippingCharge: $shippingCharge
			paymentMethod: $paymentMethod
			expectedTime: $expectedTime
			expectedTimeUnit: $expectedTimeUnit
			orderType: $orderType
			promoId: $promoId
			internationalDeliveryType: $internationalDeliveryType
			orderDetails: $orderDetails
			locationId: $locationId
			isGift: $isGift
			giftMessage: $giftMessage
			specialRemarks: $specialRemarks
			pickupCarrierInfo: $pickupCarrierInfo
		) {
			orderId
			_id
			paymentLink
		}
	}
`;

export const placeOrderFromTempV2 = gql`
	mutation placeOrderFromTempV2(
		$tempOrderId: String!
		$paymentMethod: String!
		$amount: Float
	) {
		placeOrderFromTempV2(
			tempOrderId: $tempOrderId
			paymentMethod: $paymentMethod
			amount: $amount
		) {
			paymentLink
		}
	}
`;

export const getCountries = gql`
	query getCountries($search: String) {
		getCountries(search: $search) {
			_id
			name
			nameInArabic
		}
	}
`;

export const getCities = gql`
	query getCities($search: String, $countryId: String!, $storeId: String!) {
		getCities(search: $search, countryId: $countryId, storeId: $storeId) {
			_id
			name
			nameInArabic
		}
	}
`;
