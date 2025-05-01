import { configureStore } from "@reduxjs/toolkit";
import userTokenSlice from "./slice/UserTokenSlice";
const store = configureStore({
  reducer: {
    userTokenSlice: userTokenSlice,
   
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
