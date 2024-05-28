"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";

import { placeOrderFromTempV2Api } from "../payment.container";

// import { Alert } from "@material-ui/lab";
// import { Snackbar } from "@material-ui/core";
import mastercardImg from "@/public/assets/svgs/images/Mastercard.png";
import knetImg from "@/public/assets/svgs/images/knet.png";
import {
	DropdownArrowSvg,
	EcomLogoSvg,
	ExitSvg,
	MasterCardSvg,
} from "@/public/assets/svgs/ecomLogoSvg";
import "../style.css";

interface PlaceOrdersProps {
	onClose: () => void;
	customerDetails: CustomerDetails;
}

interface CustomerDetails {
	productInfo: string;
	_id: string;
	orderTotal: string;
	shippingCharge: number;
	discountValue: number;
	discountType: string;
	billNumber: string;
	orderPlacedAt: string;
	customerName: string;
	phoneNumber: string;
	needsDelivery: boolean;
}

function calculateTotal(cartList: any) {
	const totalQuantity = cartList.reduce((total: any, product: any) => {
		return total + product.quantity;
	}, 0);

	return { totalQuantity };
}

const PlaceOrder: React.FC<PlaceOrdersProps> = ({
	onClose,
	customerDetails,
}) => {
	const { logo, storeName, enableKnetPayment, enableCreditPayment } =
		useSelector((state: RootState) => state.StoreReducer.customerDetails);
	const { t } = useTranslation();

	const [paymentMethod, setPaymentMethod] = useState("knet");
	const [errorMsg, setErrorMsg] = useState("");
	const [openMenu, setOpenMenu] = useState(false);
	const [totalQuantity, setTotalQuantity] = useState(0);

	useEffect(() => {
		const { totalQuantity } = calculateTotal(customerDetails?.productInfo);
		setTotalQuantity(totalQuantity);
	}, [customerDetails]);

	const handlePayment = async () => {
		if (paymentMethod === "") {
			setErrorMsg("please select payment method");
		} else {
			try {
				const res = await placeOrderFromTempV2Api(
					customerDetails._id,
					paymentMethod,
					parseFloat(customerDetails.orderTotal)
				);

				if (res.paymentLink) {
					window.open(`${res.paymentLink}`, "_self");
				}
			} catch (error) {
				console.log(error);
				setErrorMsg("this link is expired");
			}
		}
	};

	return (
		<div className="order-layout">
			<div className="order-container">
				<div
					className={`absolute top-[-15px] ${t("local") === "ar" ? "left-[-10px]" : "right-[-10px]"} cursor-pointer`}
					onClick={onClose}>
					<ExitSvg />
				</div>
				<div className={`flex items-center gap-2.5 mb-[7px] ${t("local") === "ar" ? "mr-[30px]" : "ml-[30px]"}`}>
					<p className="order-powered">{t("Powered by")}</p>
					<EcomLogoSvg />
				</div>

				<div className="order-details-container">
					<div className="order-details-line"></div>

					<div className="order-details-data">
						<div className="flex flex-col items-center">
							<img
								src={logo}
								alt="store-logo"
								style={{
									width: 63,
									height: 63,
									borderRadius: 63,
									marginBottom: 12,
								}}
							/>
							<p className="order-store-name">{t("PAYMENT FOR")}</p>
							<p
								className="order-store-name"
								style={{ fontWeight: 700 }}>
								{storeName}
							</p>
						</div>

						<div className="order-details-menu">
							<p className="order-details-menu-text">{t("Order details")}</p>
							<div
								style={{ cursor: "pointer" }}
								onClick={() => setOpenMenu(!openMenu)}>
								<DropdownArrowSvg />
							</div>

							{openMenu && (
								<div className="order-details-dropdown">
									<div className="order-details-dropdown-con">
										<p className="order-details-dropdown-text">{t("Items")}</p>
										<p className="order-details-dropdown-text">{totalQuantity}</p>
									</div>
									<div className="order-details-dropdown-con">
										<p className="order-details-dropdown-text">{t("Subtotal")}</p>
										<p className="order-details-dropdown-text">
											{customerDetails?.orderTotal} {t("KD")}
										</p>
									</div>
									{customerDetails?.shippingCharge &&
									customerDetails?.shippingCharge !== 0 ? (
										<div className="order-details-dropdown-con">
											<p className="order-details-dropdown-text">{t("Delivery fees")} </p>
											<p className="order-details-dropdown-text">
												{customerDetails?.shippingCharge} {t("KD")}
											</p>
										</div>
									) : (
										""
									)}
									{customerDetails?.discountValue && (
										<div className="order-details-dropdown-con">
											<p className="order-details-dropdown-text">{t("Discount")}</p>
											<p
												className="order-details-dropdown-text"
												style={{ color: "#5FC123" }}>
												{customerDetails?.discountType === "amount" ? "-KD " : "-% "}{" "}
												{customerDetails?.discountValue}
											</p>
										</div>
									)}
									<div className="order-details-dropdown-con">
										<p className="order-details-dropdown-text">{t("Total")}</p>
										<p className="order-details-dropdown-text">
											{customerDetails?.orderTotal + customerDetails?.shippingCharge} {t("KD")}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="order-payment-container">
						<div className="flex justify-center items-center w-full gap-[28px] my-[21px] mx-0">
							{enableKnetPayment && (
								<img
									alt="knet"
									className={`w-[74px] h-[52px] ${
										paymentMethod === "knet" && "border-[3px] border-[#57AD13]"
									}`}
									src={knetImg.src}
									onClick={() => setPaymentMethod("knet")}
								/>
							)}
							{enableCreditPayment && (
								<div
									className={`order-payment-image ${
										paymentMethod === "credit" && "border-[3px] border-[#57AD13]"
									}`}
									onClick={() => setPaymentMethod("credit")}>
									<MasterCardSvg />
								</div>
							)}
						</div>
						<div
							className="order-payment-button"
							onClick={handlePayment}>
							<p className="order-payment-button-text">{t("Pay with")}</p>
							{(enableKnetPayment || enableCreditPayment) && paymentMethod !== "" && (
								<img
									alt="knet"
									style={{ width: 33, height: 23 }}
									src={paymentMethod === "knet" ? knetImg.src : mastercardImg.src}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* <Snackbar
				open={errorMsg}
				autoHideDuration={3000}
				onClose={() => setErrorMsg(null)}>
				<Alert
					severity="error"
					onClose={() => setErrorMsg(null)}>
					{errorMsg}
				</Alert>
			</Snackbar> */}
		</div>
	);
};

export default PlaceOrder;
