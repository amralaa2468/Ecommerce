import { createApolloClient } from "@/apollo/apolloClient";
import {
  getStates,
  getShippingFee,
  estimateDeliveryFee,
  deliveryAddress,
  personalDetails,
  placeOrder,
  placeOrderFromTempV2,
  getCities,
  getCountries,
} from "./delivery.queries";

export const getStatesApi = (
  search: string,
  cityId: string,
  storeId: string
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: getStates,
        variables: { search, cityId, storeId },
      })
      .then(({ data }) => data.getStates);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getShippingFeeApi = (storeId: string, stateId: string) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: getShippingFee,
        variables: { storeId, stateId },
      })
      .then(({ data }) => data.getShippingFee);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const estimateDeliveryFeeApi = (storeId: string, customerId: string) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: estimateDeliveryFee,
        variables: { storeId, customerId },
      })
      .then(({ data }) => data.estimateDeliveryFee);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const deliveryAddressApi = (
  _id: string,
  stateId: string,
  cityId: string,
  countryId: string,
  type: string,
  block: string,
  street: string,
  avenue: string,
  houseNo: string,
  apartmentNo: string,
  floorNo: string,
  officeNo: string,
  specialDirection: string,
  postalCode: string,
  longitude: string,
  latitude: string
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .mutate({
        mutation: deliveryAddress,
        variables: {
          _id,
          stateId,
          cityId,
          countryId,
          type,
          block,
          street,
          avenue,
          houseNo,
          apartmentNo,
          floorNo,
          officeNo,
          specialDirection,
          postalCode,
          longitude,
          latitude,
        },
      })
      .then(({ data }) => data.deliveryAddress);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const personalDetailsApi = (
  _id: string,
  phoneNumber: string,
  email: string,
  name: string
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .mutate({
        mutation: personalDetails,
        variables: {
          _id,
          phoneNumber,
          email,
          name,
        },
      })
      .then(({ data }) => data.personalDetails);
    return data;
  } catch (err) {
    console.error(err);
  }
};

const orderDetailString = (
  orderDetails: {
    productId: string;
    specialInstructions: string;
    quantity: number;
    price: number;
    variantId: string;
    discountId: string;
    variantIds: string[];
  }[],
  locationId: string
) => {
  let orderString: any;

  orderString = orderDetails?.map((item: any) => {
    if (item.variantId && item.discountId) {
      return {
        productId: item.productId,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        price: item.price,
        variantId: item.variantId,
        discountId: item.discountId,
        variantIds: item.variantIds,
        locationId: locationId,
      };
    } else if (item.discountId) {
      return {
        productId: item.productId,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        price: item.price,
        discountId: item.discountId,
        variantIds: item.variantIds,
        locationId: locationId,
      };
    } else if (item.variantId) {
      return {
        productId: item.productId,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        price: item.price,
        variantId: item.variantId,
        variantIds: item.variantIds,
        locationId: locationId,
      };
    } else {
      return {
        productId: item.productId,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        price: item.price,
        variantIds: item.variantIds,
        locationId: locationId,
      };
    }
  });

  return orderString;
};

type OrderDetailsInput = {
  discountId: string;
  locationId: string;
  price: number;
  productId: string;
  quantity: number;
  specialInstructions: string;
  variantId: string;
  variantIds: string[];
};

export const placeOrderApi = (
  storeId: string,
  customerId: string,
  addressId: string,
  orderTotal: number,
  shippingCharge: number,
  paymentMethod: string,
  expectedTime: number,
  expectedTimeUnit: string,
  orderType: string,
  promoId: string,
  internationalDeliveryType: string,
  orderDetails: OrderDetailsInput[],
  locationId: string,
  isGift: Boolean,
  giftMessage: string,
  specialRemarks: string,
  carMake: string,
  carType: string,
  plateColor: string
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .mutate({
        mutation: placeOrder,
        variables: {
          storeId,
          customerId,
          addressId,
          orderTotal,
          shippingCharge,
          paymentMethod,
          expectedTime,
          expectedTimeUnit,
          orderType,
          promoId,
          internationalDeliveryType,
          orderDetails: orderDetailString(orderDetails, locationId),
          locationId,
          isGift,
          giftMessage,
          specialRemarks,
          pickupCarrierInfo: { carBrand: carType, carColor: plateColor, carPlate: carMake },
        },
      })
      .then(({ data }) => data.placeOrder);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const placeOrderFromTempV2Api = (
  tempOrderId: string,
  paymentMethod: string,
  amount: number
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .mutate({
        mutation: placeOrderFromTempV2,
        variables: {
          tempOrderId,
          paymentMethod,
          amount,
        },
      })
      .then(({ data }) => data.placeOrderFromTempV2);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getCitiesApi = (
  search: string,
  countryId: string,
  storeId: string
) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: getCities,
        variables: { search, countryId, storeId },
      })
      .then(({ data }) => data.getCities);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getCountriesApi = (search: string) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: getCountries,
        variables: { search },
      })
      .then(({ data }) => data.getCountries);
    return data;
  } catch (err) {
    console.error(err);
  }
};
