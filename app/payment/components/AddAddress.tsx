"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, ReactNode } from "react";

import { getStatesApi, updateTempOrderAddressApi } from "../payment.container";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  BackArrowSvg,
  HomeSvg,
  ApartmentSvg,
} from "@/public/assets/svgs/ecomLogoSvg";
import officeImg from "@/public/assets/svgs/images/office.png";
import "../style.css";

interface CustomFormProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

interface AddAddressProps {
  onClose: () => void;
  cityList: any[];
  details: any;
  countryId: string;
  onSave: (price: number) => void;
}

interface State {
  _id: string;
  name: string;
  nameInArabic: string;
  cityId: string;
}

type data = {
  _id: string;
  stateId: string;
  cityId: string;
  countryId: string;
  type: string;
  block: string;
  street: string;
  avenue: string;
  houseNo: string;
  apartmentNo: string;
  floorNo: string;
  officeNo: string;
  specialDirection: string;
  postalCode: string;
  longitude: string;
  latitude: string;
};

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

export const AddAddress: React.FC<AddAddressProps> = ({
  onClose,
  cityList,
  details,
  countryId,
  onSave,
}) => {
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
    postalCode: "",
    longitude: "",
    latitude: "",
  });
  const [stateList, setStateList] = useState<State[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);

  useEffect(() => {
    setData({ ...data, _id: details._id, countryId: countryId });
  }, [details._id, countryId]);

  const handleCities = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === "") {
      setStateList([]);
    } else {
      try {
        const res = await getStatesApi(
          "",
          id,
          global?.localStorage?.getItem("StoreId") ?? ""
        );

        setStateList(
          res.getStates.filter((state: State) => state.nameInArabic !== null)
        );
        setData({ ...data, cityId: id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    let valid = true;
    if (data.cityId === "") {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the governance");
    } else if (data.stateId === "") {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the city");
    } else if (data.block === "") {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the block");
    } else if (data.street === "") {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the street");
    } else if (data.houseNo === "") {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the Building No.");
    } else if (
      data.type === "apartment" &&
      data.apartmentNo === "" &&
      data.floorNo === ""
    ) {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the Apartment No. and Floor No.");
    } else if (
      data.type === "office" &&
      data.officeNo === "" &&
      data.floorNo === ""
    ) {
      valid = false;
			setOpenError(true);
      setErrorMsg("should select the Office No. and Floor No.");
    }

    if (valid) {
      try {
        const res = await updateTempOrderAddressApi(data);
        if (res) {
          onSave(res.updateTempOrderAddress.shippingCharge);
        } else {
          setOpenError(true);
          setErrorMsg("we dont cover this area");
        }
      } catch {}
    }
  };

  return (
    <div className="address-layout bg-white">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={onClose}>
          <BackArrowSvg />
        </div>
        <p className="address-header">Address</p>
        <div></div>
      </div>

      <div className="flex items-center justify-center gap-5 my-[15px] mx-0">
        <div
          className={`address-type ${
            data.type === "home" ? "opacity-100" : "opacity-40"
          } transition-opacity duration-300`}
          onClick={() => setData({ ...data, type: "home" })}
        >
          <HomeSvg />
          <p className="address-type-text">Home</p>
        </div>
        <div
          className={`address-type ${
            data.type === "apartment" ? "opacity-100" : "opacity-40"
          } transition-opacity duration-300`}
          onClick={() => setData({ ...data, type: "apartment" })}
        >
          <ApartmentSvg />
          <p className="address-type-text">Apartment</p>
        </div>
        <div
          className={`address-type ${
            data.type === "office" ? "opacity-100" : "opacity-40"
          } transition-opacity duration-300`}
          onClick={() => setData({ ...data, type: "office" })}
        >
          <img
            src={officeImg.src}
            alt="office"
            style={{ width: 30, height: 30 }}
          />
          <p className="address-type-text">Office</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        <select className="address-form" onChange={handleCities}>
          <option value="">Government</option>
          {cityList?.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          className="address-form"
          name="stateId"
          onChange={handleSelectChange}
        >
          <option>City</option>
          {stateList?.map((state) => (
            <option key={state._id} value={state._id}>
              {state.name}
            </option>
          ))}
        </select>

        <CustomForm
          label="Block"
          name="block"
          value={data?.block}
          onChange={handleInputChange}
        />
        <CustomForm
          label="Street"
          name="street"
          value={data?.street}
          onChange={handleInputChange}
        />
        <CustomForm
          label="Avenue (optional)"
          name="avenue"
          value={data?.avenue}
          onChange={handleInputChange}
        />
        <CustomForm
          label="Building No."
          name="houseNo"
          value={data?.houseNo}
          onChange={handleInputChange}
        />
        {data.type === "apartment" && (
          <CustomForm
            label="Apartment No."
            name="apartmentNo"
            value={data?.apartmentNo}
            onChange={handleInputChange}
          />
        )}
        {data.type === "office" && (
          <CustomForm
            label="Office No."
            name="officeNo"
            value={data?.officeNo}
            onChange={handleInputChange}
          />
        )}
        {data.type !== "home" && (
          <CustomForm
            label="Floor"
            name="floorNo"
            value={data?.floorNo}
            onChange={handleInputChange}
          />
        )}
        <CustomForm
          label="mobile No."
          value={details?.phoneNumber}
          onChange={() => {}}
          name=""
        />
        <CustomForm
          label="Additional Directions (optional)"
          name="specialDirection"
          value={data.specialDirection}
          onChange={handleInputChange}
        />
      </div>
      <p className="address-form-button" onClick={handleSubmit}>
        Save
      </p>

      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setOpenError(false)}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};
