"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";

import PaymentMethod from "./components/PaymentMethod";

import { usePayment } from "./payment.hooks";
import { useTranslation } from "react-i18next";
// import { ArrowRight } from "@material-ui/icons";
import { EditSvg } from "@/public/assets/svgs/ecomLogoSvg";
import "./style.css";

interface install {
	isEditable: boolean;
	orderTotal: string;
	_id: string;
	status: string;
}

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
	referenceNumber: string;
	status: string;
	partOfInstallmentsTotal: number;
	dueDate: string;
	invoiceLink: string;
	isEditable: boolean;
	allowEditByPayer: boolean;
}

const InstallmentsPage = () => {
	const { t, i18n } = useTranslation();
	const searchParams = useSearchParams();
	const billNumber = searchParams?.get("id") as string;
	const hostname = useRef<string | null>(null);

	const { logo, storeName, phoneNumber, email } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	const {
		customerDetails,
		setCustomerDetails,
		showPayment,
		setShowPayment,
		selectedInstall,
		setSelectedInstall,
	} = usePayment(billNumber);

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Access window object only on the client side
			hostname.current = window.location.hostname;
		}
		// i18n.changeLanguage("en");
    // document.documentElement.dir = "ltr";
	}, []);

	const handlePaynow = (installment: customerDetails) => {
		setShowPayment("order");
		setSelectedInstall(installment);
	};

	const handleEdit = (id: string) => {
		const data = customerDetails.map((item: any) => {
			if (item._id === id) {
				return { ...item, isEditable: !item.isEditable };
			}
			return item;
		});
		setCustomerDetails(data);
	};
	const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const data = customerDetails.map((item) => {
			if (item._id === id) {
				return {
					...item,
					orderTotal: e.target.value ? e.target.value.toString() : "0",
				};
			}
			return item;
		});
		setCustomerDetails(data);
	};

	return (
		<>
			{showPayment === "" ? (
				<div className="install-layout"></div>
			) : showPayment === "install" ? (
				<div className="install-layout">
					<div className="install-container">
						<p className="install-invoice">{t("Invoice")}</p>
						<div className="install-container-inner">
							<div className="flex items-center gap-[14.16px] flex-wrap">
								<img
									src={logo}
									alt="store-logo"
									className="install-image"
								/>

								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 18,
										alignItems: "start",
									}}>
									<p
										className="install-text"
										style={{ fontSize: 20, fontWeight: 600 }}>
										{storeName}
									</p>
									<p className="install-text">{t("Mobile")}: {phoneNumber}</p>
									<p className="install-text">{email}</p>
									<p className="install-text">www.{hostname.current}</p>
								</div>
							</div>

							{customerDetails && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 18,
										alignItems: "start",
									}}>
									<p className="install-text">
										{t("Bill number")} : {customerDetails[0]?.billNumber}
									</p>
									<p className="install-text">
										{t("REF. Number")} : {customerDetails[0]?.referenceNumber}
									</p>
									<p className="install-text">
										{t("Created Time")} :{" "}
										{moment(parseInt(customerDetails[0]?.orderPlacedAt)).format(
											"DD/MM/YYYY HH:mma"
										)}
									</p>
									<p className="install-text">
										{t("Status")} : {t(customerDetails[customerDetails?.length - 1]?.status)}
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="install-table">
						<div className="install-head">
							<p className="install-head-text">{t("Sr.No")}</p>
							<p className="install-head-text">{t("Due Date")}</p>
							<p className="install-head-text">{t("Amount")}</p>
							<p className="install-head-text">{t("Status")}</p>
							<p
								className="install-head-text"
								style={{ gridColumn: "span 2 / span 2" }}>
								{t("Action")}
							</p>
						</div>
						{customerDetails?.map((install, index) => (
							<div
								className="install-head"
								style={{ paddingBottom: 33.67 }}
								key={index}>
								<p className="install-row-text">{index + 1}</p>
								<p className="install-row-text">
									{install?.partOfInstallmentsTotal === -1
										? moment(parseInt(customerDetails[0]?.orderPlacedAt)).format(
												"DD/MM/YYYY"
										  )
										: moment(parseInt(install?.dueDate)).format("DD/MM/YYYY")}
								</p>
								{install?.isEditable ? (
									<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
										<input
											type="text"
											value={install?.orderTotal ? install?.orderTotal : ""}
											className="edit-input"
											onChange={(e) => handleChange(install?._id, e)}
										/>
										<div
											style={{ cursor: "pointer" }}
											onClick={() => handleEdit(install?._id)}>
											{/* <ArrowRight /> */}
											<p>Arrow Right</p>
										</div>
									</div>
								) : (
									<p className="install-row-text">
										{install?.orderTotal} {t("KD")}
										{install?.partOfInstallmentsTotal === -1
											? ""
											: install?.allowEditByPayer && (
													<span
														style={{ cursor: "pointer" }}
														onClick={() => handleEdit(install?._id)}>
														<EditSvg />
													</span>
											  )}
									</p>
								)}
								<p className="install-row-text">{t(install?.status)}</p>
								{(customerDetails[index - 1]?.status === "pending" || customerDetails[index - 1]?.status === "failed") ? (
									<p
										className="install-row-text"
										style={{ gridColumn: "span 2 / span 2" }}>
										-
									</p>
								) : install?.status !== "paid" ? (
									<p
										className="install-pay"
										style={{ gridColumn: "span 2 / span 2" }}
										onClick={() => handlePaynow(install)}>
										{t("Pay Now")}
									</p>
								) : (
									<p
										className="install-view"
										style={{ gridColumn: "span 2 / span 2" }}
										onClick={() => window.open(install?.invoiceLink, "_self")}>
										{t("View")}
									</p>
								)}
							</div>
						))}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%",
								padding: "0px 0px",
							}}>
							<p className="install-table-total">{t("Total due")}:</p>
							<p className="install-table-total">
								{customerDetails && customerDetails?.length === 1
									? customerDetails[0]?.orderTotal
									: customerDetails[0]?.partOfInstallmentsTotal}{" "}
								{t("KD")}
							</p>
						</div>
					</div>
				</div>
			) : (
				showPayment === "order" && (
					<PaymentMethod selectedInstall={selectedInstall} />
				)
			)}
		</>
	);
};

export default InstallmentsPage;
