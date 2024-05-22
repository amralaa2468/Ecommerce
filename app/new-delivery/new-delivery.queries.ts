import { gql } from "@apollo/client";

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
        cityInArabic
        countryInArabic
        stateInArabic
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

export const getCountries = gql`
  query getCountries($search: String) {
    getCountries(search: $search) {
      _id
      name
      nameInArabic
    }
  }
`;

export const getSpecifiedCities = gql`
  query getSpecifiedCities($countryId: String!, $storeId: String!) {
    getSpecifiedCities(countryId: $countryId, storeId: $storeId) {
      _id
      name
      nameInArabic
      stateInfo {
        _id
        name
        nameInArabic
      }
    }
  }
`;

export const getStorePickupLocations = gql`
  query getStorePickupLocations($storeId: String!) {
    getStorePickupLocations(storeId: $storeId) {
      _id
      storeName
      countryId
      cityId
      stateId
      block
      street
      avenue
      building
      deliverToStateIds
      type
      phoneNumber
      additionalDetails
    }
  }
`;

export const getStateIdToLocationId = gql`
  query stateIdToLocationId($storeId: String!, $stateId: String!) {
    stateIdToLocationId(storeId: $storeId, stateId: $stateId) {
      message
    }
  }
`;
