import { gql } from "@apollo/client";

export const getStoreIdFromDomain = gql`
  query getStoreIdFromDomain($domain: String!) {
    getStoreIdFromDomain(domain: $domain) {
      storeId
    }
  }
`;

export const generateUUID = gql`
  query generateUUID {
    generateUUID {
      message
    }
  }
`;

export const signUpLogin = gql`
  mutation signUpLogin(
    $language: String!
    $deviceToken: String!
    $storeId: String!
  ) {
    signUpLogin(
      language: $language
      deviceToken: $deviceToken
      storeId: $storeId
    ) {
      _id
      mashkoorBranchId
      enableMashkoor
      internationalShippingCompany
      language
      isMobileVerified
      countryCode
      phoneNumber
      wishlistCount
      cartCount
      policies
      aboutUs
      policiesInArabic
      aboutUsInArabic
      instagram
      twitter
      whatsapp
      snapchat
      logo
      productLayout
      mobileProductLayout
      enableCashOnDelivery
      enableKnetPayment
      enableCreditPayment
      banner
      bannerSecond
      storeName
      storeNameInArabic
      email
      name
      themeId
      themeLayout
      primaryThemeColourCode
      secondrythemeColourCode
      headerColourCode
      footerColourCode
      highlight
      highlightStatus
      highlightColourCode
      backgroundColourCode
      googleAnalytics
      avgPreparationUnit
      avgPreparation
      seo {
        slug
        metaTittle
        metaDescription
        canonical
        ogUrl
        ogType
        ogSiteName
      }
      storeLocation {
        _id
        storeName
        block
        street
      }
      fontFamily
      isLunched
      isBlocked
      storeIsBlocked
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

export const myOrders = gql`
  query myOrders($storeId: String!, $customerId: String!) {
    myOrders(storeId: $storeId, customerId: $customerId) {
      list {
        _id
        customerName
        orderTotal
        orderId
        orderPlacedAt
        orderType
        shippingCharge
        email
        phoneNumber
        status
        paymentMethod
        deliveryStatusTime
        expectedArrivingTime
        addressInfo {
          _id
          city
          state
          country
          block
          street
          avenue
          houseNo
          floorNo
          officeNo
          apartmentNo
          specialDirection
          postalCode
          type
        }
        deliveryStatus
        productInfo {
          productName
          productNameInArabic
          image {
            url
            thumbnailUrl
          }
          variantName
          quantity
          price
        }
      }
    }
  }
`;

export const landingPage = gql`
  query landingPage($storeId: String!) {
    landingPage(storeId: $storeId) {
      list {
        _id
        name
        nameInArabic
        image
        orderInView
        subCategories {
          _id
          name
          nameInArabic
          image
        }
        products {
          options {
            isMandatory
          }
          _id
          variantsCount
          productName
          productNameInArabic
          storeId
          quantity
          weight
          price
          priceAfterDiscount
          description
          descriptionInArabic
          image {
            url
            thumbnailUrl
          }
        }
      }
    }
  }
`;
