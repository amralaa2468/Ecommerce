import { createApolloClient } from "../../apollo/apolloClient";
import {
  getStoreIdFromDomain,
  generateUUID,
  signUpLogin,
  viewCart,
  myOrders,
  landingPage,
} from "./storeData.queries";

export const getStoreIdFromDomainApi = (domain: string) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: getStoreIdFromDomain,
        variables: { domain },
      })
      .then(({ data }) => data.getStoreIdFromDomain.storeId);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const generateUUIDApi = () => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: generateUUID,
        variables: {},
      })
      .then(({ data }) => data.generateUUID.message);
    return data;
  } catch (err) {
    console.error(err);
  }
};

interface LoginData {
  language: string;
  deviceToken: string;
  storeId: string;
}

export const signUpLoginApi = (loginData: LoginData) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .mutate({
        mutation: signUpLogin,
        variables: { ...loginData },
      })
      .then(({ data }) => data.signUpLogin);
    return data;
  } catch (err) {
    console.error(err);
  }
};

interface ViewCartData {
  customerId: string;
  storeId: string;
}

export const viewCartApi = (viewCartData: ViewCartData) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: viewCart,
        variables: { ...viewCartData },
      })
      .then(({ data }) => data.viewCart);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const myOrdersApi = (viewCartData: ViewCartData) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: myOrders,
        variables: { ...viewCartData },
      })
      .then(({ data }) => data.myOrders.list);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const landingPageApi = (storeId: string) => {
  const apolloClient = createApolloClient();
  try {
    const data = apolloClient
      .query({
        query: landingPage,
        variables: { storeId },
      })
      .then(({ data }) => data.landingPage.list);
    return data;
  } catch (err) {
    console.error(err);
  }
};
