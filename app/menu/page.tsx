"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { BackSvg } from "@/public/assets/svgs/searchSvg";
import { MyCartSvg, MyMenuSvg, MyOrderSvg } from "@/public/assets/svgs/menuSvg";

import "./style.css";

const MenuPage = () => {
	const router = useRouter();
	const { t } = useTranslation();

	const { primaryThemeColourCode, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	return (
		<div
			className={`menu-layout`}
			style={{ color: secondrythemeColourCode }}>
			<div className="h-[60px] menu-container">
				<div
					className="cursor-pointer"
					onClick={() => router.push("/")}>
					<BackSvg />
				</div>
			</div>
			<div className="h-[60px] menu-container">
				<p className="menu-text text-[24px] font-[500px]">{t("Menu")}</p>
			</div>
			<div
				onClick={() => router.push("/my-cart?retry=false")}
				className="menu-container h-[46px] cursor-pointer">
				<MyCartSvg />
				<p className="menu-text text-[16px] font-[400px]">{t("My Cart")}</p>
			</div>
			<div
				onClick={() => router.push("/menu")}
				className="menu-container h-[46px] cursor-pointer">
				<MyMenuSvg />
				<p className="menu-text text-[16px] font-[400px]">{t("Menu")}</p>
			</div>
			<div
				onClick={() => router.push("/my-orders")}
				className="menu-container h-[46px] cursor-pointer">
				<MyOrderSvg />
				<p className="menu-text text-[16px] font-[400px]">{t("My Orders")}</p>
			</div>
		</div>
	);
};

export default MenuPage;
