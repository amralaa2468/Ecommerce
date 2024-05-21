import { createApolloClient } from "../../apollo/apolloClient";
import {
	getCountries,
	getSpecifiedCities,
	getStateIdToLocationId,
	getStorePickupLocations,
} from "./new-delivery.queries";

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
