"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
import { useTranslation } from "react-i18next";
import { updateCartList } from "@/redux/reducers/storeReducer";
import { useNewCategory } from "./new-category.hooks";
import {
	addToCartApi,
	changeQuantityApi,
	removeFromCartApi,
} from "./new-category.container";

import {
	BackSvg,
	SearchMinusSvg,
	SearchPlusSvg,
} from "@/public/assets/svgs/searchSvg";
import "./style.css";
import { viewCartApi } from "@/components/StoreData/storeData.container";

interface item {
	_id: string;
	productId: string;
	quantity: number;
}

interface product {
	priceAfterDiscount: number;
	quantity: number;
}

const calculateTotal = (cartList: any) => {
	const totalPrice = cartList.reduce((total: number, product: product) => {
		return total + product.priceAfterDiscount * product.quantity;
	}, 0);

	const totalQuantity = cartList.reduce((total: number, product: product) => {
		return total + product.quantity;
	}, 0);

	return { totalPrice, totalQuantity };
};

const NewCategoryPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();

	const categoryId = params?.categoryId;
	const categoryName = searchParams?.get("name");

	const { productList, loading } = useNewCategory(categoryId);

	const dispatch = useAppDispatch();
	const cartList = useSelector(
		(state: RootState) => state.StoreReducer.cartList
	);
	const { _id, primaryThemeColourCode, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);

	useEffect(() => {
		const { totalPrice, totalQuantity } = calculateTotal(cartList);

		setTotalPrice(totalPrice);
		setTotalQuantity(totalQuantity);
	}, [cartList]);

	const handleAdd = async (id: string, count: number) => {
		try {
			if (count === 0) {
				await addToCartApi(
					_id,
					id,
					[],
					1,
					"",
					global?.localStorage?.getItem("locationId") ?? ""
				);
				try {
					const res = await viewCartApi({
						customerId: _id,
						storeId: global?.localStorage?.getItem("StoreId")!,
					});
					try {
						const payload = res;
						dispatch(updateCartList(payload.list));
					} catch (error) {
						console.log(error);
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				router.push(`/product/${id}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleMinus = async (id: string) => {
		const item = cartList?.find((item: item) => item.productId === id);
		if (item.quantity === 1) {
			try {
				await removeFromCartApi(item._id);
				try {
					const res = await viewCartApi({
						customerId: _id,
						storeId: global?.localStorage?.getItem("StoreId")!,
					});
					try {
						const payload = res;
						dispatch(updateCartList(payload.list));
					} catch (error) {}
				} catch (error) {}
			} catch (error) {}
		} else {
			try {
				await changeQuantityApi(item._id, item.quantity - 1);
				try {
					const res = await viewCartApi({
						customerId: _id,
						storeId: global?.localStorage?.getItem("StoreId")!,
					});
					try {
						const payload = res;
						dispatch(updateCartList(payload.list));
					} catch (error) {}
				} catch (error) {}
			} catch (error) {}
		}
	};

	return (
		<div
			className={`category-layout`}
			style={{ color: secondrythemeColourCode }}>
			<div className="category-container">
				<div
					className="cursor-pointer my-0 mx-[7x]"
					onClick={() => router.push("/")}>
					<BackSvg />
				</div>
				<h1 className="category-header">{categoryName}</h1>
				<div> </div>
			</div>

			<div className="py-[60px] px-[40px] flex items-start justify-center flex-wrap gap-[20px]">
				{productList?.length > 0 ? (
					productList?.map((product) => (
						<div
							key={product?._id}
							style={{ width: 246 }}
							className="category-item w-[246px]">
							<img
								src={product?.image[0]?.url}
								onClick={() => router.push(`/product/${product?._id}`)}
								alt="product"
								className="cat-image-height"
                style={{
                  width: "100%",
                  borderRadius: 5,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
							/>
							<p className="category-name">{product?.productName}</p>
							<div
								style={{ display: "flex", alignItems: "center", gap: 8 }}
								className="cat-container">
								{product?.priceAfterDiscount === product?.price ? (
									""
								) : (
									<del className="category-price">
										{t("KD")} {product?.price}
									</del>
								)}
								<p className="category-price">
									{t("KD")} {product?.priceAfterDiscount}
								</p>
							</div>
							{product?.isUnlimited || product?.quantity > 0 ? (
								cartList?.some((item: item) => item.productId === product._id) ? (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											gap: "20px",
											width: "100%",
										}}>
										<p
											style={{ cursor: "pointer", padding: 0, margin: 0 }}
											onClick={() => handleMinus(product._id)}>
											<SearchMinusSvg />
										</p>
										<div className="category-product-quantity-container">
											<p className="category-product-quantity">
												{
													cartList?.find((item: item) => item.productId === product._id)
														.quantity
												}
											</p>
										</div>
										<p
											style={{ cursor: "pointer", padding: 0, margin: 0 }}
											onClick={() => handleAdd(product._id, 0)}>
											<SearchPlusSvg />
										</p>
									</div>
								) : (
									<div
										className="category-button"
										onClick={() => handleAdd(product._id, product.variantsCount)}
										style={{ border: `1px solid ${primaryThemeColourCode}` }}>
										<p className="category-button-text">+ {t("Add")}</p>
									</div>
								)
							) : (
								<div
									className="category-button"
									style={{ border: `1px solid ${primaryThemeColourCode}` }}>
									<p className="category-button-text">{t("Out of stock")}</p>
								</div>
							)}
						</div>
					))
				) : (
					<p className="category-header">
						{loading ? t("loading") : t("No products")}
					</p>
				)}
			</div>

			{cartList.length > 0 && (
				<div className="category-button-con">
					<div
						onClick={() => router.push("/my-cart?retry=false")}
						className="category-button-cart"
						style={{ backgroundColor: primaryThemeColourCode }}>
						<div className="category-button-qty">
							<p className="category-button-text-qty">{totalQuantity}</p>
						</div>
						<p className="category-button-text-cart">{t("Go to checkout")} </p>
						<p className="category-button-text-cart">
							{t("KDW")} {Math.floor(totalPrice * 1000) / 1000}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default NewCategoryPage;
