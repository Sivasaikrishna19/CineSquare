import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITicket } from "../../../Interfaces/ticket.interface";

type cartState = { cart: Array<ITicket> };
const initialState = { cart: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state: cartState, action: PayloadAction<any>) => {
      state.cart.push(action.payload);
      console.log(state.cart, "cart reducer");
    },
    getAllCartItems: (state: cartState, action: PayloadAction<any>): any => {
      return state.cart;
    },
  },
});
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
