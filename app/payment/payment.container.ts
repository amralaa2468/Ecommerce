import { createApolloClient } from "@/apollo/apolloClient";
import {
	getStates,
	getCountries,
	getCities,
	getTempOrderDetailsV2,
	linkOpened,
	updateTempOrderAddress,
	placeOrderFromTempV2,
} from "./payment.queries";

interface Payload {
	_id: string;
	stateId: string;
	cityId: string;
	countryId: string;
	block: string;
	street: string;
	avenue: string;
	houseNo: string;
	apartmentNo: string;
	floorNo: string;
	officeNo: string;
	specialDirection: string;
	postalCode: string;
	type: string;
	longitude: string;
	latitude: string;
}

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
			.then(({ data }) => data);
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
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const getTempOrderDetailsV2Api = (billNumber: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.query({
				query: getTempOrderDetailsV2,
				variables: { billNumber },
			})
			.then(({ data }) => data);
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

export const linkOpenedApi = (tempOrderId: string) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.mutate({
				mutation: linkOpened,
				variables: {
					tempOrderId,
				},
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const updateTempOrderAddressApi = (payload: Payload) => {
	const apolloClient = createApolloClient();
	try {
		const data = apolloClient
			.mutate({
				mutation: updateTempOrderAddress,
				variables: {
					_id: payload._id,
					stateId: payload.stateId ? payload.stateId : "",
					cityId: payload.cityId ? payload.cityId : "",
					countryId: payload.countryId,
					type: payload.type,
					specialDirection: payload.specialDirection,
					block: payload.block,
					street: payload.street,
					avenue: payload.avenue,
					houseNo: payload.houseNo,
					apartmentNo: payload.apartmentNo,
					officeNo: payload.officeNo,
					floorNo: payload.floorNo,
				},
			})
			.then(({ data }) => data);
		return data;
	} catch (err) {
		console.error(err);
	}
};
