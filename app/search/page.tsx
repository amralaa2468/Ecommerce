"use client";

/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";

import {
  getProductsApi,
  addToCartApi,
  changeQuantityApi,
  removeFromCartApi,
} from "./search.container";

import {
  BackSvg,
  SearchIconSvg,
  SearchMinusSvg,
  SearchPlusSvg,
} from "@/public/assets/svgs/searchSvg";
import "./style.css";
import { updateCartList } from "@/redux/reducers/storeReducer";
import { viewCartApi } from "@/components/StoreData/storeData.container";

interface product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  image: image[];
}

type image = {
  url: string;
};
const SearchPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const cartList = useSelector(
    (state: RootState) => state.StoreReducer.cartList
  );
  const { _id, primaryThemeColourCode, secondrythemeColourCode } = useSelector(
    (state: RootState) => state.StoreReducer.customerDetails
  );

  const [productList, setProductList] = useState([]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      try {
        const res = await getProductsApi(
          global?.localStorage?.getItem("StoreId")!,
          event.target.value,
          "",
          global?.localStorage?.getItem("locationId")!
        );

        setProductList(res.getProducts.list);
      } catch (error) {
        console.log(error);
      }
    } else {
      setProductList([]);
    }
  };

  const handleAdd = async (id: string) => {
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
      const payload = res;
      dispatch(updateCartList(payload.list));
    } catch (error) {
      console.log(error);
    }
  };

  type item = {
    _id: string;
    productId: string;
    quantity: number;
  };

  const handleMinus = async (id: string) => {
    const item = cartList?.find((item: item) => item.productId === id);
    if (item.quantity === 1) {
      try {
        await removeFromCartApi(item._id);

        const res = await viewCartApi({
          customerId: _id,
          storeId: global?.localStorage?.getItem("StoreId")!,
        });
        const payload = res;
        dispatch(updateCartList(payload.list));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await changeQuantityApi(item._id, item.quantity - 1);

        const res = await viewCartApi({
          customerId: _id,
          storeId: global?.localStorage?.getItem("StoreId")!,
        });
        const payload = res;
        dispatch(updateCartList(payload.list));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="search-layout" style={{ color: secondrythemeColourCode }}>
      <div className="searchbar-container">
        <div
          className="cursor-pointer my-0 mx-7"
          onClick={() => router.push("/")}
        >
          <BackSvg />
        </div>
        <SearchIconSvg />
        <input
          type="text"
          placeholder={t("Search...")}
          className="searchbar-text"
          onChange={handleChange}
        />
      </div>

      {productList.length === 0 ? (
        <h1 className="search-text">{t("Search for a product.")}</h1>
      ) : (
        <div className="padding-25 flex flex-col gap-[5px] justify-center items-start mt-[5px]">
          {productList?.map((product: product) => (
            <div className="search-product-container" key={product?._id}>
              <div className="margin-40 flex flex-col gap-[11px] w-full">
                <h1
                  className="search-product-name cursor-pointer"
                  onClick={() => router.push(`/product/${product?._id}`)}
                >
                  {product?.productName}
                </h1>
                <p className="search-product-description">
                  {product?.description?.length > 50
                    ? product?.description
                        ?.replace(/<[^>]*>|&nbsp;/gm, "")
                        .substring(0, 50) + "..."
                    : product?.description?.replace(/<[^>]*>|&nbsp;/gm, "")}
                </p>
                <div className="width-203 flex items-center justify-between mt-[11px]">
                  {/* <p className="search-product-price">{product?.priceAfterDiscount} KWD</p> */}
                  <div className="flex items-center gap-1">
                    {product?.priceAfterDiscount === product?.price ? (
                      ""
                    ) : (
                      <del
                        className="search-product-price"
                        style={{ fontSize: 14 }}
                      >
                        {product?.price}
                      </del>
                    )}
                    <p className="search-product-price">
                      {product?.priceAfterDiscount} {t("KDW")}
                    </p>
                  </div>
                  {cartList?.some(
                    (item: item) => item.productId === product._id
                  ) ? (
                    <div className="flex items-center fap-[7.28px]">
                      <p
                        className="cursor-pointer p-0 m-0"
                        onClick={() => handleMinus(product._id)}
                      >
                        <SearchMinusSvg />
                      </p>
                      <div className="search-product-quantity-container">
                        <p className="search-product-quantity">
                          {
                            cartList?.find(
                              (item: item) => item.productId === product._id
                            ).quantity
                          }
                        </p>
                      </div>
                      <p
                        className="cursor-pointer p-0 m-0"
                        onClick={() => handleAdd(product._id)}
                      >
                        <SearchPlusSvg />
                      </p>
                    </div>
                  ) : (
                    <div
                      className="search-product-button"
                      onClick={() => handleAdd(product._id)}
                      style={{ backgroundColor: primaryThemeColourCode }}
                    >
                      <p className="search-product-button-text">+ {t("Add")}</p>
                    </div>
                  )}
                </div>
              </div>
              <img
                alt="product-image"
                src={product?.image[0]?.url}
                className="search-product-image cursor-pointer"
                onClick={() => router.push(`/product/${product?._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
