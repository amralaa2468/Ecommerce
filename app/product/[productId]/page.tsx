"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  addToCartApi,
  getProductDetailsApi,
  productVariantsPriceApi,
} from "./product.container";
import {
  BackSvg,
  SearchMinusSvg,
  SearchPlusSvg,
} from "@/public/assets/svgs/searchSvg";
import {
  CheckSvg,
  RadioSVg,
  UnCheckSvg,
  UnRadioSvg,
} from "@/public/assets/svgs/productSvg";
import "../../search/style.css";
import "./style.css";
import { viewCartApi } from "@/components/StoreData/storeData.container";
import { updateCartList } from "@/redux/reducers/storeReducer";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const NewProductPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.productId as string;

  const [product, setProduct] = useState<any>();
  const [selectOptPrice, setSelectOptPrice] = useState<any>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectOpt, setSelectOpt] = useState<any>([]);
  const [selectedOptionName, setSelectedOptionName] = useState<any>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();

  const { _id, primaryThemeColourCode, secondrythemeColourCode } = useSelector(
    (state: RootState) => state.StoreReducer.customerDetails
  );

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const res = await getProductDetailsApi(
          global?.localStorage?.getItem("StoreId") ?? "",
          productId,
          global?.localStorage?.getItem("locationId") ?? ""
        );
        setProduct(res);
        setTotalPrice(res.priceAfterDiscount);
      } catch (error) {
        console.log(error);
      }
    };
    if (global?.localStorage?.getItem("locationId")) {
      getProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    const getProductVariantsPrice = async () => {
      const variantIds: any = [];
      selectOptPrice?.map((option: any) => {
        variantIds.push(option?._id);
      });

      try {
        const res = await productVariantsPriceApi(
          global?.localStorage?.getItem("StoreId")!,
          productId,
          variantIds
        );

        if (res?.productVariantsPrice?.priceAfterDiscount) {
          setTotalPrice(res?.priceAfterDiscount * quantity);
        } else {
          setTotalPrice(res?.price * quantity);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProductVariantsPrice();
  }, [quantity, selectOptPrice]);

  const handleSelectedSubOption = (
    variant: any,
    index: any,
    variantIndex: any
  ) => {
    const subOptions = product.productVariants;
    let selectedSupOp = variant?.selectedSupOp
      ? [...variant?.selectedSupOp]
      : [];
    let variants;
    let selected = [...selectOpt];
    let selectedPrice = [...selectOptPrice];

    if (selectedSupOp?.includes(variant?.subOptions[index]?._id)) {
      selectedSupOp = selectedSupOp?.filter(
        (item) => item !== variant.subOptions[index]._id
      );
      selectedPrice = selectedPrice.filter(
        (subOption) => subOption.name !== variant.subOptions[index].name
      );
      selected = selected.filter(
        (item) => item !== variant.subOptions[index]._id
      );
    } else {
      const existingIndex = selectedPrice.findIndex(
        (item) => item.parentName === variant.name
      );

      let linkIndex = -1;

      selectedPrice.some((item, index) => {
        const links = item.link.split(",");
        if (links.includes(variant.name)) {
          linkIndex = index;
        }
        return 0;
      });

      if (existingIndex !== -1) {
        if (
          variant.maxVariants === variant.selectedSupOp.length ||
          variant.maxVariants === 0 ||
          variant.maxVariants === null
        ) {
          selectedPrice.splice(existingIndex, 1);
          selected.splice(existingIndex, 1);
          selectedSupOp.splice(existingIndex, 1);
        }
      }

      if (linkIndex !== -1) {
        selectedPrice.splice(existingIndex, 1);
        selected.splice(existingIndex, 1);
      }

      if (variant.link === "") {
        subOptions?.map((subOption: any) => {
          if (subOption?.name === variant?.subOptions[index]?.name) {
            selectedPrice.push({
              price: subOption?.price,
              _id: subOption._id,
              parentName: variant.name,
              quantity: subOption.quantity,
              name: subOption.name,
              link: variant.link,
            });
          }
          return 0;
        });
      } else {
        const SelectedOptionName = selectedOptionName;
        const existingIndex = selectedOptionName.findIndex(
          (item: any) => item.parentName === variant.name
        );

        if (existingIndex !== -1) {
          SelectedOptionName.splice(existingIndex, 1);
        }

        SelectedOptionName.push({
          name: variant.subOptions[index].name,
          parentName: variant.name,
          link: variant.link,
        });

        subOptions.map((subOption: any) => {
          const subOptionNames = subOption.name.split("-");

          if (
            subOptionNames.every((subOptionName: any) =>
              SelectedOptionName.some(
                (selectedOption: any) => selectedOption.name === subOptionName
              )
            )
          ) {
            selectedPrice.push({
              price: subOption?.price,
              _id: subOption._id,
              parentName: variant.name,
              quantity: subOption.quantity,
              name: subOption.name,
              link: variant.link,
            });
          }
          return 0;
        });

        setSelectedOptionName(SelectedOptionName);
      }

      selected.push(variant?.subOptions[index]?._id);
      selectedSupOp.push(variant?.subOptions[index]?._id);
    }
    variants = product.variant.map((variant: any, index: any) => {
      if (index === variantIndex) {
        const updatedVariant = { ...variant, selectedSupOp: selectedSupOp };
        return updatedVariant;
      }
      return variant;
    });

    setSelectOpt(selected);
    setSelectOptPrice(selectedPrice);
    setProduct({ ...product, variant: variants });
  };

  const handleAddToCart = async () => {
    let varError = "";
    product?.variantsInfo?.forEach((variant: any, vbox: any) => {
      if (
        variant.isMandatory === true &&
        (variant?.selectedSupOp?.length === 0 || !variant?.selectedSupOp)
      ) {
        varError =
          varError +
          " , " +
          (t("local") === "ar" ? variant.nameInArabic : variant.name) +
          ` ${t("is required")}`;
        setError(true);
        setErrMsg(varError);
      } else if (
        variant.minVariants > 0 &&
        variant?.selectedSupOp?.length < variant.minVariants
      ) {
        varError =
          ` ${t("you should select at least")} ` +
            variant.minVariants +
            ` ${t("from")} ` +
            t("local") ===
          "ar"
            ? variant.nameInArabic
            : variant.name;
        setError(true);
        setErrMsg(varError);
      }
    });

    const variantIds = selectOptPrice.map((item: any) => item._id);
    let quantityName = "";
    const checkQuantity = selectOptPrice
      .map((item: any) => {
        if (item.quantity === 0 && !product!.isUnlimited) {
          quantityName = t("local") === "ar" ? item.nameInArabic : item.name;
          return true;
        }
        return false;
      })
      .includes(true);

    if (quantity > product!.quantity && !product!.isUnlimited) {
      alert(`${t("Minimum quantity to purchase is")} ${product!.quantity}`);
      setQuantity(product!.quantity);
    } else {
      if (!checkQuantity) {
        if (varError?.length < 1) {
          try {
            await addToCartApi(
              _id,
              productId,
              variantIds,
              quantity,
              specialInstructions,
              global?.localStorage?.getItem("locationId") ?? ""
            );
            const res = await viewCartApi({
              customerId: _id,
              storeId: global?.localStorage?.getItem("StoreId") ?? "",
            });
            const payload = res;
            dispatch(updateCartList(payload.list));
            router.push("/my-cart?retry=false");
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        alert(`${t("this ") + quantityName + " is out of stock"}`);
      }
    }
  };

  const handleCopyToClipboard = () => {
    const currentUrl = window.location.href;

    const tempInput = document.createElement("input");
    tempInput.value = currentUrl;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");

    document.body.removeChild(tempInput);

    setIsCopied(true);

    alert(t("Link copied to clipboard"));
  };

  return (
    <div
      className={`product-layout`}
      style={{ color: secondrythemeColourCode }}
    >
      <div className="product-header-container">
        <Link href="/" style={{ cursor: "pointer" }}>
          <BackSvg />
        </Link>
        <p className="product-header-text">
          {t("local") === "ar"
            ? product?.productNameInArabic
            : product?.productName}
        </p>
        <div></div>
      </div>
      {product?.image && (
        <img
          src={product?.image[0]?.url}
          alt="product"
          style={{
            width: "100%",
            height: 355.756,
            borderRadius: 5,
            objectFit: "fill",
          }}
        />
      )}

      <div className="product-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          <h1 className="product-name" style={{ color: "black" }}>
            {t("local") === "ar"
              ? product?.productNameInArabic
              : product?.productName}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {product?.priceAfterDiscount === product?.price ? (
              ""
            ) : (
              <del className="product-price" style={{ fontSize: "11px" }}>
                KD {product?.price}
              </del>
            )}
            <p className="product-price" style={{ fontSize: "15px" }}>
              KD {product?.priceAfterDiscount}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15.55,
              marginTop: 15,
            }}
          >
            <p
              style={{ cursor: "pointer", padding: 0, margin: 0 }}
              onClick={() => quantity !== 1 && setQuantity(quantity - 1)}
            >
              <SearchMinusSvg />
            </p>
            <div className="search-product-quantity-container">
              <p className="search-product-quantity">{quantity}</p>
            </div>
            <p
              style={{ cursor: "pointer", padding: 0, margin: 0 }}
              onClick={() => setQuantity(quantity + 1)}
            >
              <SearchPlusSvg />
            </p>
          </div>
        </div>
      </div>
      {product?.description && (
        <div className="product-description">
          {t("local") === "ar"
            ? product?.descriptionInArabic?.replace(/<[^>]*>|&nbsp;/gm, "")
            : product?.description?.replace(/<[^>]*>|&nbsp;/gm, "")}
        </div>
      )}

      {product?.variant?.map((option: any, optionIndex: number) => (
        <div key={option?._id}>
          <p className="option-name">
            {t("local") === "ar" ? option?.nameInArabic : option?.name}
          </p>
          {option.type === "multi" ? (
            <div
              style={{ backgroundColor: "white", padding: 20, width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  marginBottom: 20,
                }}
              >
                <div className="mandatory-container">
                  <p className="mandatory-text">
                    {option?.isMandatory ? t("Required") : t("Optional")}
                  </p>
                </div>
                {option?.minVariants !== 0 && option?.minVariants && (
                  <p className="max-text">
                    {t("min")}: {option?.minVariants}
                  </p>
                )}
                {option?.maxVariants !== 0 && option?.maxVariants && (
                  <p className="max-text">
                    {t("max")}: {option?.maxVariants}
                  </p>
                )}
              </div>

              {option?.subOptions?.map((subOption: any, subIndex: number) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 35,
                    padding: "0px 20px",
                  }}
                  key={subOption?._id}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleSelectedSubOption(option, subIndex, optionIndex)
                    }
                  >
                    {option?.maxVariants > 1 ? (
                      option?.selectedSupOp?.includes(subOption?._id) ? (
                        <CheckSvg />
                      ) : (
                        <UnCheckSvg />
                      )
                    ) : option?.selectedSupOp?.includes(subOption?._id) ? (
                      <RadioSVg />
                    ) : (
                      <UnRadioSvg />
                    )}
                  </span>
                  <div style={{ marginBottom: 10 }}>
                    <p className="suboption-name">
                      {t("local") === "ar"
                        ? subOption?.nameInArabic
                        : subOption?.name}
                    </p>
                    <p className="suboption-price">
                      {option.link === "" &&
                        product?.productVariants?.find(
                          (productVariant: any) =>
                            productVariant.name === subOption?.name
                        )?.price !== 0 &&
                        "+ " +
                          t("KWD") +
                          " " +
                          product?.productVariants?.find(
                            (productVariant: any) =>
                              productVariant.name === subOption?.name
                          )?.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px 38px",
                paddingLeft: "15px",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <select
                className="option-dropdown"
                onChange={(e) =>
                  handleSelectedSubOption(option, e.target.value, optionIndex)
                }
              >
                <option value={0} className="suboption-name">
                  {t("local") === "ar" ? option?.nameInArabic : option?.name}
                </option>
                {option?.subOptions?.map((subOption: any, subIndex: number) => (
                  <option className="suboption-name" value={subIndex}>
                    {t("local") === "ar"
                      ? subOption?.nameInArabic
                      : subOption?.name}
                    {option.link === "" &&
                      product?.productVariants?.find(
                        (productVariant: any) =>
                          productVariant.name === subOption?.name
                      )?.price !== 0 &&
                      "( " +
                        t("KWD") +
                        " " +
                        product?.productVariants?.find(
                          (productVariant: any) =>
                            productVariant.name === subOption?.name
                        )?.price +
                        " )"}
                  </option>
                ))}
              </select>
              <div className="mandatory-container">
                <p className="mandatory-text">
                  {option?.isMandatory ? t("Required") : t("Optional")}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="special-container">
        <input
          className="special-input"
          placeholder={t("Special Requests")}
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
        />
      </div>

      <div className="share-product-container" onClick={handleCopyToClipboard}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20.1493 0C22.276 0 24 1.72399 24 3.85066C24 5.97733 22.276 7.70132 20.1493 7.70132C18.0226 7.70132 16.2987 5.97733 16.2987 3.85066C16.3011 1.72498 18.0237 0.00241406 20.1491 0H20.1493ZM20.1493 6.10134C21.3923 6.10134 22.4 5.09369 22.4 3.85068C22.4 2.60768 21.3923 1.60001 20.1493 1.60001C18.9063 1.60001 17.8987 2.60768 17.8987 3.85071C17.8999 5.0932 18.9068 6.10014 20.1492 6.10134H20.1493ZM3.85066 8.1493C5.97733 8.1493 7.70132 9.87332 7.70132 12C7.70132 14.1267 5.97733 15.8506 3.85066 15.8506C1.72399 15.8506 0 14.1266 0 12C0.0024375 9.8743 1.725 8.15174 3.85043 8.14933H3.85066V8.1493ZM3.85066 14.2506C5.09367 14.2506 6.10132 13.243 6.10132 12C6.10132 10.757 5.09367 9.74936 3.85066 9.74936C2.60765 9.74936 1.60001 10.757 1.60001 12C1.60123 13.2425 2.60815 14.2495 3.85054 14.2507L3.85066 14.2506ZM20.1493 16.2987C22.276 16.2987 24 18.0227 24 20.1493C24 22.276 22.276 24 20.1493 24C18.0226 24 16.2987 22.276 16.2987 20.1493C16.3011 18.0237 18.0237 16.3011 20.1491 16.2987H20.1493ZM20.1493 22.4C21.3923 22.4 22.4 21.3923 22.4 20.1493C22.4 18.9063 21.3923 17.8987 20.1493 17.8987C18.9063 17.8987 17.8987 18.9063 17.8987 20.1493C17.8999 21.3919 18.9068 22.3988 20.1492 22.4H20.1493ZM6.93867 11.3504L6.22401 9.91893L17.0613 4.5003L17.7813 5.93177L6.93867 11.3504ZM17.0613 19.4997L6.22399 14.0811L6.93864 12.6496L17.7813 18.0683L17.0613 19.4997Z"
            fill="#52565E"
          />
        </svg>
        <p style={{ color: "black", marginTop: "12px", cursor: "pointer" }}>
          {isCopied ? t("Link Copied!") : t("Share with a friend")}
        </p>
      </div>

      <div className="add-cart-container">
        <div
          className="add-cart-btn"
          style={{ backgroundColor: primaryThemeColourCode }}
          onClick={handleAddToCart}
        >
          <div></div>
          <p className="add-cart-text">{t("Add to cart")}</p>
          <p className="add-cart-text" style={{ fontSize: "13px" }}>
            {t("KWD")} {Math.floor(totalPrice * 1000) / 1000}
          </p>
        </div>
      </div>

      <Snackbar
				open={error}
				autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				onClose={() => {
					setErrMsg("");
					setError(false);
				}}>
				<Alert
					severity="error"
					onClose={() => {
						setErrMsg("");
						setError(false);
					}}>
					{errMsg}
				</Alert>
			</Snackbar>
    </div>
  );
};

export default NewProductPage;
