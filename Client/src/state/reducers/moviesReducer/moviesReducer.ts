import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMovie } from "../../../Interfaces/movie.interface";

type moviesState = { movies: Array<IMovie> };
const initialState = { movies: [] };

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    allMovies: (state: moviesState, action: PayloadAction<any>) => {
      state.movies = action.payload;
    },
  },
});
export const { allMovies } = movieSlice.actions;
export default movieSlice.reducer;
