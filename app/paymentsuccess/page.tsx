"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";

import { usePaymentSuccess } from "./paymentsuccess-hooks";

import { SuccessSvg } from "@/public/assets/svgs/successSvg";
import { EcomLogoSvg, EcomLogoSvgMobile } from "@/public/assets/svgs/ecomLogoSvg";
import "./style.css";
//import "../PaymentMethod/style.css";
import { useTranslation } from "react-i18next";

const NewPaymentSuccess = () => {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const hostname = useRef<string | null>(null);

	const transactionDate = searchParams.get("transactionDate");
	const transactionId = searchParams.get("transactionId");
	const paymentReference = searchParams.get("paymentReference") as string;
	const paymentId = searchParams.get("paymentId");
	const authorizationId = searchParams.get("authorizationId");
	const gatewayIdentifier = searchParams.get("gatewayIdentifier");
	const trackId = searchParams.get("trackId");
	const type = searchParams.get("type");

	const { logo, storeName, phoneNumber, email, avgPreparation } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	const minutes = parseInt(avgPreparation);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const remainingHours = hours % 24;
	const remainingMinutes = minutes % 60;

	const { orderDetails } = usePaymentSuccess(paymentReference);

	console.log('order details: ', orderDetails)

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Access window object only on the client side
			hostname.current = window.location.hostname;
		}
		i18n.changeLanguage("en");
    document.documentElement.dir = "ltr";
	}, []);

	return (
		<>
			<div className="success-web-layout">
				<div>
					<div style={{ display: "flex", alignItems: "start", gap: 25 }}>
						<div
							style={{
								display: "flex",
								alignItems: "start",
								gap: 18,
								flexDirection: "column",
							}}>
							<img
								src={logo}
								alt="logo"
								style={{ width: 144, height: 144, borderRadius: 144 }}
							/>
							<p
								className="install-text"
								style={{ fontSize: 20, fontWeight: 700 }}>
								{storeName}
							</p>
							<p className="install-text">
								Mobile: {orderDetails?.orderLocationPhoneNumber}
							</p>
							<p className="install-text">{email}</p>
							<p className="install-text">www.{hostname.current}</p>
						</div>

						<div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 55,
									margin: "10px 0px",
								}}>
								<p className="success-header">Thank you!</p>
								<SuccessSvg />
							</div>
							<p
								className="success-header"
								style={{
									fontSize: 16,
									fontWeight: 400,
									margin: "0px 0px 20px 0px",
								}}>
								Your order has been placed.
							</p>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 18,
									alignItems: "start",
								}}>
								<p className="install-text">Bill number: {orderDetails?.billNumber}</p>
								<p className="install-text">
									REF. Number: {orderDetails?.referenceNumber}
								</p>
								<p className="install-text">
									{gatewayIdentifier} Payment ID: {paymentId}
								</p>
								<p className="install-text">TXN. Number: {transactionId}</p>
								<p className="install-text">Authorization ID: {authorizationId}</p>
								<p className="install-text">Track ID: {trackId}</p>
								<p className="install-text">
									payment status: {orderDetails?.status} {transactionDate}
								</p>
								<p className="install-text">
									Created Time :{" "}
									{moment(parseInt(orderDetails?.orderPlacedAt!)).format(
										"DD/MM/YYYY HH:mma"
									)}
								</p>
								<p className="install-text">
									Shipping in {days !== 0 && days + " days "}
									{remainingHours !== 0 && remainingHours + " hours "}
									{remainingMinutes !== 0 && remainingMinutes + " mins"}
								</p>
							</div>
						</div>
					</div>
					<div className="details-web-container">
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<h1 className="details-header">Bill To: {orderDetails?.customerName}</h1>
							<h1 className="details-text">Kuwait</h1>
							<h1 className="details-text">{orderDetails?.phoneNumber}</h1>
							<h1 className="details-text">{orderDetails?.email}</h1>
						</div>
						{orderDetails?.orderType === "normal" && (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
									borderLeft: "1px solid #C4C4C4",
									paddingLeft: 20,
								}}>
								<h1 className="details-header">Full address:</h1>
								<h1 className="details-text">
									Area: {orderDetails?.addressInfo?.state}
								</h1>
								<h1 className="details-text">
									street: {orderDetails?.addressInfo?.street}
								</h1>
								<h1 className="details-text">
									House: {orderDetails?.addressInfo?.houseNo}
								</h1>
								<h1 className="details-text">
									Block: {orderDetails?.addressInfo?.block}
								</h1>
								{orderDetails?.addressInfo?.apartmentNo !== "" &&
									orderDetails?.addressInfo?.apartmentNo !== "undefined" && (
										<h1 className="details-text">
											Apartment: {orderDetails?.addressInfo?.apartmentNo}
										</h1>
									)}

								{orderDetails?.addressInfo?.officeNo !== "" &&
									orderDetails?.addressInfo?.officeNo !== "undefined" && (
										<h1 className="details-text">
											Office: {orderDetails?.addressInfo?.officeNo}
										</h1>
									)}
								{orderDetails?.addressInfo?.floorNo !== "" &&
									orderDetails?.addressInfo?.floorNo !== "undefined" && (
										<h1 className="details-text">
											Floor: {orderDetails?.addressInfo?.floorNo}
										</h1>
									)}
							</div>
						)}
						{orderDetails?.orderType === "pickup" && (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
									borderLeft: "1px solid #C4C4C4",
									paddingLeft: 20,
								}}>
								<h1 className="details-header">Car details:</h1>
								<h1 className="details-text">
									Make: {orderDetails?.pickupCarrierInfo?.carMake}
								</h1>
								<h1 className="details-text">
									Color: {orderDetails?.pickupCarrierInfo?.plateColor}
								</h1>
								<h1 className="details-text">
									Plate Number: {orderDetails?.pickupCarrierInfo?.carType}
								</h1>
							</div>
						)}
						<div>
							<h1 className="details-header">Payment:</h1>
							<h1 className="details-text">{gatewayIdentifier}</h1>
						</div>
					</div>
					<div className="buttons-container">
						{type === "order" && (
							<button
								className="back-btn"
								onClick={() => router.push("/")}>
								GO BACK
							</button>
						)}
					</div>
				</div>

				<div style={{ width: 700 }}>
					{orderDetails?.productInfo[0]?.productName && (
						<div className="order-items-container">Order Items</div>
					)}
					{orderDetails?.productInfo[0]?.productName !== null && (
						<table className="details-table">
							<thead className="details-table-head">
								<tr>
									<th className="details-head">Item</th>
									<th className="details-head">QTY</th>
									<th className="details-head">Details</th>
									<th className="details-head">Special instruction</th>
									<th className="details-head">Amount</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails?.productInfo?.map((product, index) => (
									<tr key={index}>
										<td className="details-row">
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: 8.41,
												}}>
												<img
													src={product?.image[0]?.url || ""}
													alt="prod"
													style={{
														width: 37.979,
														height: 35,
														borderRadius: 6.5,
													}}
												/>
												<p style={{ whiteSpace: "pre-wrap" }}>{product?.productName}</p>
											</div>
											<div
												style={{
													display: "flex",
													flexWrap: "wrap",
													gap: 2,
												}}></div>
										</td>
										<td className="details-row">{product?.quantity}</td>
										<td className="details-row">
											{product?.variantsDetails?.map((variant, index) => (
												<p
													className="cart-name"
													style={{ padding: 0, margin: 0 }}>
													{variant?.name}{" "}
													{product?.variantsDetails?.length - 1 !== index && " - "}
												</p>
											))}
										</td>
										<td className="details-row">{product?.specialInstructions}</td>
										<td className="details-row">{product?.price} KD</td>
									</tr>
								))}
							</tbody>
						</table>
					)}

					<div
						style={{
							maxWidth: 500,
							display: "flex",
							gap: 8,
							flexDirection: "column",
							margin: "0px auto",
							width: "100%",
							marginBottom: 82,
						}}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								paddingBottom: 8,
								borderBottom: "1px solid #979797",
								width: "100%",
							}}>
							<p className="details-prices">Subtotal</p>
							<p className="details-prices">{orderDetails?.orderTotal} KD</p>
						</div>

						{orderDetails?.shippingCharge ? (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									paddingBottom: 8,
									borderBottom: "1px solid #979797",
									width: "100%",
								}}>
								<p className="details-prices">Delivery fees</p>
								<p className="details-prices">{orderDetails?.shippingCharge} KD</p>
							</div>
						) : (
							""
						)}

						{orderDetails?.discountValue ? (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									paddingBottom: 8,
									borderBottom: "1px solid #979797",
									width: "100%",
								}}>
								<p className="details-prices">Discount</p>
								{orderDetails?.discountType === "amount" && (
									<p
										className="details-prices"
										style={{ color: "green" }}>
										-{orderDetails?.discountValue} KD
									</p>
								)}
								{orderDetails?.discountType === "percentage" && (
									<p
										className="details-prices"
										style={{ color: "green" }}>
										% {orderDetails?.discountValue}
									</p>
								)}
							</div>
						) : (
							""
						)}

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}>
							<p className="details-prices">Total</p>
							<p className="details-prices">{orderDetails?.grandTotal} KD</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "end",
							gap: 4,
							margin: "170px 0px 0px 100px",
							height: "100%",
						}}>
						<p className="payment-powered">Powered by</p>
						<EcomLogoSvg />
					</div>
				</div>
			</div>

			<div className="success-layout">
				{/* header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 55,
						margin: "10px 35px",
					}}>
					<p
						className="success-header"
						style={{ fontWeight: "700", fontSize: "24px" }}>
						Thank you!
					</p>
					<SuccessSvg />
				</div>
				<p
					className="success-header"
					style={{
						fontSize: 16,
						fontWeight: 400,
						margin: "0px 35px 17px 35px",
					}}>
					Your payment has been received!
				</p>

				<div className="success-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "start",
							gap: 10.41,
						}}>
						<img
							src={logo}
							alt="store-logo"
							className="install-image"
						/>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "10px",
								alignItems: "start",
							}}>
							<p
								className="install-text"
								style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>
								{storeName}
							</p>
							<p className="install-text">
								Mobile: {orderDetails?.orderLocationPhoneNumber}
							</p>
							<p className="install-text">{email}</p>
							<p className="install-text">www.{hostname.current}</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
							alignItems: "start",
						}}>
						<p className="install-text">Bill number: {orderDetails?.billNumber}</p>
						<p className="install-text">
							REF. Number: {orderDetails?.referenceNumber}
						</p>
						<p className="install-text">
							{gatewayIdentifier} Payment ID: {paymentId}
						</p>
						<p className="install-text">TXN. Number: {transactionId}</p>
						<p className="install-text">Authorization ID: {authorizationId}</p>
						<p className="install-text">Track ID: {trackId}</p>
						<p className="install-text">
							payment status: {orderDetails?.status} {transactionDate}
						</p>
						<p className="install-text">
							Created Time :{" "}
							{moment(parseInt(orderDetails?.orderPlacedAt!)).format(
								"DD/MM/YYYY HH:mma"
							)}
						</p>
						<p className="install-text">
							Shipping in {days !== 0 && days + " days "}
							{remainingHours !== 0 && remainingHours + " hours "}
							{remainingMinutes !== 0 && remainingMinutes + " mins"}
						</p>
					</div>
				</div>

				<div className="details-container">
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<h1 className="details-header">Bill To: {orderDetails?.customerName}</h1>
						<h1 className="details-text">Kuwait</h1>
						<h1 className="details-text">{orderDetails?.phoneNumber}</h1>
						<h1 className="details-text">{orderDetails?.email}</h1>
						<h1 className="details-header">Payment:</h1>
						<h1 className="details-text">{gatewayIdentifier}</h1>
					</div>
					{orderDetails?.orderType === "normal" && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 10,
								borderLeft: "1px solid #C4C4C4",
								paddingLeft: 20,
							}}>
							<h1 className="details-header">Full address:</h1>
							<h1 className="details-text">
								Area: {orderDetails?.addressInfo?.state}
							</h1>
							<h1 className="details-text">
								street: {orderDetails?.addressInfo?.street}
							</h1>
							<h1 className="details-text">
								House: {orderDetails?.addressInfo?.houseNo}
							</h1>
							<h1 className="details-text">
								Block: {orderDetails?.addressInfo?.block}
							</h1>
							{orderDetails?.addressInfo?.apartmentNo !== "" &&
								orderDetails?.addressInfo?.apartmentNo !== "undefined" && (
									<h1 className="details-text">
										Apartment: {orderDetails?.addressInfo?.apartmentNo}
									</h1>
								)}

							{orderDetails?.addressInfo?.officeNo !== "" &&
								orderDetails?.addressInfo?.officeNo !== "undefined" && (
									<h1 className="details-text">
										Office: {orderDetails?.addressInfo?.officeNo}
									</h1>
								)}
							{orderDetails?.addressInfo?.floorNo !== "" &&
								orderDetails?.addressInfo?.floorNo !== "undefined" && (
									<h1 className="details-text">
										Floor: {orderDetails?.addressInfo?.floorNo}
									</h1>
								)}
						</div>
					)}
					{orderDetails?.orderType === "pickup" && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 10,
								borderLeft: "1px solid #C4C4C4",
								paddingLeft: 20,
							}}>
							<h1 className="details-header">Car details:</h1>
							<h1 className="details-text">
								Make: {orderDetails?.pickupCarrierInfo?.carMake}
							</h1>
							<h1 className="details-text">
								Color: {orderDetails?.pickupCarrierInfo?.plateColor}
							</h1>
							<h1 className="details-text">
								Plate Number: {orderDetails?.pickupCarrierInfo?.carType}
							</h1>
						</div>
					)}
				</div>

				{orderDetails?.productInfo[0]?.productName && (
					<div className="order-items-container">Order Details</div>
				)}
				{orderDetails?.productInfo[0]?.productName !== null && (
					<table className="details-table">
						<thead className="details-table-head">
							<tr>
								<th className="details-head">Item</th>
								<th className="details-head">QTY</th>
								<th className="details-head">Details</th>
								<th className="details-head">Special instruction</th>
								<th className="details-head">Amount</th>
							</tr>
						</thead>
						<tbody>
							{orderDetails?.productInfo?.map((product, index) => (
								<tr key={index}>
									<td className="details-row">
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: 8.41,
											}}>
											<img
												src={product?.image[0]?.url || ""}
												alt="prod"
												style={{
													width: 37.979,
													height: 35,
													borderRadius: 6.5,
												}}
											/>
											<p style={{ whiteSpace: "pre-wrap" }}>{product?.productName}</p>
										</div>
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												gap: 2,
											}}></div>
									</td>
									<td className="details-row">{product?.quantity}</td>
									<td className="details-row">
										{product?.variantsDetails?.map((variant, index) => (
											<p
												className="cart-name"
												style={{ padding: 0, margin: 0 }}>
												{variant?.name}{" "}
												{product?.variantsDetails?.length - 1 !== index && " - "}
											</p>
										))}
									</td>
									<td className="details-row">{product?.specialInstructions}</td>
									<td className="details-row">{product?.price} KD</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<div
					style={{
						maxWidth: 350,
						display: "flex",
						gap: 8,
						flexDirection: "column",
						margin: "0px auto",
						width: "75%",
						marginBottom: 82,
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							paddingBottom: 8,
							borderBottom: "1px solid #979797",
							width: "100%",
						}}>
						<p className="details-prices">Subtotal</p>
						<p className="details-prices">{orderDetails?.orderTotal} KD</p>
					</div>

					{orderDetails?.shippingCharge ? (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								paddingBottom: 8,
								borderBottom: "1px solid #979797",
								width: "100%",
							}}>
							<p className="details-prices">Delivery fees</p>
							<p className="details-prices">{orderDetails?.shippingCharge} KD</p>
						</div>
					) : (
						""
					)}

					{orderDetails?.discountValue ? (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								paddingBottom: 8,
								borderBottom: "1px solid #979797",
								width: "100%",
							}}>
							<p className="details-prices">Discount</p>
							{orderDetails?.discountType === "amount" && (
								<p
									className="details-prices"
									style={{ color: "green" }}>
									-{orderDetails?.discountValue} KD
								</p>
							)}
							{orderDetails?.discountType === "percentage" && (
								<p
									className="details-prices"
									style={{ color: "green" }}>
									% {orderDetails?.discountValue}
								</p>
							)}
						</div>
					) : (
						""
					)}

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
						}}>
						<p className="details-prices">Total</p>
						<p className="details-prices">{orderDetails?.grandTotal} KD</p>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						gap: 4,
						height: "20px",
						marginRight: "15px",
					}}>
					<p className="payment-powered-mobile">Powered by</p>
					<EcomLogoSvgMobile />
				</div>
				<div className="buttons-container">
					{type === "order" && (
						<button
							className="back-btn"
							onClick={() => router.push("/")}>
							GO BACK
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default NewPaymentSuccess;
