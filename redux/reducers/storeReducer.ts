import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  customerDetails: any;
  catList: any;
  cartList: any;
  orderList: any;
}

const initialState: InitialState = {
  customerDetails: {
    primaryThemeColourCode: "",
  },
  catList: [],
  cartList: [],
  orderList: [],
};

const storeReducer = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateCustomerDetails: (state, action) => {
      state.customerDetails = { ...action.payload };
    },
    updateCatList: (state, action) => {
      state.catList = [...action.payload];
    },
    updateCartList: (state, action) => {
      state.cartList = [...action.payload];
    },
    updateOrderList: (state, action) => {
      state.orderList = [...action.payload];
    },
  },
});

const { actions, reducer } = storeReducer;
export const {
  updateCustomerDetails,
  updateCatList,
  updateCartList,
  updateOrderList,
} = actions;

export const StoreReducer = reducer;
export default reducer;
