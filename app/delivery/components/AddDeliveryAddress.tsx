"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";

import {
	getStatesApi,
	deliveryAddressApi,
	getShippingFeeApi,
	estimateDeliveryFeeApi,
} from "../delivery.container";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { HomeSvg, ApartmentSvg } from "@/public/assets/svgs/ecomLogoSvg";
import officeImg from "@/public/assets/svgs/images/office.png";
import "../style.css";

interface CustomFormProps {
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
}

interface AddDeliveryAddressProps {
	cityList: any;
	details: any;
	countryId: string;
	onSave: (
		serviceDeliveryFeeOrShippingDeliveryFee: number,
		deliveryAddressId: string,
		data: any
	) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({
	label,
	value,
	onChange,
	name,
}) => {
	return (
		<div className="address-form">
			<p className="address-form-text">{label}</p>
			<input
				type="text"
				value={value}
				name={name}
				onChange={onChange}
				className="address-form-input"
			/>
		</div>
	);
};

export const AddDeliveryAddress: React.FC<AddDeliveryAddressProps> = ({
	cityList,
	details,
	countryId,
	onSave,
}) => {
	const { t } = useTranslation();
	const { _id, primaryThemeColourCode, enableMashkoor, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);
	
	const [data, setData] = useState({
		_id: "",
		stateId: "",
		cityId: "",
		countryId: "",
		type: "home",
		block: "",
		street: "",
		avenue: "",
		houseNo: "",
		apartmentNo: "",
		floorNo: "",
		officeNo: "",
		specialDirection: "",
	});
	const [stateList, setStateList] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (details?.addressDetails) {
			setData(details?.addressDetails);
		}
	}, [details]);

	const handleCities = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === "") {
			setStateList([]);
		} else {
			try {
				const res = await getStatesApi(
					"",
					id,
					global?.localStorage?.getItem("StoreId")!
				);
				setStateList(
					res.filter(
						(state: { nameInArabic: string }) => state.nameInArabic !== null
					)
				);

				setData({ ...data, cityId: id });
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async () => {
		let valid = true;
		if (data.cityId === "") {
			valid = false;
			setErrorMsg(t("should select the governance"));
			setIsError(true);
		} else if (data.stateId === "") {
			valid = false;
			setErrorMsg(t("should select the city"));
			setIsError(true);
		} else if (data.block === "") {
			valid = false;
			setErrorMsg(t("should select the block"));
			setIsError(true);
		} else if (data.street === "") {
			valid = false;
			setErrorMsg(t("should select the street"));
			setIsError(true);
		} else if (data.houseNo === "") {
			valid = false;
			setErrorMsg(t("should select the Building No."));
			setIsError(true);
		} else if (
			data.type === "apartment" &&
			data.apartmentNo === "" &&
			data.floorNo === ""
		) {
			valid = false;
			setErrorMsg(t("should select the Apartment No. and Floor No."));
			setIsError(true);
		} else if (
			data.type === "office" &&
			data.officeNo === "" &&
			data.floorNo === ""
		) {
			valid = false;
			setErrorMsg(t("should select the Office No. and Floor No."));
			setIsError(true);
		}

		if (valid) {
			const customerid = _id;
			try {
				const addRes = await deliveryAddressApi(
					customerid,
					data.stateId,
					data.cityId,
					countryId,
					data.type,
					data.block,
					data.street,
					data.avenue,
					data.houseNo,
					data.apartmentNo,
					data.floorNo,
					data.officeNo,
					data.specialDirection,
					"",
					"",
					""
				);
				if (enableMashkoor) {
					const res = await estimateDeliveryFeeApi(
						global?.localStorage?.getItem("StoreId")!,
						customerid
					);

					onSave(
						res?.service_delivery_fee ? res?.service_delivery_fee : 0,
						addRes._id,
						data
					);
				} else {
					try {
						const res = await getShippingFeeApi(
							global?.localStorage?.getItem("StoreId")!,
							data.stateId
						);

						onSave(
							res?.cost ? res?.cost : details?.storeDeliveryDetails?.costOfDelivery,
							addRes._id,
							data
						);
					} catch (error) {
						console.log(error);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div style={{ color: secondrythemeColourCode }} className="bg-white min-h-screen pt-5 pb-[70px]">
			<div className="flex gap-5 items-center justify-center my-[15px] mx-0">
				<div
					className="address-type"
          style={{
            opacity: data.type === "home" ? 1 : 0.5,
            backgroundColor: data.type === "home" && primaryThemeColourCode,
          }}
					onClick={() => setData({ ...data, type: "home" })}>
					<HomeSvg />
					<p className="address-type-text">{t("Home")}</p>
				</div>
				<div
					className="address-type"
          style={{
            opacity: data.type === "apartment" ? 1 : 0.5,
            backgroundColor: data.type === "apartment" && primaryThemeColourCode,
          }}
					onClick={() => setData({ ...data, type: "apartment" })}>
					<ApartmentSvg />
					<p className="address-type-text">{t("Apartment")}</p>
				</div>
				<div
					className="address-type"
          style={{
            opacity: data.type === "office" ? 1 : 0.5,
            backgroundColor: data.type === "office" && primaryThemeColourCode,
          }}
					onClick={() => setData({ ...data, type: "office" })}>
					<img
						src={officeImg.src}
						className="w-[30px] h-[30px]"
						alt="office"
					/>
					<p className="address-type-text">{t("Office")}</p>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 4,
					alignItems: "center",
				}}>
				<select
					className="address-form"
					onChange={handleCities}
					style={{padding: "25px 24px"}}>
					{details?.addressDetails !== null && (details?.addressDetails.city !== null ||
					details?.addressDetails.city !== '') ? (
						<option value={details?.addressDetails.city}>
							{t('local') === 'ar' ? details?.addressDetails.cityInArabic : details?.addressDetails.city}
						</option>
					) : (
						<option value=''>{t('Government')}</option>
					)}
					{cityList?.map(
						(city: { _id: string; nameInArabic: string; name: string }) => (
							<option
								key={city._id}
								value={city._id}>
								{t("local") === "ar" ? city.nameInArabic : city.name}
							</option>
						)
					)}
				</select>

				<select
					className="address-form"
					name="stateId"
					style={{padding: "25px 24px"}}
					onChange={handleSelectChange}>
					{details?.addressDetails !== null && (details?.addressDetails.state !== null ||
					details?.addressDetails.state !== '') ? (
						<option value={details?.addressDetails.state}>
							{t('local') === 'ar' ? details?.addressDetails.stateInArabic : details?.addressDetails.state}
						</option>
					) : (
						<option>{t('City')}</option>
					)}
					{stateList?.map(
						(state: { _id: string; nameInArabic: string; name: string }) => (
							<option
								key={state._id}
								value={state._id}>
								{t("local") === "ar" ? state.nameInArabic : state.name}
							</option>
						)
					)}
				</select>

				<CustomForm
					label={t("Block")}
					name="block"
					value={data?.block}
					onChange={handleInputChange}
				/>
				<CustomForm
					label={t("Street")}
					name="street"
					value={data?.street}
					onChange={handleInputChange}
				/>
				<CustomForm
					label={t("Avenue (optional)")}
					name="avenue"
					value={data?.avenue}
					onChange={handleInputChange}
				/>
				<CustomForm
					label={t("Building No.")}
					name="houseNo"
					value={data?.houseNo}
					onChange={handleInputChange}
				/>
				{data.type === "apartment" && (
					<CustomForm
						label={t("Apartment No.")}
						name="apartmentNo"
						value={data?.apartmentNo}
						onChange={handleInputChange}
					/>
				)}
				{data.type === "office" && (
					<CustomForm
						label={t("Office No.")}
						name="officeNo"
						value={data?.officeNo}
						onChange={handleInputChange}
					/>
				)}
				{data.type !== "home" && (
					<CustomForm
						label={t("Floor")}
						name="floorNo"
						value={data?.floorNo}
						onChange={handleInputChange}
					/>
				)}
				<CustomForm
					label={t("Additional Directions (optional)")}
					name="specialDirection"
					value={data.specialDirection}
					onChange={handleInputChange}
				/>
			</div>

			{/* <div style={{ position: "fixed", bottom: 0, width: "100%", height: 60 }}>
        <div
          className="button-container"
          onClick={handleSubmit}
          style={{ backgroundColor: primaryThemeColourCode }}
        >
          <p className="pickup-time" style={{ margin: 0 }}>
            {t("Next")}
          </p>
        </div>
      </div> */}

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
