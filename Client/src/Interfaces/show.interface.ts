import { IMovie } from "./movie.interface";
import { ITheater } from "./theater.interface";

export interface IShow {
  id: number;
  show_timing: string;
  no_of_rows: number;
  no_of_cols: number;
  price: number;
  discounted_price: number;
  movie: IMovie;
  theater: ITheater;
  seat_matrix: Array<string>;
  runtime: number;
}
