import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Tabs, message } from "antd";
import TheatreListByMovie from "./Tabs/TheatreListByMovie";
import dayjs from "dayjs";
import axios from "axios";
import { IMovie } from "../../Interfaces/movie.interface";
import { BASE_URL } from "../../env";

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState<any>();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateItems, setDateItems] = useState<any>();

  useEffect(() => {
    if (id && selectedDate) getMovieById(parseInt(id));
    console.log(id);
  }, [id, selectedDate]);
  useEffect(() => {
    console.log(selectedDate, "selected date");
    const searchParams = new URLSearchParams(location.search);
    const showDateParam = searchParams.get("showDate");

    if (showDateParam) {
      setSelectedDate(showDateParam);
    } else {
      setSelectedDate(dayjs(new Date()).format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  const getFormattedDates = () => {
    const initialDateItems = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (i === 0) {
        // initialDates.push("Today");
        initialDateItems.push({
          key: dayjs(date).format("YYYY-MM-DD"),
          label: <span className="font-semibold">Today</span>,
          children: (
            <TheatreListByMovie
              date={dayjs(date).format("YYYY-MM-DD")}
              theaters={movieData?.theaters}
            />
          ),
        });
      } else {
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
        });
        // initialDates.push(formattedDate);
        initialDateItems.push({
          key: dayjs(date).format("YYYY-MM-DD"),
          label: <span className="font-semibold">{formattedDate}</span>,
          children: (
            <TheatreListByMovie
              date={dayjs(date).format("YYYY-MM-DD")}
              theaters={movieData?.theaters}
            />
          ),
        });
      }
    }
    setDateItems(initialDateItems);
  };

  useEffect(() => {
    if (movieData) getFormattedDates();
  }, [movieData]);

  const handleTabChange = (activeKey: string) => {
    setSelectedDate(activeKey);
    const newQueryParams = new URLSearchParams();
    newQueryParams.set("showDate", activeKey);
    navigate({ search: `?${newQueryParams.toString()}` });
  };

  const getMovieById = (id: number) => {
    message.loading({
      type: "loading",
      content: "Loading...",
      key: "loading_msg",
    });
    axios
      .get(BASE_URL + "shows/get-shows/" + id, {
        params: { date: selectedDate },
      })
      .then((res) => {
        setMovieData(res.data);
        console.log(res.data, "movie data");
        message.destroy("loading_msg");
      })
      .catch((e) => {
        message.destroy("loading_msg");
        console.log(e);
      });
  };

  return (
    <>
      <div>
        <div className="mb-2">
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <figure className="max-w-lg">
            <img
              className="h-auto max-w-xl min-w-full max-h-80 rounded-lg"
              src={movieData?.movie?.image_url}
              alt="image description"
            />
          </figure>
          <div className="flex flex-col items-center">
            <span className="text-center text-3xl font-bold mx-2 p-2">
              {movieData?.movie?.name}
            </span>
            <div className="text-gray-500">{movieData?.movie?.description}</div>
          </div>
        </div>
        <Tabs
          items={dateItems}
          activeKey={selectedDate}
          onChange={(e) => {
            handleTabChange(e);
          }}
        />
      </div>
    </>
  );
};

export default MovieDetail;
