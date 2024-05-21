"use client";

import { useEffect, useState } from "react";
import { getTempOrderDetailsV2Api, linkOpenedApi } from "./payment.container";

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

const initalValue = {
	productInfo: "",
	_id: "",
	billNumber: "",
	orderPlacedAt: "",
	discountType: "",
	discountValue: 0,
	customerName: "",
	phoneNumber: "",
	needsDelivery: false,
	orderTotal: "",
	shippingCharge: 0,
	referenceNumber: "",
	status: "",
	partOfInstallmentsTotal: 0,
	dueDate: "",
	invoiceLink: "",
	isEditable: false,
	allowEditByPayer: false,
};

export const usePayment = (billNumber: string) => {
	const [customerDetails, setCustomerDetails] = useState<customerDetails[]>([]);
	const [showPayment, setShowPayment] = useState("");
	const [selectedInstall, setSelectedInstall] =
		useState<customerDetails>(initalValue);

	const getTempOrderDetails = async () => {
		try {
			const res = await getTempOrderDetailsV2Api(billNumber);

			if (res.getTempOrderDetailsV2[0]?.partOfInstallmentsTotal !== -1) {
				setShowPayment("install");
				setCustomerDetails(res?.getTempOrderDetailsV2);
			} else if (res.getTempOrderDetailsV2[0]?.invoiceLink) {
				window.open(res.getTempOrderDetailsV2[0]?.invoiceLink, "_self");
			} else {
				setShowPayment("order");
				setSelectedInstall(res?.getTempOrderDetailsV2[0]);
			}
			linkOpenedApi(res?.getTempOrderDetailsV2[0]?._id);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getTempOrderDetails();
	}, [billNumber]);
	return {
		customerDetails,
		setCustomerDetails,
		showPayment,
		setShowPayment,
		selectedInstall,
		setSelectedInstall,
	};
};
