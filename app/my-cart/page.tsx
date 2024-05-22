"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";

import {
	addToCartApi,
	validateCartQuantitiesApi,
	applyPromoV2Api,
	changeQuantityApi,
	removeFromCartApi,
} from "./my-cart.container";
import { viewCartApi } from "@/components/StoreData/storeData.container";
import { useMyCart } from "./my-cart.hooks";

import PlaceOrder from "../delivery/components/PlaceOrder";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import emptyCartImg from "@/public/assets/svgs/images/emptyCart.png";
import { BackSvg } from "@/public/assets/svgs/searchSvg";
import {
	CouponSvg,
	ArrowShoppingSvg,
	RemarksSvg,
	GiftSvg,
	CartMinusSvg,
	CartAddSvg,
} from "@/public/assets/svgs/cartSvg";
import "./style.css";
import "../new-category/[categoryId]/style.css";
import { updateCartList } from "@/redux/reducers/storeReducer";
import Switch from "@mui/material/Switch";

interface product {
	_id: string;
	productId: string;
	variantIds: string | null[];
	productName: string;
	description: string;
	quantity: number;
	price: number;
	priceAfterDiscount: number;
	image: image[];
}

type item = {
	_id: string;
	image: image[];
	productNameInArabic: string;
	productName: string;
	variantsDetails: variant[];
	priceAfterDiscount: number;
	quantity: number;
	productId: string;
	variantIds: string | null[];
	description: string;
	price: number;
};

type image = {
	url: string;
};

type variant = {
	nameInArabic: string;
	name: string;
};

function calculateTotal(cartList: any) {
	const totalPrice = cartList.reduce((total: number, product: product) => {
		return total + product.priceAfterDiscount * product.quantity;
	}, 0);

	const totalQuantity = cartList.reduce((total: number, product: product) => {
		return total + product.quantity;
	}, 0);

	return { totalPrice, totalQuantity };
}

const NewCart = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const retry = searchParams.get("retry");

	const dispatch = useDispatch();
	const cartList = useSelector(
		(state: RootState) => state.StoreReducer.cartList
	);
	const { _id, primaryThemeColourCode, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [showPlaceOrder, setShowPlaceOrder] = useState(
		retry === "true" ? true : false
	);
	const [error, setError] = useState(false);
	const [errMsg, setErrMsg] = useState<string>("");
	const [couponCode, setCouponCode] = useState("");
	const [cartListPromo, setCartListPromo] = useState("");
	const [promoId, setPromoId] = useState("");
	const [gift, setGift] = useState("");
	const [isGift, setIsGift] = useState(false);
	const [marks, setMarks] = useState("");

	const { minimumOrderAmount } = useMyCart(_id);

	useEffect(() => {
		const { totalPrice, totalQuantity } = calculateTotal(cartList);

		setTotalPrice(totalPrice);
		setTotalQuantity(totalQuantity);
	}, [cartList]);

	const handleAdd = async (product: product) => {
		try {
			await addToCartApi(
				_id,
				product.productId,
				product.variantIds,
				1,
				"",
				global?.localStorage?.getItem("locationId") ?? ""
			);

			const res = await viewCartApi({
				customerId: _id,
				storeId: global?.localStorage?.getItem("StoreId")!,
			});
			const payload = res;
			dispatch(updateCartList(payload.list));
		} catch (error) {
			console.log(error);
		}
	};

	const handleMinus = async (cartId: string, quantity: number) => {
		if (quantity === 1) {
			try {
				await removeFromCartApi(cartId);

				const res = await viewCartApi({
					customerId: _id,
					storeId: global?.localStorage?.getItem("StoreId")!,
				});
				const payload = res;
				dispatch(updateCartList(payload.list));
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				try {
					await changeQuantityApi(cartId, quantity - 1);

					const res = await viewCartApi({
						customerId: _id,
						storeId: global?.localStorage?.getItem("StoreId")!,
					});
					const payload = res;
					dispatch(updateCartList(payload.list));
				} catch (error) {
					console.log(error);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleRemove = async (cartId: string) => {
		try {
			await removeFromCartApi(cartId);

			const res = await viewCartApi({
				customerId: _id,
				storeId: global?.localStorage?.getItem("StoreId")!,
			});
			const payload = res;
			dispatch(updateCartList(payload.list));
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckCart = async () => {
		if (totalPrice < minimumOrderAmount) {
			alert(`the minimum order amount is ${minimumOrderAmount}`);
		} else {
			try {
				await validateCartQuantitiesApi(
					_id,
					global?.localStorage?.getItem("StoreId") ?? "",
					global?.localStorage?.getItem("locationId") ?? ""
				);

				if (couponCode !== "") {
					const res = await applyPromoV2Api(
						global?.localStorage?.getItem("StoreId") ?? "",
						couponCode,
						_id,
						global?.localStorage?.getItem("locationId") ?? ""
					);

					if (res.applyPromoV2) {
						setCartListPromo(res.applyPromoV2);
						setPromoId(res.applyPromoV2.promoId);
						setShowPlaceOrder(true);
					} else {
						setError(true);
						setErrMsg(t("Coupon code is not valid"));
					}
				} else {
					setShowPlaceOrder(true);
				}
			} catch (error) {
				setError(true);
				setErrMsg(
					"an error occured while validating cart quantities or while applying promo"
				);
				console.log(error);
			}
		}
	};

	return showPlaceOrder ? (
		<PlaceOrder
			onClose={() => setShowPlaceOrder(false)}
			promoId={promoId}
			cartListPromo={cartListPromo}
			isGift={isGift}
			gift={gift}
			specialMarks={marks}
			retry={retry}
			totalQuantity={totalQuantity}
		/>
	) : (
		<div
			className={`cart-layout`}
			style={{ color: secondrythemeColourCode }}>
			<div className="cart-header-container">
				<div
					className="cursor-pointer"
					onClick={() => router.push("/")}>
					<BackSvg />
				</div>
				<p className="cart-header-text">{t("Shopping Cart")}</p>
				<div></div>
			</div>
			{cartList.length > 0 ? (
				<>
					<p
						className="cart-header-text"
						style={{
							fontSize: 16,
							fontWeight: 400,
							margin: "15px 27px 10px",
						}}>
						{t("Gift")}
					</p>
					<div
						className="cart-header-container"
						style={{
							justifyContent: "start",
							gap: 27,
							padding: "23px 27px",
						}}>
						<GiftSvg />
						<input
							type="text"
							value={isGift ? gift : t("Is this a gift?")}
							placeholder={t("Enter you message")}
							className="cart-input"
							onChange={(e) => setGift(e.target.value)}
						/>
						<Switch
							checked={isGift}
							onChange={(e) => setIsGift(e.target.checked)}
						/>
					</div>

					<p
						className="cart-header-text"
						style={{
							fontSize: 16,
							fontWeight: 400,
							margin: "15px 27px 10px 27px",
						}}>
						{t("Promotion")}
					</p>
					<div
						className="cart-header-container"
						style={{
							justifyContent: "start",
							gap: 27,
							padding: "23px 27px",
						}}>
						<CouponSvg />
						<input
							type="text"
							placeholder={t("Enter Promotion code")}
							className="cart-input"
							value={couponCode}
							onChange={(e) => setCouponCode(e.target.value)}
						/>
					</div>

					<p
						className="cart-header-text"
						style={{
							fontSize: 16,
							fontWeight: 400,
							margin: "15px 27px 10px 27px",
						}}>
						{t("Special Remarks")}
					</p>
					<div
						className="cart-header-container"
						style={{
							justifyContent: "start",
							gap: 27,
							padding: "23px 27px",
						}}>
						<RemarksSvg />
						<input
							type="text"
							placeholder={t("Enter Your special remarks")}
							className="cart-input"
							value={marks}
							onChange={(e) => setMarks(e.target.value)}
						/>
					</div>

					<p
						className="cart-header-text"
						style={{ margin: "15px 27px 15px" }}>
						{t("Items")}
					</p>
					<div
						style={{
							width: "100%",
							backgroundColor: "white",
							padding: "27px 30px",
						}}>
						{cartList?.map((item: item, index: number) => (
							<div
								key={item._id}
								className={`flex justify-between items-start ${
									cartList.length - 1 !== index ? "border-b border-[#c4c4c4]" : ""
								} mb-[25px]`}>
								<div style={{ display: "flex", alignItems: "start", gap: 9.33 }}>
									<div>
										<img
											src={item?.image[0]?.url}
											alt="pro"
											className="w-[53.674px] h-[49.465px] rounded-[6.454]"
										/>
										<p
											className="cart-remove"
											onClick={() => handleRemove(item._id)}>
											{t("remove")}
										</p>
									</div>
									<div>
										<p className="cart-name">
											{t("local") === "ar" ? item?.productNameInArabic : item?.productName}
										</p>
										<div className="flex flex-wrap mt-1 gap-1.5">
											{item?.variantsDetails?.map((variant, index) => (
												<p className="cart-name" key={index}>
													{t("local") === "ar" ? variant?.nameInArabic : variant?.name}{" "}
													{item?.variantsDetails?.length - 1 !== index && " - "}
												</p>
											))}
										</div>
									</div>
								</div>
								<div className="flex flex-col items-center justify-around mt-2.5 gap-2">
									<p className="cart-price">
										{t("KD")} {Math.floor(item?.priceAfterDiscount * 1000) / 1000}
									</p>
									<div className="flex items-center justify-center gap-1.5">
										<p
											style={{ cursor: "pointer", padding: 0, margin: 0 }}
											onClick={() => handleMinus(item._id, item.quantity)}>
											<CartMinusSvg />
										</p>
										<div className="cart-quantity-container">
											<p className="cart-quantity">{item.quantity}</p>
										</div>
										<p
											style={{ cursor: "pointer", padding: 0, margin: 0 }}
											onClick={() => handleAdd(item)}>
											<CartAddSvg />
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="category-button-con">
						<div
							className="category-button-cart"
							style={{ backgroundColor: primaryThemeColourCode }}
							onClick={handleCheckCart}>
							<div className="category-button-qty">
								<p className="category-button-text-qty">{totalQuantity}</p>
							</div>
							<p className="category-button-text-cart">{t("Go to checkout")} </p>
							<p className="category-button-text-cart">
								{t("KWD")} {Math.floor(totalPrice * 1000) / 1000}
							</p>
						</div>
					</div>
				</>
			) : (
				<div
					className="cart-header-container"
					style={{
						justifyContent: "start",
						gap: 16,
						height: 208.426,
						marginTop: 45,
					}}>
					<img
						alt="empty-cart"
						src={emptyCartImg.src}
						style={{ width: 113.235, height: 114.064 }}
					/>
					<div>
						<p
							className="cart-header-text"
							style={{ fontSize: 16, marginBottom: 7.26 }}>
							{t("Your cart is empty")}
						</p>
						<p
							className="cart-header-text"
							style={{ fontSize: 16, marginBottom: 25 }}>
							{t("Add some items to your cart.")}
						</p>
						<div
							style={{ border: `1px solid ${primaryThemeColourCode}` }}
							onClick={() => router.push("/")}
							className="cart-shopping-btn">
							<ArrowShoppingSvg />
							<p className="cart-shopping-text">{t("Start shopping")}</p>
						</div>
					</div>
				</div>
			)}
			<Snackbar
				open={error}
				autoHideDuration={3000}
				onClose={() => {
					setErrMsg("");
					setError(false);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				<Alert
					severity="error"
					onClose={() => {
						setErrMsg("");
						setError(false);
					}}>
					{errMsg}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default NewCart;
