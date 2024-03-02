import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITicket } from "../../../Interfaces/ticket.interface";

type orderConfirmationState = { orderConfirmation: ITicket | null };
const initialState: orderConfirmationState = {
  orderConfirmation: null,
};

const orderConfirmationSlice = createSlice({
  name: "orderConfirmation",
  initialState,
  reducers: {
    setOrderConfirmation: (
      state: orderConfirmationState,
      action: PayloadAction<ITicket | null>
    ) => {
      state.orderConfirmation = action.payload;
      console.log(state.orderConfirmation, "order reducer");
    },
  },
});

export const { setOrderConfirmation } = orderConfirmationSlice.actions;
export default orderConfirmationSlice.reducer;
