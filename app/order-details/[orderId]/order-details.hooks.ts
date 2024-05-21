"use client";

import { useEffect, useState } from "react";
import { getOrderDetailsApi } from "./order-details.container";

interface orderDetails {
	orderId: string;
	orderType: string;
	orderTotal: number;
	expectedArrivingTime: string;
	paymentMethod: string;
	phoneNumber: string;
	deliveryStatus: string;
	addressInfo: {
		state: string;
		block: string;
		street: string;
		building: string;
	};
	productInfo: {
		quantity: number;
		productName: string;
		price: number;
	}[];
}

export const useOrderDetails = (orderId: string) => {
	const [orderDetails, setOrderDetails] = useState<orderDetails | null>(null);

	const getOrderDetails = async () => {
		try {
			const res = await getOrderDetailsApi(orderId);
			setOrderDetails(res);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getOrderDetails();
	}, [orderId]);

	return { orderDetails };
};
