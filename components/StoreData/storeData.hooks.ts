"use client";

import { useEffect, useState } from "react";
import {
  getStoreIdFromDomainApi,
  generateUUIDApi,
  signUpLoginApi,
  viewCartApi,
  myOrdersApi,
  landingPageApi,
} from "./storeData.container";
import {
  updateCustomerDetails,
  updateCartList,
  updateOrderList,
  updateCatList,
} from "@/redux/reducers/storeReducer";
import { useAppDispatch } from "@/redux/store";

export const useStoreData = () => {
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(true);
  const [storeLogo, setStoreLogo] = useState<any>(null);
  const location = decodeURIComponent(window.location.href);
  const WebsiteUrl = location.split("/");
  
  const getStoreData = async () => {
    try {
      // const storeId = await getStoreIdFromDomainApi(WebsiteUrl[2]);
      const storeId = await getStoreIdFromDomainApi('ecom-payment.ecomtestkw.com');
      global?.localStorage?.setItem("StoreId", storeId);

      let token;
      if (global?.localStorage?.getItem("token")) {
        token = global?.localStorage?.getItem("token");
      } else {
        token = await generateUUIDApi();
        global?.localStorage?.setItem("token", token);
      }

      const loginData = await signUpLoginApi({
        language: "english",
        deviceToken: token,
        storeId: storeId,
      });

      setStoreLogo(loginData.logo);

      const catData = await landingPageApi(storeId);

      const cartData = await viewCartApi({
        customerId: loginData._id,
        storeId: storeId,
      });

      const ordersData = await myOrdersApi({
        storeId: storeId,
        customerId: loginData._id,
      });

      dispatch(updateCustomerDetails(loginData));
      dispatch(updateCatList(catData));
      dispatch(updateCartList(cartData.list));
      dispatch(updateOrderList(ordersData));
    } catch {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getStoreData();
  }, []);
  return { loader, storeLogo };
};
