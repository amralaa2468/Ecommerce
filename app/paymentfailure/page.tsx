"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";

import { usePaymentFailure } from "./paymentfailure.hooks";

// import PaymentFailure from "../paymentfailure"; TODO: ADD PaymentFailure Component
import { FailureSvg } from "@/public/assets/svgs/successSvg";
import { EcomLogoSvg, EcomLogoSvgMobile } from "@/public/assets/svgs/ecomLogoSvg";
import "./style.css";
import { useTranslation } from "react-i18next";

const NewPaymentFailure = () => {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const hostname = useRef<string | null>(null);

	const transactionId = searchParams.get("transactionId");
	const paymentReference = searchParams.get("paymentReference") as string;
	const paymentId = searchParams.get("paymentId");
	const authorizationId = searchParams.get("authorizationId");
	const gatewayIdentifier = searchParams.get("gatewayIdentifier");
	const trackId = searchParams.get("trackId");
	const type = searchParams.get("type");

	const { logo, storeName, phoneNumber, email } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	const { orderDetails } = usePaymentFailure(paymentReference);

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Access window object only on the client side
			hostname.current = window.location.hostname;
		}
		// i18n.changeLanguage("en");
    // document.documentElement.dir = "ltr";
		
	}, []);

	return type === "order" || type === "e-link" ? (
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
								{t("Mobile")}: {orderDetails?.orderLocationPhoneNumber}
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
								<p className="success-header">{t("Declined")}!</p>
								<FailureSvg />
							</div>
							<p
								className="success-header"
								style={{
									fontSize: 16,
									fontWeight: 400,
									margin: "0px 0px 20px 0px",
									whiteSpace: "pre-wrap",
								}}>
								{t("Something went wrong while trying to reserve money from your account")}!
							</p>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 18,
									alignItems: "start",
								}}>
								<p className="install-text">{t("Bill number")}: {orderDetails?.billNumber}</p>
								<p className="install-text">
									{t("REF. Number")}: {orderDetails?.referenceNumber}
								</p>
								<p className="install-text">
									{gatewayIdentifier} {t("Payment ID")}: {paymentId}
								</p>
								<p className="install-text">{t("TXN. Number")}: {transactionId}</p>
								<p className="install-text">{t("Authorization ID")}: {authorizationId}</p>
								<p className="install-text">{t("Track ID")}: {trackId ?? ""}</p>
							</div>
						</div>
					</div>
					<div className="details-web-container">
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<h1 className="details-header">{t("Bill To")}: {orderDetails?.customerName}</h1>
							<h1 className="details-text">{t("Kuwait")}</h1>
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
								<h1 className="details-header">{t("Full address")}:</h1>
								<h1 className="details-text">
									{t("Area")}: {orderDetails?.addressInfo?.state}
								</h1>
								<h1 className="details-text">
									{t("street")}: {orderDetails?.addressInfo?.street}
								</h1>
								<h1 className="details-text">
									{t("House")}: {orderDetails?.addressInfo?.houseNo}
								</h1>
								<h1 className="details-text">
									{t("Block")}: {orderDetails?.addressInfo?.block}
								</h1>
								{orderDetails?.addressInfo?.apartmentNo !== "" &&
									orderDetails?.addressInfo?.apartmentNo !== "undefined" && (
										<h1 className="details-text">
											{t("Apartment")}: {orderDetails?.addressInfo?.apartmentNo}
										</h1>
									)}

								{orderDetails?.addressInfo?.officeNo !== "" &&
									orderDetails?.addressInfo?.officeNo !== "undefined" && (
										<h1 className="details-text">
											{t("Office")}: {orderDetails?.addressInfo?.officeNo}
										</h1>
									)}
								{orderDetails?.addressInfo?.floorNo !== "" &&
									orderDetails?.addressInfo?.floorNo !== "undefined" && (
										<h1 className="details-text">
											{t("Floor")}: {orderDetails?.addressInfo?.floorNo}
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
								<h1 className="details-header">{t("Car details")}:</h1>
								<h1 className="details-text">
									{t("Brand")}: {orderDetails?.pickupCarrierInfo?.carBrand}
								</h1>
								<h1 className="details-text">
									{t("Color")}: {orderDetails?.pickupCarrierInfo?.carColor}
								</h1>
								<h1 className="details-text">
									{t("Plate Number")}: {orderDetails?.pickupCarrierInfo?.carPlate}
								</h1>
							</div>
						)}
						<div>
							<h1 className="details-header">{t("Payment")}:</h1>
							<h1 className="details-text">{gatewayIdentifier}</h1>
						</div>
					</div>
					<div className="buttons-container">
						{type === "order" ? (
							<button
								className="retry-btn"
								onClick={() => router.push("/my-cart?retry=true")}>
								{t("RETRY PAYMENT")}
							</button>
						) : (
							<button
								className="retry-btn"
								onClick={() => window.open(orderDetails?.link, "_self")}>
								{t("RETRY PAYMENT")}
							</button>
						)}
						{type === "order" && (
							<button
								className="back-btn"
								onClick={() => router.push("/")}>
								{t("GO BACK")}
							</button>
						)}
					</div>
				</div>

				<div
					style={{
						width: 700,
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						justifyContent: "center",
					}}>
					{orderDetails?.productInfo[0]?.productName !== null && (
						<div className="order-items-container">{t("Order Items")}</div>
					)}
					{orderDetails?.productInfo[0]?.productName !== null && (
						<table className="details-table">
							<thead className="details-table-head">
								<tr>
									<th className="details-head">{t("Item")}</th>
									<th className="details-head">{t("QTY")}</th>
									<th className="details-head">{t("Details")}</th>
									<th className="details-head">{t("Special instruction")}</th>
									<th className="details-head">{t("Amount")}</th>
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
													key={index}
													className="cart-name"
													style={{ padding: 0, margin: 0 }}>
													{variant?.name}{" "}
													{product?.variantsDetails?.length - 1 !== index && " - "}
												</p>
											))}
										</td>
										<td className="details-row">{product?.specialInstructions}</td>
										<td className="details-row">{product?.price} {t("KD")}</td>
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
							<p className="details-prices">{t("Subtotal")}</p>
							<p className="details-prices">{orderDetails?.orderTotal} {t("KD")}</p>
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
								<p className="details-prices">{t("Delivery fees")}</p>
								<p className="details-prices">{orderDetails?.shippingCharge} {t("KD")}</p>
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
								<p className="details-prices">{t("Discount")}</p>
								{orderDetails?.discountType === "amount" && (
									<p
										className="details-prices"
										style={{ color: "green" }}>
										-{orderDetails?.discountValue} {t("KD")}
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
							<p className="details-prices">{t("Total")}</p>
							<p className="details-prices">{orderDetails?.grandTotal} {t("KD")}</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "end",
							justifyContent: "end",
							gap: 4,
							margin: "60px 50px 0px 50px",
							height: "100%",
						}}>
						<p className="payment-powered">{t("Powered by")}</p>
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
						{t("Declined")}!
					</p>
					<FailureSvg />
				</div>
				<p
					className="success-header"
					style={{
						fontSize: 16,
						fontWeight: 400,
						margin: "0px 35px 17px 35px",
					}}>
					{t("Something went wrong while trying to reserve money from your account")}!
				</p>
				<div className="success-container">
					<div
						style={{
							display: "flex",
							gap: "4px",
							paddingTop: "12px",
							paddingRight: "5px",
							flexDirection: "column",
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
								style={{ fontSize: 15, fontWeight: 600 }}>
								{storeName}
							</p>
							<p className="install-text">
								{t("Mobile")}: {orderDetails?.orderLocationPhoneNumber}
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
							paddingRight: "5px",
							marginBottom: "10px",
						}}>
						<p className="install-text">{t("Bill number")}: {orderDetails?.billNumber}</p>
						<p className="install-text">
							{t("REF. Number")}: {orderDetails?.referenceNumber}
						</p>
						<p className="install-text">
							{gatewayIdentifier} {t("Payment ID")}: {paymentId}
						</p>
						<p className="install-text">{t("TXN. Number")}: {transactionId}</p>
						<p className="install-text">{t("Authorization ID")}: {authorizationId}</p>
						<p className="install-text">{t("Track ID")}: {trackId}</p>
					</div>
				</div>

				<div className="details-container">
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<h1 className="details-header">{t("Bill To")}: {orderDetails?.customerName}</h1>
						<h1 className="details-text">{t("Kuwait")}</h1>
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
							<h1 className="details-header">{t("Full address")}:</h1>
							<h1 className="details-text">
								{t("Area")}: {orderDetails?.addressInfo?.state}
							</h1>
							<h1 className="details-text">
								{t("street")}: {orderDetails?.addressInfo?.street}
							</h1>
							<h1 className="details-text">
								{t("House")}: {orderDetails?.addressInfo?.houseNo}
							</h1>
							<h1 className="details-text">
								{t("Block")}: {orderDetails?.addressInfo?.block}
							</h1>
							{orderDetails?.addressInfo?.apartmentNo !== "" &&
								orderDetails?.addressInfo?.apartmentNo !== "undefined" && (
									<h1 className="details-text">
										{t("Apartment")}: {orderDetails?.addressInfo?.apartmentNo}
									</h1>
								)}

							{orderDetails?.addressInfo?.officeNo !== "" &&
								orderDetails?.addressInfo?.officeNo !== "undefined" && (
									<h1 className="details-text">
										{t("Office")}: {orderDetails?.addressInfo?.officeNo}
									</h1>
								)}
							{orderDetails?.addressInfo?.floorNo !== "" &&
								orderDetails?.addressInfo?.floorNo !== "undefined" && (
									<h1 className="details-text">
										{t("Floor")}: {orderDetails?.addressInfo?.floorNo}
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
							<h1 className="details-header">{t("Car details")}:</h1>
							<h1 className="details-text">
								{t("Brand")}: {orderDetails?.pickupCarrierInfo?.carBrand}
							</h1>
							<h1 className="details-text">
								{t("Color")}: {orderDetails?.pickupCarrierInfo?.carColor}
							</h1>
							<h1 className="details-text">
								{t("Plate Number")}: {orderDetails?.pickupCarrierInfo?.carPlate}
							</h1>
						</div>
					)}
				</div>

				<p className="details-order">{t("Order Details")}</p>
				{orderDetails?.productInfo[0]?.productName !== null && (
					<table className="details-table">
						<thead className="details-table-head">
							<tr>
								<th className="details-head">{t("Item")}</th>
								<th className="details-head">{t("QTY")}</th>
								<th className="details-head">{t("Details")}</th>
								<th className="details-head">{t("Special instruction")}</th>
								<th className="details-head">{t("Amount")}</th>
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
												key={index}
												className="cart-name"
												style={{ padding: 0, margin: 0 }}>
												{variant?.name}{" "}
												{product?.variantsDetails?.length - 1 !== index && " - "}
											</p>
										))}
									</td>
									<td className="details-row">{product?.specialInstructions}</td>
									<td className="details-row">{product?.price} {t("KD")}</td>
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
						marginBottom: "30px",
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
						<p className="details-prices">{t("Subtotal")}</p>
						<p className="details-prices">{orderDetails?.orderTotal} {t("KD")}</p>
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
							<p className="details-prices">{t("Delivery fees")}</p>
							<p className="details-prices">{orderDetails?.shippingCharge} {t("KD")}</p>
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
							<p className="details-prices">{t("Discount")}</p>
							{orderDetails?.discountType === "amount" && (
								<p
									className="details-prices"
									style={{ color: "green" }}>
									-{orderDetails?.discountValue} {t("KD")}
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
						<p className="details-prices">{t("Total")}</p>
						<p className="details-prices">{orderDetails?.grandTotal} {t("KD")}</p>
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
					<p className="payment-powered-mobile">{t("Powered by")}</p>
					<EcomLogoSvgMobile />
				</div>
				<div className="buttons-container">
					{type === "order" ? (
						<button
							className="retry-btn"
							onClick={() => router.push("/my-cart?retry=true")}>
							{t("RETRY PAYMENT")}
						</button>
					) : (
						<button
							className="retry-btn"
							onClick={() => window.open(orderDetails?.link, "_self")}>
							{t("RETRY PAYMENT")}
						</button>
					)}
					{type === "order" && (
						<button
							className="back-btn"
							onClick={() => router.push("/")}>
							{t("GO BACK")}
						</button>
					)}
				</div>
			</div>
		</>
	) : (
		// <PaymentFailure />
		<>payment failure component</>
	);
};

export default NewPaymentFailure;
