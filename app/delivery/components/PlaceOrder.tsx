/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "../style.css";
import { BackSvg } from "@/public/assets/svgs/searchSvg";
import { Pickup } from "./Pickup";
import { useSelector } from "react-redux";
import { Delivery } from "./Delivery";
import { CustomerInfo } from "./CustomerInfo";
import { RootState } from "@/redux/store";
import { viewCartApi } from "@/components/StoreData/storeData.container";

const PlaceOrder = ({
	onClose,
	cartListPromo,
	promoId,
	specialMarks,
	gift,
	isGift,
	totalQuantity,
	retry,
}: any) => {
	const orderType = localStorage.getItem("orderType") || "normal";
	const [data, setData] = useState();
	const [customerData, setCustomerData] = useState();
	const [showAddress, setShowAddress] = useState(
		retry === "true" ? true : false
	);
	const { _id, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	useEffect(() => {
		const getData = async () => {
			const res = await viewCartApi({
				customerId: _id,
				storeId: global?.localStorage?.getItem("StoreId")!,
			});
			setData(res);
		};
		getData();
	}, []);

	return (
		<div
			className="place-layout"
			style={{ color: secondrythemeColourCode }}>
			<div className="place-header-container">
				<div
					style={{ cursor: "pointer" }}
					onClick={onClose}>
					<BackSvg />
				</div>
			</div>

			{!showAddress && (
				<CustomerInfo
					cartData={data}
					onSave={(payload: any) => {
						setCustomerData(payload);
						setShowAddress(true);
					}}
				/>
			)}

			{orderType === "pickup" && showAddress && (
				<Pickup
					cartData={data}
					cartListPromo={cartListPromo}
					promoId={promoId}
					isGift={isGift}
					gift={gift}
					specialMarks={specialMarks}
					showInfo={() => setShowAddress(false)}
					totalQuantity={totalQuantity}
					customerData={customerData}
					retry={retry}
				/>
			)}
			{orderType === "normal" && showAddress && (
				<Delivery
					cartData={data}
					cartListPromo={cartListPromo}
					promoId={promoId}
					isGift={isGift}
					gift={gift}
					specialMarks={specialMarks}
					showInfo={() => setShowAddress(false)}
					totalQuantity={totalQuantity}
					customerData={customerData}
					retry={retry}
				/>
			)}
		</div>
	);
};

export default PlaceOrder;
