"use client";

import { useEffect, useState } from "react";
import { viewCartApi } from "@/components/StoreData/storeData.container";

export const useMyCart = (_id: string) => {
	const [minimumOrderAmount, setMinimumOrderAmount] = useState(0);

	useEffect(() => {
		const viewCart = async () => {
			try {
				const res = await viewCartApi({
					customerId: _id,
					storeId: global?.localStorage?.getItem("StoreId")!,
				});

				setMinimumOrderAmount(res.storeDeliveryDetails.minimumOrderAmount);
			} catch (error) {
				console.log(error);
			}
		};
		if (_id) {
			viewCart();
		}
	}, [_id]);

	return { minimumOrderAmount };
};
