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

export const getTempOrderDetailsV2 = gql`
	query getTempOrderDetailsV2($billNumber: String!) {
		getTempOrderDetailsV2(billNumber: $billNumber) {
			_id
			customerName
			orderTotal
			shippingCharge
			email
			phoneNumber
			needsDelivery
			orderPlacedAt
			orderInInstallments
			billNumber
			status
			dueDate
			referenceNumber
			allowEditByPayer
			partOfInstallmentsTotal
			invoiceLink
			discountValue
			discountType
			addressInfo {
				city
				cityId
				state
				stateId
				country
				block
				street
				avenue
				houseNo
				apartmentNo
				floorNo
				officeNo
				specialDirection
				postalCode
			}
			productInfo {
				productName
				price
				quantity
				image {
					url
					thumbnailUrl
				}
				variantsDetails {
					name
				}
			}
		}
	}
`;

export const updateTempOrderAddress = gql`
	mutation updateTempOrderAddress(
		$_id: String!
		$stateId: String!
		$cityId: String!
		$countryId: String!
		$block: String
		$street: String
		$avenue: String
		$houseNo: String
		$apartmentNo: String
		$floorNo: String
		$officeNo: String
		$specialDirection: String
		$postalCode: String
		$type: String!
		$longitude: String
		$latitude: String
	) {
		updateTempOrderAddress(
			_id: $_id
			stateId: $stateId
			cityId: $cityId
			countryId: $countryId
			block: $block
			street: $street
			avenue: $avenue
			houseNo: $houseNo
			apartmentNo: $apartmentNo
			floorNo: $floorNo
			officeNo: $officeNo
			specialDirection: $specialDirection
			postalCode: $postalCode
			type: $type
			longitude: $longitude
			latitude: $latitude
		) {
			shippingCharge
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

export const linkOpened = gql`
	mutation linkOpened($tempOrderId: String!) {
		linkOpened(tempOrderId: $tempOrderId) {
			message
		}
	}
`;
