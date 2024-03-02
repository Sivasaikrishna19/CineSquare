import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserInfo } from "../../../Interfaces/userInfo.interface";

type authState = { isLoggedIn: boolean; userInfo: IUserInfo };
const initialState: authState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  userInfo: JSON.parse(localStorage.getItem("userInfo")!),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state: authState, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setLogIn: (state: authState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
    },
    setLogOut: (state: authState, action: PayloadAction<any>) => {
      state.isLoggedIn = false;
    },
  },
});
export const { setLogIn, setLogOut, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
