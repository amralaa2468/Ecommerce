import { createApolloClient } from "../../apollo/apolloClient";
import {
	deliveryAddress,
	getCountries,
	getSpecifiedCities,
	getStateIdToLocationId,
	getStorePickupLocations,
	viewCart,
} from "./new-delivery.queries";

export const viewCartApi = (customerId: string, storeId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: viewCart,
				variables: { customerId, storeId },
			})
			.then(({ data }) => data.viewCart);
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
      .then(({ data }) => data);
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

export const getSpecifiedCitiesApi = (countryId: string, storeId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getSpecifiedCities,
				variables: { countryId, storeId },
			})
			.then(({ data }) => data.getSpecifiedCities);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const getStateIdToLocationIdApi = (storeId: string, stateId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getStateIdToLocationId,
				variables: { storeId, stateId },
			})
			.then(({ data }) => data.stateIdToLocationId.message);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const getStorePickupLocationsApi = (storeId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getStorePickupLocations,
				variables: { storeId },
			})
			.then(({ data }) => data.getStorePickupLocations);
		return data;
	} catch (err) {
		console.error(err);
	}
};
