import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IMovie } from "../../Interfaces/movie.interface";
import { Card, Divider, Select } from "antd";
import Meta from "antd/es/card/Meta";
import { StarTwoTone } from "@ant-design/icons";
import { useAppSelector } from "../../state/hooks";
import { useDispatch } from "react-redux";
import axios from "axios";
import { allMovies } from "../../state/reducers/moviesReducer/moviesReducer";
import { BASE_URL } from "../../env";

const Movies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const movies = useAppSelector((state: any) => state.movies);
  const [tab, setTab] = useState<string>("");
  const [filters, setFilters] = useState<any>({});

  const [tempMovies, setTempMovies] = useState<Array<IMovie>>();

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
    } else return genre;
  };

  const getMovies = (params: any) => {
    let tmpParams = removeUndefined(params);
    axios
      .get(BASE_URL + "movie/movie", { params: tmpParams })
      .then((res) => {
        dispatch(allMovies(res.data.movies));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovies(filters);
  }, [filters]);

  useEffect(() => {
    console.log(movies, "movies");
    setTempMovies(movies.movies);
  }, [movies]);

  const filterMoviesByType = (movies: Array<IMovie>, targetType: string) => {
    if (targetType == "") return movies;
    return movies.filter((movie) => movie.type === targetType);
  };

  useEffect(() => {
    console.log("hash", location.hash);
    if (location.hash === "") {
      setTab("featured");
      setTempMovies(filterMoviesByType(movies.movies, ""));
    } else if (location.hash === "#now-playing") {
      setTab("now-playing");
      setTempMovies(filterMoviesByType(movies.movies, "Playing Now"));
    } else if (location.hash === "#coming-soon") {
      setTempMovies(filterMoviesByType(movies.movies, "Upcoming"));
      setTab("coming-soon");
    }
  }, [location]);

  const getFilteredMovies = (data: Array<IMovie>, searchString: string) => {
    const regex = new RegExp(searchString, "i");
    console.log(data.filter((movie) => regex.test(movie.name)));
    setTempMovies(data.filter((movie) => regex.test(movie.name)));
  };

  function removeUndefined(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }

  return (
    <div>
      <div className="py-4 flex  items-center justify-between">
        <div className="font-semibold text-[24px]">Featured Movies</div>

        <div className="font-semibold flex items-center">
          <span
            className={`mx-[6px] cursor-pointer hover:text-blue-400 ${
              tab === "featured" ? "text-blue-400" : ""
            }`}
            onClick={() => {
              navigate("/movies");
            }}
          >
            Featured
          </span>
          <span
            className={`mx-[6px] cursor-pointer hover:text-blue-400 ${
              tab === "now-playing" ? "text-blue-400" : ""
            }`}
            onClick={() => {
              window.location.hash = "now-playing";
            }}
          >
            Now Playing
          </span>
          <span
            className={`mx-[6px] cursor-pointer hover:text-blue-400 ${
              tab === "coming-soon" ? "text-blue-400" : ""
            }`}
            onClick={() => {
              window.location.hash = "coming-soon";
            }}
          >
            Coming Soon
          </span>
        </div>
        <div>
          <Search
            placeholder="Search for movie"
            enterButton
            onChange={(e: any) => {
              getFilteredMovies(movies.movies, e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] pr-2 mr-2 grid grid-cols-2 gap-4">
          {tempMovies?.map((movie: IMovie) => (
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  alt="example"
                  src={movie.image_url}
                  style={{ objectFit: "cover", height: "280px" }}
                />
              } // Adjust the height as needed
              onClick={() => {
                navigate(`${movie.id}`);
              }}
              className="hover:shadow-lg hover:shadow-[#a8e8fd] cursor-pointer transition-shadow duration-500 cursor-pointer"
            >
              <Meta
                title={movie.name}
                description={
                  <div>
                    <div className="my-2">{movie.description}</div>
                    <div className="flex justify-between">
                      <div>{getMovieGenre(movie.genre)}</div>
                      <div className="flex items-center">
                        <StarTwoTone className="mr-1" />
                        {movie.rating}/10
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          ))}
        </div>

        <div className="w-[30%]  pl-2 ml-2 ">
          <div className="font-semibold text-[18px]">Sort By</div>
          <Select
            allowClear
            className="w-full my-2"
            placeholder="Sort By"
            onChange={(e) => {
              setFilters({ ...filters, sort_by: e });
            }}
            options={[
              { value: "recent", label: "Most Recent" },
              { value: "popular", label: "Most Popular" },
              { value: "alphabetical", label: "Alphabetical Order" },
            ]}
          />
          <div className="font-semibold text-[18px] mt-4">
            Narrow Your Selection
          </div>
          <Divider className="my-2" />
          <div>Genre</div>
          <Select
            allowClear
            className="w-full my-2"
            placeholder="Select Genre"
            options={[
              { value: "action", label: "Action" },
              { value: "thriller", label: "Thriller" },
              { value: "rom_com", label: "Rom Com" },
              { value: "horror", label: "Horror" },
              { value: "feel_good", label: "Feel Good" },
            ]}
            onChange={(e) => {
              setFilters({ ...filters, genre: e });
            }}
          />
          <div>Rating</div>
          <Select
            allowClear
            className="w-full my-2"
            placeholder="Select Rating"
            options={[
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
              { value: 9, label: "9" },
              { value: 10, label: "10" },
            ]}
            onChange={(e) => {
              setFilters({ ...filters, rating: e });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Movies;
