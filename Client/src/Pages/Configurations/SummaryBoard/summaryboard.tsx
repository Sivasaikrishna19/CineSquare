import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../env";
import axios from "axios";

const summaryboard = () => {
  const [analytics, setAnalytics] = useState<any>();
  const getAnalytics = () => {
    axios
      .get(BASE_URL + "analytics/occupancy")
      .then((res) => {
        console.log(res.data, "analytics");
        setAnalytics(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <div>
      <div>
        <div className="mb-3 text-[28px] font-semibold">
          Location Wise analysis
        </div>
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 30 days</div>
          <div>
            {analytics?.locations_30_days &&
              Object.entries(analytics?.locations_30_days!).map(
                ([key, value]: any) => (
                  <div className="w-[95%] border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] p-3 rounded-md bg-white mb-2">
                    <div className="flex items-center">
                      <span className="text-[32px] font-semibold">{value}</span>{" "}
                      <span className="ml-3 text-[18px]">
                        {" "}
                        tickets booked in {key} area.
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 60 days</div>
          <div>
            {analytics?.locations_60_days &&
              Object.entries(analytics?.locations_60_days!).map(
                ([key, value]: any) => (
                  <div className="w-[95%] border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] p-3 rounded-md bg-white mb-2">
                    <div className="flex items-center">
                      <span className="text-[32px] font-semibold">{value}</span>{" "}
                      <span className="ml-3 text-[18px]">
                        {" "}
                        tickets booked in {key} area.
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 90 days</div>
          <div>
            {analytics?.locations_90_days &&
              Object.entries(analytics?.locations_90_days!).map(
                ([key, value]: any) => (
                  <div className="w-[95%] border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] p-3 rounded-md bg-white mb-2">
                    <div className="flex items-center">
                      <span className="text-[32px] font-semibold">{value}</span>{" "}
                      <span className="ml-3 text-[18px]">
                        {" "}
                        tickets booked in {key} area.
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-3 text-[28px] font-semibold">
          Movie Wise analysis
        </div>
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 30 days</div>
          <div>
            {analytics?.movies_30_days &&
              Object.entries(analytics?.movies_30_days!).map(
                ([key, value]: any) => (
                  <div className="w-[95%] border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] p-3 rounded-md bg-white mb-2">
                    <div className="flex items-center">
                      <span className="text-[32px] font-semibold">
                        {value?.occupancy}
                      </span>{" "}
                      <span className="text-[18px] ml-3">
                        tickets booked for {value?.name} movie.
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
        {movies?.map((movie: IMovie) => {
          return (
            <Meta
              title={
                <div
                  className="flex justify-between items-center"
                  onClick={() => {
                    console.log(movie);
                    setSelectedMovie(movie);
                    form.setFieldsValue({
                      ...movie,
                      start_date: moment(movie.start_date, "YYYY-MM-DD"),
                    });
                    showModal("movies");
                  }}
                >
                  <div>
                    {movie.name.length > 25
                      ? movie.name.substring(0, 25) + "..."
                      : movie.name}
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      DeleteMovie(movie.id);
                    }}
                  >
                    <DeleteTwoTone />
                  </div>
                </div>
              }
              description={
                <div className="flex items-center justify-between">
                  <span>
                    {movie.genre.length > 15
                      ? getMovieGenre(movie.genre).substring(0, 15) + "..."
                      : getMovieGenre(movie.genre)}
                  </span>
                  <span>
                    <StarTwoTone className="mr-1" />
                    {movie.rating}
                  </span>
                </div>
              }
              className="bg-white p-3 rounded-md border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] cursor-pointer hover:shadow-md"
            />
            // </Card>
          );
        })}
      </div>
    </div>
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 90 days</div>
          <div>
            {analytics?.movies_90_days &&
              Object.entries(analytics?.movies_90_days!).map(
                ([key, value]: any) => (
                  <div className="w-[95%] border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] p-3 rounded-md bg-white mb-2">
                    <div className="flex items-center">
                      <span className="text-[32px] font-semibold">
                        {value?.occupancy}
                      </span>{" "}
                      <span className="text-[18px] ml-3">
                        tickets booked for {value?.name} movie.
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default summaryboard;
