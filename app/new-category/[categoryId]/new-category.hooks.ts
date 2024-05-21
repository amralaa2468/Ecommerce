"use client";

import { useEffect, useState } from "react";
import { getProductsApi } from "./new-category.container";

interface productList {
	_id: string;
	image: {
		url: string;
		thumbnailUrl: string;
	}[];
	productName: string;
	priceAfterDiscount: number;
	price: number;
	isUnlimited: boolean;
	quantity: number;
	variantsCount: number;
}

export const useNewCategory = (categoryId: string | string[]) => {
	const [productList, setProductList] = useState<productList[]>([]);
	const [loading, setLoading] = useState(true);

	const getProducts = async () => {
		try {
			const productsRes = await getProductsApi(
				global?.localStorage?.getItem("StoreId") ?? "",
				"",
				categoryId,
				global?.localStorage?.getItem("locationId") ?? ""
			);

			setProductList(productsRes);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getProducts();
	}, [categoryId]);

	return { productList, loading };
};
