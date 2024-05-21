"use client";

import { useEffect, useState } from "react";
import {
	getCountriesApi,
	getSpecifiedCitiesApi,
	getStorePickupLocationsApi,
} from "./new-delivery.container";

interface LocationList {
	_id: string;
	storeName: string;
}

interface StateInfo {
	_id: string;
	name: string;
	nameInArabic: string;
}

interface CityList {
	_id: string;
	name: string;
	nameInArabic: string;
	stateInfo: StateInfo[];
}

export const useDelivery = () => {
	const [cityList, setCityList] = useState<CityList[]>([]);
	const [locationList, setLocationList] = useState<LocationList[]>([]);

	const getDelivery = async () => {
		try {
			const locationsRes = await getStorePickupLocationsApi(
				global?.localStorage?.getItem("StoreId") ?? ""
			);
			const countriesRes = await getCountriesApi("Kuwait");
			const cities = await getSpecifiedCitiesApi(
				countriesRes[0]._id,
				global?.localStorage?.getItem("StoreId") ?? ""
			);

			setCityList(cities.filter((item: any) => item.nameInArabic !== null));
			setLocationList(locationsRes);
		} catch {}
	};

	useEffect(() => {
		getDelivery();
	}, []);

	return { locationList, cityList };
};
