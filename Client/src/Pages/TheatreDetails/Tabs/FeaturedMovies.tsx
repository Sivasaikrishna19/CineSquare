import React from "react";
import { featured_movies } from "../../../data/FeaturedMovies/FeaturedMovies";
import { IMovie } from "../../../Interfaces/movie.interface";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import { StarTwoTone } from "@ant-design/icons";

const FeaturedMovies = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full overflow-x-auto p-1 gap-4">
      {featured_movies.map((movie: IMovie) => (
        <Card
          hoverable
          className="mx-2 flex-shrink-0 rounded-lg" // Apply rounded-lg class for rounded corners
          style={{ width: "240px", height: "350px" }}
          onClick={() => {
            navigate("/movies/id", { state: movie });
          }}
        >
          <div style={{ width: "100%", height: "70%" }}>
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <Meta
            title={movie.name}
            description={
              <div className="flex items-center justify-between">
                <span>{movie.genre}</span>
                <span>
                  <StarTwoTone className="mr-1" />
                  {movie.rating}
                </span>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );
};

export default FeaturedMovies;
