"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";

import emptyCartImg from "@/public/assets/svgs/images/emptyCart.png";
import { BackSvg } from "@/public/assets/svgs/searchSvg";
import { MyOrdersSearchSvg } from "@/public/assets/svgs/cartSvg";
import "./style.css";

interface item {
	_id: string;
	orderId: string;
	orderPlacedAt: Date;
	orderType: string;
	orderTotal: string;
}

const NewMyOrder = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const orderList = useSelector(
		(state: RootState) => state.StoreReducer.orderList
	);

	const [searchInput, setSearchInput] = useState("");
	const filteredOrders = orderList.filter((item: item) =>
		item.orderId.toLowerCase().includes(searchInput.toLowerCase())
	);
	const { primaryThemeColourCode, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);

	return (
		<div
			className={`myorders-layout`}
			style={{ color: secondrythemeColourCode }}>
			<div className="myorders-header-container">
				<div
					className="cursor-pointer"
					onClick={() => router.replace("/")}>
					<BackSvg />
				</div>
				<p className="myorders-header-text">{t("Your past orders")}</p>
			</div>
			<div className="myorders-container">
				<p
					className="myorders-header-text"
					style={{ fontSize: 20, marginBottom: 8 }}>
					{t("Your past orders")}
				</p>
				<p
					className="myorders-header-text"
					style={{ fontSize: 15, fontWeight: 300, marginBottom: 8 }}>
					{t("Have a tracking code? Enter it below")}
				</p>
				<div className="flex items-center gap-[13px] py-[10px] px-[2px] border-b border-[#c4c4c4]">
					<MyOrdersSearchSvg />
					<input
						type="text"
						placeholder={t("Search...")}
						className="myorders-search-container"
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>

				<div className={`mt-10 ${filteredOrders.length === 0 && "hidden"}`}>
					{filteredOrders?.map((item: any, index: number) => (
						<div
							className={`flex items-center justify-between mb-[10px] pb-[10px] border-b ${
								filteredOrders.length - 1 !== index && "border-b-[#C4C4C4]"
							}`}>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<p
									className="myorders-header-text"
									style={{ fontSize: 16 }}>
									#{item?.orderId}
								</p>
								<p
									className="myorders-header-text"
									style={{ fontSize: 15, fontWeight: 300 }}>
									{moment(parseInt(item?.orderPlacedAt)).format("DD/MMM HH:MM a")}
								</p>
								<p
									className="myorders-header-text"
									style={{ fontSize: 15, fontWeight: 300 }}>
									{item?.orderType === "pickup"
										? t("Pick up order")
										: t("Delivery order")}
								</p>
								<p
									className="myorders-header-text"
									style={{ fontSize: 15, fontWeight: 300 }}>
									{t("Total")}: {item?.orderTotal} {t("KWD")}
								</p>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
								<div
									className="myorders-button"
									onClick={() => router.push("/order-details/" + item._id)}
									style={{ backgroundColor: primaryThemeColourCode }}>
									<p className="myorders-button-text">{t("Track your order")}</p>
								</div>
								<div
									className="myorders-button"
									style={{ backgroundColor: primaryThemeColourCode }}>
									<p className="myorders-button-text">{t("Re-order")}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div
				style={{
					marginTop: 92,
					display: filteredOrders.length !== 0 ? "none" : "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 10,
				}}>
				<img
					alt="empty-cart"
					src={emptyCartImg.src}
					style={{ width: 110, height: 110 }}
				/>
				<p
					className="myorders-header-text"
					style={{ fontSize: 16, fontWeight: 400 }}>
					{t("You don't have any past orders")}
				</p>
			</div>
		</div>
	);
};

export default NewMyOrder;
