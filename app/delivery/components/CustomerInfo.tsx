"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { personalDetailsApi } from "../delivery.container";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "../style.css";

interface CustomerInfoProps {
	onSave: ({ phoneNumber, name }: any) => void;
	cartData: any;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
	onSave,
	cartData,
}) => {
	const { t } = useTranslation();
	const { primaryThemeColourCode, _id, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);
	const [data, setData] = useState({
		name: "",
		email: "",
		phoneNumber: "",
	});
	const [errorMsg, setErrorMsg] = useState("");
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (cartData?.customerDetails) {
			setData(cartData.customerDetails);
		}
	}, [cartData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		let valid = true;
		if (data.name === "") {
			valid = false;
			setErrorMsg(t("Name is required"));
			setIsError(true);
		} else if (data.phoneNumber === "") {
			valid = false;
			setErrorMsg(t("Phone Number is required"));
			setIsError(true);
		}

		if (valid) {
			try {
				await personalDetailsApi(_id, data.phoneNumber, data.email, data.name);

				onSave({ phoneNumber: data.phoneNumber, name: data.name });
			} catch (error) {
				setErrorMsg("An error occured while getting personal details.");
				setIsError(true);
			}
		}
	};

	return (
		<div style={{ color: secondrythemeColourCode }} className="min-h-screen bg-white w-full flex flex-col items-center pt-[50px]">
			<input
				type="text"
				value={data?.name}
				name="name"
				onChange={handleChange}
				className="customer-input"
				placeholder={t("Name*")}
			/>
			<input
				type="text"
				value={data?.email}
				name="email"
				onChange={handleChange}
				className="customer-input"
				placeholder={t("Email (for your invoice)")}
			/>
			<input
				type="text"
				value={data?.phoneNumber}
				name="phoneNumber"
				onChange={handleChange}
				className="customer-input"
				placeholder={t("Phone*")}
			/>

			<div className="customer-button-container">
				<div
					className="customer-button"
					style={{ backgroundColor: primaryThemeColourCode }}
					onClick={handleSubmit}>
					<p
						className="customer-button"
						style={{ padding: 0, margin: 0 }}>
						{t("Next")}
					</p>
				</div>
			</div>

			<Snackbar
				open={isError}
				autoHideDuration={3000}
				onClose={() => {
					setErrorMsg("");
					setIsError(false);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				<Alert
					severity="error"
					onClose={() => {
						setErrorMsg("");
						setIsError(false);
					}}>
					{errorMsg}
				</Alert>
			</Snackbar>
		</div>
	);
};
