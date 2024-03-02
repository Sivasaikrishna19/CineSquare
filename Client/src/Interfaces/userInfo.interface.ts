import { IMovie } from "./movie.interface";
import { ITheater } from "./theater.interface";

export interface IUserInfo {
  id: number;
  email: string;
  phoneNumber: string;
  role: string;
  success: boolean;
  token: string;
  username: string;
  is_admin: boolean;
  membership_type: string;
  rewardPoints: number;
}

export interface IUserData extends IUserInfo {
  tickets: Array<{
    id: number;
    show: {
      id: 1281;
      show_timing: string;
      runtime: number;
    };
    user: number;
    ticket_price: number;
    service_fee: number;
    seats: Array<string>;
    dollars: number;
    reward_points: number;
    status: string;
    created_at: string;
    movie: IMovie;
    theater: ITheater;
  }>;
}
