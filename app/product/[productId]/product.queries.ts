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

export const getProductDetails = gql`
  query getProductDetails(
    $storeId: String!
    $_id: String!
    $locationId: String
  ) {
    getProductDetails(storeId: $storeId, _id: $_id, locationId: $locationId) {
      _id
      productName
      priceAfterDiscount
      productNameInArabic
      productVariants {
        name
        nameInArabic
        price
        parentName
        parentNameInArabic
        quantity
        _id
      }
      storeId
      isUnlimited
      quantity
      price
      maxPrice
      weight
      description
      descriptionInArabic
      image {
        url
      }
      variant {
        minVariants
        maxVariants
        link
        _id
        name
        nameInArabic
        type
        isQuantity
        isMandatory
        subOptions {
          price
          _id
          name
          nameInArabic
        }
      }
      discount {
        discountName
        discountValue
        discountType
      }
      similarProducts {
        _id
        productName
        price
        image {
          url
        }
      }
      productYouMayLike {
        _id
        productName
        image {
          url
          thumbnailUrl
        }
        price
      }
      categories {
        _id
        name
        nameInArabic
        image
        parentId
        type
      }
    }
  }
`;

export const productVariantsPrice = gql`
  query productVariantsPrice(
    $storeId: String
    $productId: String
    $variantIds: [String]
  ) {
    productVariantsPrice(
      storeId: $storeId
      productId: $productId
      variantIds: $variantIds
    ) {
      price
      priceAfterDiscount
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
