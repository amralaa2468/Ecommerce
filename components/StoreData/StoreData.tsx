import React, { useEffect } from "react";
import { useStoreData } from "./storeData.hooks";
import "./style.css";
import { useTranslation } from "react-i18next";

const StoreData = () => {
  const { loader, storeLogo } = useStoreData();
  const { t,i18n } = useTranslation();

  useEffect(() => {
    let lng = global?.localStorage?.getItem("i18nextLng") ?? "";

    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  },[]);

  return (
    <div>
      {loader && (
        <div className="ayoub-loader">
          {storeLogo && (
            <img
              alt="logo"
              src={storeLogo}
              style={{
                width: 200,
                height: 200,
                borderRadius: 50,
                marginBottom: 60,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StoreData;
