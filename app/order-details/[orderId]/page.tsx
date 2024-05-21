"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import moment from "moment";

import { useOrderDetails } from "./order-details.hooks";
import { customerArrivedNotificationApi } from "./order-details.container";

import orderConfirmImg from "@/public/assets/svgs/images/orderConfirm.png";
import addressImg from "@/public/assets/svgs/images/address.png";
import contactImg from "@/public/assets/svgs/images/cantact.png";
import {
  AlarmSvg,
  BackSvg,
  LocationSvg,
  RightSvg,
  WalletSvg,
  WrongSvg,
} from "@/public/assets/svgs/searchSvg";
import "./style.css";

const NewOrderDetails = () => {
  const { t } = useTranslation();
  const params = useParams();

  const orderId: string = params?.orderId as string;
  const { orderDetails } = useOrderDetails(orderId);
  const [showMsg, setShowMsg] = useState(false);

  const { primaryThemeColourCode, secondrythemeColourCode } = useSelector(
    (state: RootState) => state.StoreReducer.customerDetails
  );

  const handleNotify = async () => {
    try {
      await customerArrivedNotificationApi(orderId);
      setShowMsg(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`details-layout`}
      style={{ color: secondrythemeColourCode }}
    >
      <div className="details-container">
        <Link href="/" className="cursor-pointer">
          <BackSvg />
        </Link>
      </div>

      <div className="order-confirm">
        <img
          alt="confirm"
          className="h-[118px] w-[118px]"
          src={orderConfirmImg.src}
        />
        <div className="flex flex-col gap-2.5 items-start">
          <p
            className={`details-header`}
            style={{ fontSize: 24, fontWeight: 700 }}
          >
            {t("Order Confirmation")}
          </p>
          <p className="details-text">
            {t("Your order has been placed and will be delivered to you soon.")}
          </p>
          <p className="details-header">
            {t("Tracking ID")}{" "}
            <span className="details-text">#{orderDetails?.orderId}</span>
          </p>
          <p className="details-header">
            {t("Expected delivery date and time")}
          </p>
          <p className="details-text">
            {moment(parseInt(orderDetails?.expectedArrivingTime ?? "")).format(
              "DD/MMM HH:mm a"
            )}
          </p>
        </div>
      </div>

      <div className="deliver-container">
        {orderDetails?.orderType === "normal" ? (
          <div className="flex flex-col gap-1.5 items-start">
            <p className="deliver-text">{t("Deliver to")}</p>
            <div className="flex items-center gap-[19px] mb-1.5">
              <img alt="address" src={addressImg.src} className="w-6 h-6" />
              <p className="deliver-text">
                {orderDetails?.addressInfo?.state},{" "}
                {orderDetails?.addressInfo?.block},{" "}
                {orderDetails?.addressInfo?.street},{" "}
                {orderDetails?.addressInfo?.building},{" "}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <img alt="address" src={contactImg.src} className="w-6 h-6" />
              <p className="deliver-text">{orderDetails?.phoneNumber}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-[5px] items-center">
              <LocationSvg />
              <p className="deliver-text">{t("Pick up from Branch name")}</p>
            </div>
            <div className="my-0 mx-[22px]">
              <p className="deliver-text">{t("Have you arrived?")} </p>
              {/* <div
								className="notify-btn"
								onClick={orderDetails?.deliveryStatus !== "delivered" && handleNotify}
								style={{
									backgroundColor:
										orderDetails?.deliveryStatus === "delivered"
											? "#C4C4C4"
											: primaryThemeColourCode,
									color: orderDetails?.deliveryStatus === "delivered" && "white",
								}}> */}
              <div
                className={`notify-btn ${
                  orderDetails?.deliveryStatus === "delivered"
                    ? "bg-[#C4C4C4]"
                    : `bg-[${primaryThemeColourCode}]`
                } ${
                  orderDetails?.deliveryStatus === "delivered"
                    ? "text-white"
                    : ""
                }`}
                onClick={
                  orderDetails?.deliveryStatus !== "delivered"
                    ? handleNotify
                    : undefined
                }
              >
                <AlarmSvg />
                <p className="notify-text">{t("Notify us")}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="deliver-text ml-7">{t("Items")}</p>
      <div className="product-container">
        {orderDetails?.productInfo?.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-[5px]"
          >
            <p
              className="details-header"
              style={{ fontSize: 14, fontWeight: 400 }}
            >
              <span className="product-quantity">x{product.quantity}</span>
              <span className="my-0 mx-[69px]">{product?.productName}</span>
            </p>
            <p
              className="details-header"
              style={{ fontSize: 14, fontWeight: 400 }}
            >
              {product?.price} {t("KWD")}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between mt-[18px]">
          <p
            className="details-header"
            style={{ fontSize: 15, fontWeight: 500 }}
          >
            {t("Total")}
          </p>
          <p
            className="details-header"
            style={{ fontSize: 15, fontWeight: 500 }}
          >
            {orderDetails?.orderTotal} {t("KWD")}
          </p>
        </div>
      </div>

      <p className="deliver-text ml-7">{t("Payment Method")}</p>
      <div className="method-container">
        <WalletSvg />
        <div className="method-input">
          <p>{orderDetails?.paymentMethod}</p>
        </div>
      </div>

      {showMsg && (
        <div className="msg-container">
          <div className="flex items-center gap-2">
            <RightSvg />
            <p className="msg-text">{t("The branch has been notified")}</p>
          </div>
          <div className="cursor-pointer" onClick={() => setShowMsg(false)}>
            <WrongSvg />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrderDetails;
