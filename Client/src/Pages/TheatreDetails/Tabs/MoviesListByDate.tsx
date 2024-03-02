import { StarTwoTone } from "@ant-design/icons";
import { Button, Card } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { featured_movies } from "../../../data/FeaturedMovies/FeaturedMovies";
import { IMovie } from "../../../Interfaces/movie.interface";
import dayjs from "dayjs";

export interface MoviesListByDateInterface {
  date: string;
  movies: any;
}

const MoviesListByDate = (props: MoviesListByDateInterface) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(props.movies, "movie data");
  }, [props]);
  const getMovieGenre = (genre: string) => {
    if (genre === "feel_good") {
      return "Feel Good";
    } else if (genre === "action") {
      return "Action";
    } else if (genre === "thriller") {
      return "Thriller";
    } else if (genre === "rom_com") {
      return "Rom Com";
    } else if (genre === "horror") {
      return "Horror";
    }
  };

  return (
    <>
      {" "}
      <div className="pt-10 w-[80%] grid grid-cols-2 gap-6">
        {props?.movies.map(
          (movie: {
            movie: IMovie;
            shows: Array<{ id: number; show_timing: string }>;
          }) => {
            return (
              <Card
                title={
                  movie?.movie?.name?.length > 30 ? (
                    <span className="font-bold">
                      {movie.movie.name.substring(0, 30) + "..."}
                    </span>
                  ) : (
                    <span className="font-bold">{movie?.movie?.name}</span>
                  )
                }
                style={{ minWidth: 300 }}
                className="cursor-pointer"
              >
                <div>{movie?.movie.description}</div>
                <div className="flex w-full justify-between my-2">
                  <div>{getMovieGenre(movie?.movie?.genre)}</div>
                  <div>{movie?.movie?.runtime} min</div>
                  <div>
                    <span>
                      <StarTwoTone className="mr-1" />
                      {movie?.movie?.rating}/10
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  {movie?.shows?.map(
                    (show: { id: number; show_timing: string }) => {
                      return (
                        <Button
                          onClick={() => {
                            // navigate(
                            //   `/seatmap?theaterId=${data.id}&movieId=${movie.movie.id}&showDate=${props.date}&showTime=${time}`,
                            //   {
                            //     state: data,
                            //   }
                            // );
                            navigate(`/seatmap/${show.id}`);
                          }}
                        >
                          {dayjs(show.show_timing).format("h:mm A")}
                        </Button>
                      );
                    }
                  )}
                </div>
              </Card>
            );
          }
        )}
      </div>
    </>
  );
};

export default MoviesListByDate;
