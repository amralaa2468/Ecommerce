"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import StoreData from "@/components/StoreData/StoreData";
import Navbar from "../Navbar/Navbar";
import { Roboto, Alexandria } from "next/font/google";
import "@/i18n";
import { useTranslation } from "react-i18next";
import HightLight from "../HighLight/HightLight";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const alexandria = Alexandria({ subsets: ["arabic"] });

const CustomProvider = ({ child }: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { t } = useTranslation();
  return mounted ? (
    <Provider store={store}>
      <div
        className={
          t("local") === "ar" ? alexandria.className : roboto.className
        }
      >
        <StoreData />
        <Navbar />
        <HightLight />
        {child}
      </div>
    </Provider>
  ) : (
    <></>
  );
};

export default CustomProvider;
