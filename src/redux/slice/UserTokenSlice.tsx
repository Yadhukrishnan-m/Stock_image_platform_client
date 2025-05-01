import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface UserTokenState {
  userToken: string | null;
}

const initialState: UserTokenState = {
  userToken: JSON.parse(localStorage.getItem("AccessToken") || "null"),
};

const userTokenSlice = createSlice({
  name: "usertokenSlice", // Updated to match the store
  initialState,
  reducers: {
    addUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
      localStorage.setItem("AccessToken", JSON.stringify(action.payload));
    },
    removeUserToken: (state) => {
      state.userToken = null;
      localStorage.removeItem("AccessToken");
    },
  },
});

export const { addUserToken, removeUserToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;
