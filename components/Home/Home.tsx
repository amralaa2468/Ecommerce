"use client";

import React, { useState, useEffect } from "react";
import "./style.css";
import {
  CardsSvg,
  CartSvg,
  ClockSvg,
  DotsSvg,
  VectorSvg,
} from "@/public/assets/svgs/homeSvg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
import { SearchMinusSvg, SearchPlusSvg } from "@/public/assets/svgs/searchSvg";
import { useTranslation } from "react-i18next";
import { BagSvg, MenuSvg, SearchSvg } from "@/public/assets/svgs/headerSvg";
import Slider from "react-slick";
import Link from "next/link";
import { viewCartApi } from "../StoreData/storeData.container";
import {
  addToCartApi,
  changeQuantityApi,
  removeFromCartApi,
} from "@/app/my-cart/my-cart.container";
import { useRouter } from "next/navigation";
import { updateCartList } from "@/redux/reducers/storeReducer";

const calculateTotal = (cartList: any) => {
  const totalPrice = cartList.reduce((total: any, product: any) => {
    return total + product.priceAfterDiscount * product.quantity;
  }, 0);

  return { totalPrice };
};

const Theme1 = () => {
  const bgImg =
    "https://ecomlive.s3.amazonaws.com/services/a3vPehFEbC6ToHxiNgbi.jpeg";
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const categories = useSelector((state: RootState) =>
    state.StoreReducer.catList.filter(
      (item: any) => item.name !== "All Products"
    )
  );
  const dispatch = useAppDispatch();
  const cartList = useSelector(
    (state: RootState) => state.StoreReducer.cartList
  );
  const {
    _id,
    themeLayout,
    primaryThemeColourCode,
    secondrythemeColourCode,
    banner,
    storeName,
    logo,
    storeNameInArabic,
  } = useSelector((state: RootState) => state.StoreReducer.customerDetails);
  const settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const { totalPrice } = calculateTotal(cartList);

    setTotalPrice(totalPrice);
  }, [cartList]);

  const handleAdd = async (id: string, e: any, count: number) => {
    e.preventDefault();
    if (count === 0) {
      try {
        await addToCartApi(
          _id,
          id,
          [],
          1,
          "",
          global?.localStorage?.getItem("locationId")!
        );

        const res = await viewCartApi({
          customerId: _id,
          storeId: global?.localStorage?.getItem("StoreId")!,
        });

        const payload = res.list;
        dispatch(updateCartList(payload));
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push(`/product/${id}`);
    }
  };

  const handleMinus = async (id: string, e: any) => {
    e.preventDefault();
    const item = cartList?.find((item: any) => item.productId === id);
    if (item.quantity === 1) {
      try {
        await removeFromCartApi(item._id);

        const res = await viewCartApi({
          customerId: _id,
          storeId: global?.localStorage?.getItem("StoreId")!,
        });

        const payload = res.list;
        dispatch(updateCartList(payload));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        try {
          await changeQuantityApi(item._id, item.quantity - 1);

          const res = await viewCartApi({
            customerId: _id,
            storeId: global?.localStorage?.getItem("StoreId")!,
          });

          const payload = res.list;
          dispatch(updateCartList(payload));
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBuyNow = async (id: string, e: any, count: number) => {
    e.preventDefault();
    if (count === 0) {
      try {
        await addToCartApi(
          _id,
          id,
          [],
          1,
          "",
          global?.localStorage?.getItem("locationId")!
        );

        const res = await viewCartApi({
          customerId: _id,
          storeId: global?.localStorage?.getItem("StoreId")!,
        });

        const payload = res.list;
        dispatch(updateCartList(payload));
        router.push("/my-cart?retry=false");
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push(`/product/${id}`);
    }
  };

  const changeLanguage = () => {
    let lng = "";
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
      className="new-theme-layout"
      style={{ color: secondrythemeColourCode }}
    >
      {/* Modal */}
      <div className="hide-navbar">
        <div
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 49,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 16px",
          }}
        >
          <Link href="/menu" style={{ cursor: "pointer" }}>
            <MenuSvg />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/my-cart?retry=false" style={{ cursor: "pointer" }}>
              <BagSvg />
            </Link>
            <Link href="/search" style={{ cursor: "pointer" }}>
              <SearchSvg />
            </Link>
            <p
              style={{
                color: primaryThemeColourCode,
                width: 30,
                height: 30,
                padding: 0,
                margin: 0,
              }}
              className="new-header-local"
              onClick={changeLanguage}
            >
              {t("ع")}
            </p>
          </div>
        </div>
        <>
        {<Slider {...settings} className="!h-[394px]">
          {banner?.map((slider: any, index: number) => {
            return (
              <div key={index}>
                <Link href="#">
                  {slider === "" ? (
                    <img
                      src="images/slider1.png"
                      alt="url empty"
                      style={{
                        height: 394,
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <img
                      src={slider}
                      alt="hello lets see"
                      style={{
                        height: 394,
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </Slider>}
        </>
      </div>
      <div className="new-theme-container">
        {/* store data con */}
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            padding: "0px 18px",
            width: "100%",
            paddingBottom: 20,
            borderBottom: "1px solid #C4C4C4",
            marginBottom: 11.21,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            <img
              src={logo}
              alt="store-logo"
              style={{ width: 65, height: 65, borderRadius: 5 }}
            />
            <div>
              <h1 className="new-theme-store-name">
                {t("local") === "ar" ? storeNameInArabic : storeName}
              </h1>
              <CardsSvg />
            </div>
          </div>
          <VectorSvg />
        </div>

        {/* delivery & pickup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            // gap: 210,
            width: "100%",
            paddingBottom: 16.85,
            borderBottom: "1px solid #C4C4C4",
            marginBottom: 25,
          }}
        >
          <Link
            href={"/new-delivery?tab=delivery"}
            className="new-theme-delivery"
            style={{
              border: `1px solid ${primaryThemeColourCode}`,
              color: primaryThemeColourCode,
            }}
          >
            {t("Delivery")}
          </Link>
          <Link
            href={"/new-delivery?tab=pickup"}
            className="new-theme-delivery"
            style={{
              border: `1px solid ${primaryThemeColourCode}`,
              color: primaryThemeColourCode,
            }}
          >
            {t("Pickup")}
          </Link>
        </div>

        {/* deliver to and estimed time */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 21.55,
            width: "100%",
            marginBottom: 24,
          }}
          className="delivery-padding"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 31.04 }}>
              <CartSvg />
              <p className="new-theme-text">{t("Delivery to")}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 48.17 }}>
              <p className="new-theme-text">{t("Choose locations")}</p>
              <Link
                href={"/new-delivery?tab=delivery"}
                className="new-theme-edit"
                style={{ color: primaryThemeColourCode }}
              >
                {t("Edit")}
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 33.73 }}>
              <ClockSvg />
              <p className="new-theme-text">{t("Earliest Arrival")}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 62 }}>
              <p className="new-theme-text">4 Oct, 8:00 AM</p>
              <p
                className="new-theme-edit"
                style={{ color: primaryThemeColourCode }}
                onClick={() => {
                  setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
                }}
              >
                {t("Edit")}
              </p>
            </div>
          </div>
        </div>

        {/* categories */}
        {themeLayout === "category" && (
          <div className="new-theme-category">
            {categories?.map((item: any) => (
              <Link
                href={`/new-category/${item._id}?name=${item.name}`}
                key={item._id}
                style={{ position: "relative", cursor: "pointer" }}
                className="first-theme-category"
              >
                <img
                  src={
                    item.image === ""
                      ? item?.products[0]?.image
                        ? item?.products[0]?.image[0]?.url
                        : bgImg
                      : item.image
                  }
                  alt="cat-image"
                  className="new-theme-category-image"
                />
                <div className="new-theme-category-con">
                  <p className="new-theme-category-name">
                    {t("local") === "ar" ? item.nameInArabic : item.name}
                  </p>
                </div>
              </Link>
            ))}
            {categories.length / 2 !== 0 && (
              <div className="new-theme-category-image"></div>
            )}
          </div>
        )}
      </div>

      {themeLayout === "listing" &&
        categories?.map(
          (item: any) =>
            item?.products[0]?.productName !== null && (
              <div
                key={item._id}
                style={{ marginTop: 20 }}
                className="listing-padding"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "0px 14px",
                  }}
                >
                  <p className="second-layout-cat-name">
                    {t("local") === "ar" ? item.nameInArabic : item.name}
                  </p>
                  <DotsSvg />
                </div>
                {item?.products?.map((product: any) => (
                  <Link
                    key={product?._id}
                    href={`/product/${product?._id}`}
                    className="second-layout-product-container"
                  >
                    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                      <p
                        className="second-layout-product-name"
                        style={{ color: secondrythemeColourCode }}
                      >
                        {t("local") === "ar"
                          ? product.productNameInArabic
                          : product.productName}
                      </p>
                      <p
                        className="second-layout-product-dec"
                        style={{ color: secondrythemeColourCode }}
                      >
                        {product?.description?.length > 50
                          ? product?.description
                              ?.replace(/<[^>]*>|&nbsp;/gm, "")
                              .substring(0, 50) + "..."
                          : product?.description?.replace(
                              /<[^>]*>|&nbsp;/gm,
                              ""
                            )}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 35,
                          width: 240,
                        }}
                        className="money-button-container"
                      >
                        {/* <p
                          className="second-layout-product-name"
                          style={{
                            fontSize: 16,
                            fontWeight: 300,
                            color: secondrythemeColourCode,
                          }}
                        >
                          {product.priceAfterDiscount} {t("KWD")}
                        </p> */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {product?.priceAfterDiscount === product?.price ? (
                            ""
                          ) : (
                            <del
                              className="second-layout-product-name"
                              style={{
                                fontSize: 14,
                                fontWeight: 300,
                                color: secondrythemeColourCode,
                              }}
                            >
                              {product?.price}
                            </del>
                          )}
                          <p
                            className="second-layout-product-name"
                            style={{
                              fontSize: 14,
                              fontWeight: 300,
                              color: secondrythemeColourCode,
                            }}
                          >
                            {t("KDW")} {product?.priceAfterDiscount}
                          </p>
                        </div>
                        {cartList?.some(
                          (item: any) => item.productId === product._id
                        ) ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7.28,
                              height: 30.846,
                            }}
                          >
                            <p
                              style={{
                                cursor: "pointer",
                                padding: 0,
                                margin: 0,
                              }}
                              onClick={(e) => handleMinus(product._id, e)}
                            >
                              <SearchMinusSvg />
                            </p>
                            <div className="search-product-quantity-container">
                              <p
                                className="search-product-quantity"
                                style={{ color: secondrythemeColourCode }}
                              >
                                {
                                  cartList?.find(
                                    (item: any) =>
                                      item.productId === product._id
                                  ).quantity
                                }
                              </p>
                            </div>
                            <p
                              style={{
                                cursor: "pointer",
                                padding: 0,
                                margin: 0,
                              }}
                              onClick={(e) => handleAdd(product._id, e, 0)}
                            >
                              <SearchPlusSvg />
                            </p>
                          </div>
                        ) : (
                          <div
                            className="second-layout-product-btn"
                            onClick={(e) =>
                              handleAdd(product._id, e, product.variantsCount)
                            }
                            style={{
                              backgroundColor: primaryThemeColourCode,
                            }}
                          >
                            <p
                              className="second-layout-product-add"
                              style={{ color: secondrythemeColourCode }}
                            >
                              + {t("Add")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <img
                      alt="product"
                      src={product?.image[0]?.url}
                      className="img-style"
                      style={{
                        width: 152.295,
                        height: 140.35,
                        borderRadius: 6.454,
                        marginRight: "5px",
                      }}
                    />
                  </Link>
                ))}
              </div>
            )
        )}

      {/* third layout */}

      {themeLayout === "layout" && (
        <div className="padding-50">
          <div className="scrollbar-hide flex items-center justify-center gap-[9px] overflow-scroll mb-[31px]">
            {categories?.map((category: any) => (
              <Link
                href={`/new-category/${category._id}?name=${category.name}`}
                key={category._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  alt="category"
                  src={
                    category.image === ""
                      ? category?.products[0]?.image
                        ? category?.products[0]?.image[0]?.url
                        : bgImg
                      : category.image
                  }
                  style={{ width: 113, height: 113, borderRadius: 113 }}
                />
                <p className="third-layout-cat-name">
                  {t("local") === "ar" ? category.nameInArabic : category.name}
                </p>
              </Link>
            ))}
          </div>

          {categories?.map(
            (item: any) =>
              item?.products[0]?.productName !== null && (
                <div key={item?._id} style={{ marginBottom: 10 }}>
                  <div className="third-cat-container">
                    <p className="third-cat-name">
                      {t("local") === "ar" ? item.nameInArabic : item.name}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 9.3,
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item?.products?.map((product: any) => (
                      <Link
                        href={`/product/${product?._id}`}
                        className="third-product-container"
                        key={product?._id}
                      >
                        <img
                          alt="product"
                          src={product?.image[0]?.url}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: 105.689,
                            margin: "0px 23.88px",
                            marginBottom: "12.66px",
                            borderRadius: "10px 10px 0px 0px",
                          }}
                        />
                        <p
                          className="third-product-name"
                          style={{ color: secondrythemeColourCode }}
                        >
                          {t("local") === "ar"
                            ? product.productNameInArabic
                            : product.productName}
                        </p>
                        {/* <p
                          className="third-product-price"
                          style={{ color: secondrythemeColourCode }}
                        >
                          {product?.priceAfterDiscount} {t("KWD")}
                        </p> */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {product?.priceAfterDiscount === product?.price ? (
                            ""
                          ) : (
                            <del
                              className="third-product-price"
                              style={{ color: secondrythemeColourCode }}
                            >
                              {product?.price}
                            </del>
                          )}
                          <p
                            className="third-product-price"
                            style={{ color: secondrythemeColourCode }}
                          >
                            {t("KDW")} {product?.priceAfterDiscount}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 19,
                            marginTop: "15px",
                          }}
                        >
                          {cartList?.some(
                            (item: any) => item.productId === product._id
                          ) ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                height: 30.846,
                              }}
                            >
                              <p
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  margin: 0,
                                }}
                                onClick={(e) => handleMinus(product._id, e)}
                              >
                                <SearchMinusSvg />
                              </p>
                              <div className="search-product-quantity-container">
                                <p
                                  className="search-product-quantity"
                                  style={{
                                    color: secondrythemeColourCode,
                                    marginBottom: 2,
                                  }}
                                >
                                  {
                                    cartList?.find(
                                      (item: any) =>
                                        item.productId === product._id
                                    ).quantity
                                  }
                                </p>
                              </div>
                              <p
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  margin: 0,
                                }}
                                onClick={(e) => handleAdd(product._id, e, 0)}
                              >
                                <SearchPlusSvg />
                              </p>
                            </div>
                          ) : (
                            <div
                              className="add-container"
                              onClick={(e) =>
                                handleAdd(product._id, e, product.variantsCount)
                              }
                              style={{
                                border: `1px solid ${primaryThemeColourCode}`,
                              }}
                            >
                              <p
                                className="add-text"
                                style={{ color: primaryThemeColourCode }}
                              >
                                + {t("Add")}
                              </p>
                            </div>
                          )}
                          <div
                            className="buynow-container"
                            onClick={(e) =>
                              handleBuyNow(
                                product._id,
                                e,
                                product.variantsCount
                              )
                            }
                            style={{ backgroundColor: primaryThemeColourCode }}
                          >
                            <p
                              className="add-text"
                              style={{ color: secondrythemeColourCode }}
                            >
                              {t("Buy Now")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {!global?.localStorage?.getItem("locationId") && (
        <div className="new-theme-button-con">
          <Link
            href={"/new-delivery?tab=delivery"}
            className="new-theme-button"
            style={{ backgroundColor: primaryThemeColourCode }}
          >
            <p className="new-theme-button-text">{t("Select your location")}</p>
          </Link>
        </div>
      )}

      {cartList.length > 0 && (
        <div className="new-theme-button-con">
          <Link
            href={"/my-cart?retry=false"}
            className="new-theme-button"
            style={{
              backgroundColor: primaryThemeColourCode,
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 16px",
            }}
          >
            <p></p>
            <p className="new-theme-button-text" style={{ fontSize: 16 }}>
              {t("Go to checkout")}
            </p>
            <p className="new-theme-button-text" style={{ fontSize: 16 }}>
              {t("KDW")} {Math.floor(totalPrice * 1000) / 1000}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Theme1;
