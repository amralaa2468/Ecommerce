"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

import { PaymentMenu } from "./PaymentMenu";

// import { Switch } from "@material-ui/core";
import bikeImg from "@/public/assets/svgs/images/bike.png";
import addressImg from "@/public/assets/svgs/images/address.png";
import contactImg from "@/public/assets/svgs/images/cantact.png";
import { EditAddSvg } from "@/public/assets/svgs/placeOrderSvg";
import { GiftSvg } from "@/public/assets/svgs/cartSvg";
import "../../order-details/[orderId]/style.css";
import "../style.css";
import Switch from '@mui/material/Switch';

interface PickupProps {
	cartData: any;
	cartListPromo: any;
	promoId: string;
	gift: string;
	specialMarks: string;
	isGift: boolean;
	showInfo: () => void;
	totalQuantity: number;
	customerData: any;
	retry: string;
}

export const Pickup: React.FC<PickupProps> = ({
	cartData,
	cartListPromo,
	promoId,
	gift,
	specialMarks,
	isGift,
	showInfo,
	totalQuantity,
	customerData,
	retry,
}) => {
	const { t } = useTranslation();
	const [totalPrice, setTotalPrice] = useState(0);
	const [carBrand, setCarBrand] = useState("");
	const [carColor, setCarColor] = useState("");
	const [carPlateNumber, setCarPlateNumber] = useState("");
	const [isGiftEdit, setIsGift] = useState(isGift);
	const [giftEdit, setGiftEdit] = useState(gift);
	const [showPayment, setShowPayment] = useState(
		retry === "true" ? true : false
	);
	const { storeLocation, primaryThemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);
	const [locationData, setLocationData] = useState([
		{
			storeName: "",
			block: "",
			street: "",
		},
	]);

	useEffect(() => {
		setLocationData(
			storeLocation?.filter(
				(item: { _id: string }) => item?._id === global?.localStorage?.getItem("locationId")
			)
		);
	}, [storeLocation]);

	useEffect(() => {
		let total = 0;
		if (!cartListPromo) {
			total = cartData?.list?.reduce(
				(total: number, acc: { priceAfterDiscount: number; quantity: number }) =>
					(total += acc.priceAfterDiscount * acc.quantity),
				0
			);
		} else {
			total = cartListPromo?.list?.reduce(
				(total: number, acc: { priceAfterDiscount: number; quantity: number }) =>
					(total += acc.priceAfterDiscount * acc.quantity),
				0
			);
		}

		setTotalPrice(total);
	}, [cartData, cartListPromo]);

	const handleShowPayment = () => {
		setShowPayment(!showPayment);
	};

	return (
		<div>
			<p className="pickup-time">{t("Pick up time")}</p>

			<div className="time-container">
				<div style={{ display: "flex", alignItems: "center", gap: 23 }}>
					<img
						alt="pyke"
						style={{ width: 24, height: 24 }}
						src={bikeImg.src}
					/>
					<p
						className="pickup-time"
						style={{ margin: 0 }}>
						{t("Today - 9:00 AM to 10:00 AM")}
					</p>
				</div>
				<EditAddSvg />
			</div>

			<p className="pickup-time">{t("Gift")}</p>
			<div
				className="cart-header-container"
				style={{
					justifyContent: "start",
					gap: 8,
					padding: "23px 27px",
					marginTop: 5,
					marginBottom: 10,
				}}>
				<GiftSvg />
				<input
					type="text"
					value={isGiftEdit ? giftEdit : t("Is this a gift?")}
					placeholder={t("Enter you message")}
					className="cart-input"
					onChange={(e) => setGiftEdit(e.target.value)}
				/>
				<Switch
					checked={isGiftEdit}
					onChange={(e) => setIsGift(e.target.checked)}
				/>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 7,
					alignItems: "start",
					width: "100%",
					height: 129,
					border: "1px solid var(--C4C4C4, #C4C4C4)",
					backgroundColor: "var(--FFFFFF, #FFF)",
					padding: "15px 24px",
					marginBottom: 15,
				}}>
				<p className="deliver-text">{t("Pickup")}</p>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 19,
							marginBottom: 7,
						}}>
						<img
							alt="address"
							src={addressImg.src}
							style={{ width: 24, height: 24 }}
						/>

						{storeLocation && (
							<p className="deliver-text">
								{locationData[0]?.storeName},{locationData[0]?.block},
								{locationData[0]?.street}
							</p>
						)}
					</div>
					<Link href="/new-delivery?tab=pickup">
						<EditAddSvg />
					</Link>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 19,
						}}>
						<img
							alt="address"
							src={contactImg.src}
							style={{ width: 24, height: 24 }}
						/>
						{retry === "true" ? (
							<p className="deliver-text">
								{cartData?.customerDetails?.name}, +
								{cartData?.customerDetails?.phoneNumber}
							</p>
						) : (
							<p className="deliver-text">
								{customerData?.name}, +{customerData?.phoneNumber}
							</p>
						)}
					</div>
					<div
						style={{ cursor: "pointer" }}
						onClick={showInfo}>
						<EditAddSvg />
					</div>
				</div>
			</div>

			<p className="pickup-time">{t("Car details (optional)")}</p>
			<div className="car-container">
				<input
					type="text"
					placeholder={t("Car Plate Number")}
					className="car-input"
					value={carPlateNumber}
					onChange={(e) => setCarPlateNumber(e.target.value)}
				/>
				<input
					type="text"
					placeholder={t("Car Color")}
					className="car-input"
					value={carColor}
					onChange={(e) => setCarColor(e.target.value)}
				/>
				<input
					type="text"
					placeholder={t("Car Brand")}
					className="car-input"
					value={carBrand}
					onChange={(e) => setCarBrand(e.target.value)}
				/>
			</div>

			<p className="pickup-time">{t("Items")}</p>
			<div
				className="product-container"
				style={{
					display: "flex",
					flexDirection: "column",
				}}>
				{cartData?.list?.map(
					(product: {
						quantity: number;
						productNameInArabic: string;
						productName: string;
						variantsDetails: any[];
						priceAfterDiscount: number;
					}) => (
						<div className="item-price-container w-full">
							<div
								className="details-header"
								style={{
									fontSize: 14,
									fontWeight: 400,
									display: "flex",
									gap: 10,
								}}>
								<span className="product-quantity">x{product.quantity}</span>
								<div>
									<span>
										{t("local") === "ar"
											? product?.productNameInArabic
											: product?.productName}
									</span>
									{product?.variantsDetails?.map((variant, index) => (
										<span>
											{index === 0 ? " - " : ""}
											{t("local") === "ar" ? variant?.nameInArabic : variant?.name}{" "}
											{product?.variantsDetails?.length - 1 !== index && " - "}
										</span>
									))}
								</div>
							</div>
							<p
								className="details-header"
								style={{ fontSize: 14, fontWeight: 400 }}>
								{Math.floor(product?.priceAfterDiscount * 1000) / 1000} {t("KWD")}
							</p>
						</div>
					)
				)}
			</div>

			<div style={{ width: "100%", height: 169, backgroundColor: "white" }}>
				<div style={{ padding: "20px 51px" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
							borderBottom: "1px solid #C4C4C4",
							marginBottom: 4,
						}}>
						<p
							className="pickup-time"
							style={{ margin: 0 }}>
							{t("Subtotal")}
						</p>
						<p
							className="pickup-time"
							style={{ margin: 0 }}>
							{t("KWD")} {Math.floor(totalPrice * 1000) / 1000}
						</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
						}}>
						<p
							className="pickup-time"
							style={{ margin: 0 }}>
							{t("Total")}
						</p>
						<p
							className="pickup-time"
							style={{ margin: 0 }}>
							{t("KWD")} {Math.floor(totalPrice * 1000) / 1000}
						</p>
					</div>
				</div>

				<div
					className="button-container"
					style={{ backgroundColor: primaryThemeColourCode }}
					onClick={handleShowPayment}>
					<p
						className="pickup-time"
						style={{ margin: 0 }}>
						{t("Next")}
					</p>
				</div>
			</div>

			{showPayment && (
				<PaymentMenu
					onClose={handleShowPayment}
					totalPrice={totalPrice}
					cartData={cartData}
					carBrand={carBrand}
					plateNumber={carPlateNumber}
					carColor={carColor}
					deliveryFees={0}
					addressId=""
					promoId={promoId}
					isGift={isGiftEdit}
					gift={giftEdit}
					specialMarks={specialMarks}
					totalQuantity={totalQuantity}
				/>
			)}
		</div>
	);
};
