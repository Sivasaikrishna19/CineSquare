import { IMovie } from "./movie.interface";
import { ITheater } from "./theater.interface";

export interface ISeatmap {
  id?: any;
  discounted_price: number;
  price: number;
  movie: IMovie;
  theater: ITheater;
  show_time: string;
  show_date: string;
  show_timing: string;
  seat_matrix: Array<string>;
  no_of_rows: number;
  no_of_cols: number;
}
