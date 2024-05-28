"use client";

import { useEffect, useState } from "react";
import { getOrderDetailsByPaymentReferenceApi } from "./paymentsuccess.container";

interface orderDetails {
	_id: string;
	customerName: string;
	orderTotal: number;
	orderId: string;
	orderPlacedAt: string;
	shippingCharge: number;
	email: string;
	phoneNumber: string;
	status: string;
	deliveryStatusTime: string;
	expectedArrivingTime: string;
	paymentMethod: string;
	addressInfo: address;
	deliveryStatus: string;
	productInfo: orderProduct[];
	transactionInfo: transactions;
	orderType: string;
	promoInfo: promo;
	needsDelivery: boolean;
	orderLocation: string;
	pickupCarrierInfo: pickupCarrierInfo;
	orderLocationAddressString: string;
	orderLocationPhoneNumber: string;
	billNumber: string;
	dueDate: string;
	referenceNumber: string;
	allowEditByPayer: boolean;
	orderInInstallments: number;
	numberOfInstallments: number;
	partOfInstallmentsTotal: number;
	grandTotal: number;
	isGift: boolean;
	giftMessage: string;
	specialRemarks: string;
	invoiceLink: string;
	link: string;
	discountType: string;
	discountValue: number;
}

type pickupCarrierInfo = {
	carBrand: string;
	carColor: string;
	carPlate: string;
};

type promo = {
	_id: string;
	couponCode: string;
	discountType: string;
	discountValue: number;
	maxDiscount: number;
	minPurchase: number;
	minOrderValue: number;
	maxNumberOfUsages: number;
	numberOfUsages: number;
	isBlocked: boolean;
	categoryIds: string[];
	productIds: string[];
	discountName: string;
};

type transactions = {
	_id: string;
	orderId: string;
	planId: string;
	domainId: string;
	orderRefundId: string;
	amount: number;
	bankAmount: number;
	transactionFor: string;
	paymentReference: string;
	paymentId: string;
	trackId: string;
	authorizationId: string;
	transactionId: string;
	mode: string;
	ecomPayment: number;
	createdAt: string;
};

type orderProduct = {
	productId: string;
	productName: string;
	productNameInArabic: string;
	description: string;
	descriptionInArabic: string;
	specialInstructions: string;
	isMandatory: boolean;
	image: image[];
	quantity: number;
	price: number;
	variantName: string;
	variantIds: string[];
	variantsDetails: variant[];
};

type variant = {
	_id: string;
	name: string;
	nameInArabic: string;
	quantity: number;
	subOptionIds: string[];
	parentName: string;
	parentNameInArabic: string;
	price: number;
	minimumPurchase: number;
	maximumPurchase: number;
	isUnlimited: boolean;
	dimensions: dimensions;
	weight: number;
};

type dimensions = {
	length: number;
	width: number;
	height: number;
};

type image = {
	url: string;
	thumbnailUrl: string;
};

type address = {
	_id: string;
	city: string;
	cityId: string;
	state: string;
	stateId: string;
	country: string;
	countryId: string;
	block: string;
	street: string;
	avenue: string;
	houseNo: string;
	apartmentNo: string;
	floorNo: string;
	officeNo: string;
	specialDirection: string;
	postalCode: string;
	type: string;
};

export const usePaymentSuccess = (paymentReference: string) => {
	const [orderDetails, setOrderDetails] = useState<orderDetails>();

	const getOrderDetails = async () => {
		try {
			const { getOrderDetailsByPaymentReference } =
				await getOrderDetailsByPaymentReferenceApi(paymentReference);
			setOrderDetails(getOrderDetailsByPaymentReference);
		} catch (error) {
			console.log('error getting order details: ', error)
		}
	};

	useEffect(() => {
		getOrderDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { orderDetails };
};
