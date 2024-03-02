import { combineReducers } from "@reduxjs/toolkit";
import moviesReducer from "./moviesReducer/moviesReducer";
import theatreReducer from "./theatreReducer/theatreReducer";
import cartReducer from "./cartReducer/cartReducer";
import orderConfirmation from "./orderConfirmation/orderConfirmation";
import authReducer from "./authReducer/authReducer";

const reducers = combineReducers({
  auth: authReducer,
  movies: moviesReducer,
  theaters: theatreReducer,
  cart: cartReducer,
  orderConfirmation: orderConfirmation,
});

export default reducers;
