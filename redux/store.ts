import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { StoreReducer } from "./reducers/storeReducer";

const store = configureStore({
  reducer: {
    StoreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
