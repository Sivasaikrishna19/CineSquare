import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITheater } from "../../../Interfaces/theater.interface";

type theatresState = { theaters: Array<ITheater> };
const initialState = { theaters: [] };

const theatreSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    allTheaters: (state: theatresState, action: PayloadAction<any>) => {
      state.theaters = action.payload;
    },
  },
});
export const { allTheaters } = theatreSlice.actions;
export default theatreSlice.reducer;
