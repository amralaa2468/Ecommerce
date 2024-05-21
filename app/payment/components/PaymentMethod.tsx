"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";

import { getCountriesApi, getCitiesApi } from "../payment.container";

import { AddAddress } from "./AddAddress";
import PlaceOrder from "./PlaceOrder";

import { EcomLogoSvg } from "@/public/assets/svgs/ecomLogoSvg";
import "../style.css";

interface customerDetails {
	productInfo: string;
	_id: string;
	billNumber: string;
	orderPlacedAt: string;
	discountType: string;
	discountValue: number;
	customerName: string;
	phoneNumber: string;
	needsDelivery: boolean;
	orderTotal: string;
	shippingCharge: number;
}

interface PaymentMethodProps {
	selectedInstall: customerDetails;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedInstall }) => {
	const { logo, storeName } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);
	const [openAddress, setOpenAddress] = useState(false);
	const [openOrder, setOpenOrder] = useState(false);
	const [customerDetails, setCustomerDetails] =
		useState<customerDetails>(selectedInstall);
	const [cityList, setCityList] = useState([]);
	const [countryId, setCountryId] = useState("");

	useEffect(() => {
		const getCountriesAndCities = async () => {
			try {
				if (selectedInstall?.needsDelivery) {
					const coutnryRes = await getCountriesApi("");
					setCountryId(coutnryRes.getCountries[0]._id);

					const cityRes = await getCitiesApi(
						"",
						coutnryRes.getCountries[0]._id,
						global?.localStorage?.getItem("StoreId")!
					);
					setCityList(
						cityRes.getCities.filter(
							(city: { nameInArabic: string }) => city.nameInArabic !== null
						)
					);
				}
				setCustomerDetails(selectedInstall);
			} catch (error) {
				console.log(error);
			}
		};

		getCountriesAndCities();
	}, [selectedInstall]);

	const handleOpenAddress = () => {
		setOpenAddress(!openAddress);
	};

	const handleOpenOrder = () => {
		setOpenOrder(!openOrder);
	};

	return (
		<div className={`payment-layout ${openAddress ? "bg-white" : ""}`}>
			{!openAddress ? (
				<div className="w-full h-full pt-[30px] pb-[50px]">
					<div className="flex justify-between items-center py-0 px-[15px] my-0 mx-auto mb-[68px] max-w-[667px]">
						<p className="payment-bill-no">Bill {customerDetails?.billNumber}</p>
						<p className="payment-bill-no">
							{moment(parseInt(customerDetails?.orderPlacedAt)).format("DD/MM/YYYY")}
						</p>
					</div>

					<div className="payment-container">
						<img
							src={logo}
							alt="store-logo"
							className="w-[118px] h-[118px] rounded-full"
						/>
						<p className="payment-store-name">{storeName}</p>
						<p className="payment-total-price">KD{customerDetails?.orderTotal}</p>
						<p className="payment-date">
							Due on{" "}
							{moment(parseInt(customerDetails?.orderPlacedAt)).format(
								"dddd MMM DD, YYYY"
							)}
						</p>
					</div>

					<div className="max-w-[525px] w-[95%] my-0 mx-auto mb-[82px] flex flex-col gap-5">
						<div className="flex items-center justify-between pb-3.5 border-b border-[#979797] w-full">
							<p className="payment-prices">Subtotal</p>
							<p className="payment-prices">KD {customerDetails?.orderTotal}</p>
						</div>

						{selectedInstall?.needsDelivery && (
							<div className="flex items-center justify-between pb-3.5 w-full">
								<p className="payment-prices">Delivery fees</p>
								<p className="payment-prices">KD {customerDetails?.shippingCharge}</p>
							</div>
						)}

						{customerDetails?.discountValue && (
							<div className="flex items-center justify-between pb-3.5 border-b border-[#979797] w-full">
								<p className="payment-prices">Discount</p>
								<p
									className="payment-prices"
									style={{ color: "#5FC123" }}>
									{customerDetails?.discountType === "amount" ? "-KD " : "-% "}{" "}
									{customerDetails?.discountValue}
								</p>
							</div>
						)}

						<div className="flex items-center justify-between w-full">
							<p className="payment-prices">Total</p>
							<p className="payment-prices">
								KD {customerDetails?.orderTotal + customerDetails?.shippingCharge}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-5 items-center justify-center">
						<p
							className="payment-bill-no"
							style={{ fontSize: 16, fontWeight: 400 }}>
							Billed to name
						</p>
						<p
							className="payment-bill-no"
							style={{ fontSize: 16, fontWeight: 400 }}>
							{customerDetails?.customerName}
						</p>
						<p
							className="payment-bill-no"
							style={{ fontSize: 16, fontWeight: 400 }}>
							{customerDetails?.phoneNumber}
						</p>
					</div>

					{customerDetails?.needsDelivery ? (
						<p
							className="payment-button"
							onClick={handleOpenAddress}>
							Add Address
						</p>
					) : (
						<p
							className="payment-button"
							onClick={handleOpenOrder}>
							Pay {customerDetails?.orderTotal + customerDetails?.shippingCharge}
						</p>
					)}

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 4,
						}}>
						<p className="payment-powered">Powered by</p>
						<EcomLogoSvg />
					</div>
				</div>
			) : (
				<AddAddress
					onClose={handleOpenAddress}
					cityList={cityList}
					details={customerDetails}
					countryId={countryId}
					onSave={(price) => {
						setOpenAddress(!openAddress);
						setCustomerDetails({
							...customerDetails,
							shippingCharge: price,
							needsDelivery: false,
						});
					}}
				/>
			)}
			{openOrder && (
				<PlaceOrder
					onClose={handleOpenOrder}
					customerDetails={customerDetails}
				/>
			)}
		</div>
	);
};

export default PaymentMethod;
