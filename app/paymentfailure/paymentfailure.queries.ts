import { gql } from "@apollo/client";

export const getOrderDetailsByPaymentReference = gql`
	query getOrderDetailsByPaymentReference($paymentReference: String!) {
		getOrderDetailsByPaymentReference(paymentReference: $paymentReference) {
			_id
			customerName
			orderTotal
			orderId
			orderPlacedAt
			orderType
			pickupCarrierInfo{
        carBrand
        carColor
        carPlate
      }
			discountType
			discountValue
			invoiceLink
			link
			shippingCharge
			email
			phoneNumber
			status
			deliveryStatusTime
			expectedArrivingTime
			paymentMethod
			billNumber
			referenceNumber
			orderLocationPhoneNumber
			grandTotal
			addressInfo {
				city
				state
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
				image {
					url
				}
				specialInstructions
				productName
				quantity
				price
				variantsDetails {
					name
				}
			}
		}
	}
`;
