import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";

import "./style.css";
import Slider from "react-slick";
import { BagSvg, MenuSvg, SearchSvg } from "@/public/assets/svgs/headerSvg";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { banner, primaryThemeColourCode } = useSelector(
    (state: RootState) => state.StoreReducer.customerDetails
  );
  const settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const changeLanguage = () => {
    let lng = "en";
    if (global?.localStorage?.getItem("i18nextLng") === "ar") {
      lng = "en";
    } else {
      lng = "ar";
    }

    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div
      className={`new-header-layout ${
        t("local") === "ar" ? "left-0" : "right-0"
      }`}
    >
      <div className="relative">
        <>
        {<Slider {...settings}>
          {banner?.map((slider: any, index: number) => {
            return (
              <div key={index}>
                <Link href="#">
                  {slider === "" ? (
                    <img
                      src="images/slider1.png"
                      alt="url empty"
                      className="min-h-screen object-cover w-full"
                    />
                  ) : (
                    <img
                      src={slider}
                      alt="banner-slider"
                      className="min-h-screen object-cover w-full"
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </Slider>}
        </>
        <div
          className={`flex items-center gap-[25px] absolute top-[15px] ${
            t("local") === "ar" ? "right-[50px]" : "left-[50px]"
          }`}
        >
          <Link href="/my-cart?retry=false">
            <BagSvg />
          </Link>
          <Link href="/menu">
            <MenuSvg />
          </Link>
          <Link href="/search">
            <SearchSvg />
          </Link>
          <div
            className="new-header-local"
            style={{ color: primaryThemeColourCode }}
            onClick={changeLanguage}
          >
            {t("ع")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
