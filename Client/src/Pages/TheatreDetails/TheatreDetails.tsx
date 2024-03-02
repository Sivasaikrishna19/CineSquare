import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ITheater } from "../../Interfaces/theater.interface";
import { Button, Tabs, TabsProps, message } from "antd";
import FeaturedMovies from "./Tabs/FeaturedMovies";
import MoviesListByDate from "./Tabs/MoviesListByDate";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_URL } from "../../env";
import TheatreInfo from "./Tabs/TheatreInfo";

const TheatreDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const today = new Date();
  const [theater, setTheater] = useState<ITheater>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateItems, setDateItems] = useState<any>();
  const [theatersData, setTheatersData] = useState<any>();

  useEffect(() => {
    if (id && selectedDate) getTheaterById(parseInt(id));
    console.log(id);
  }, [id, selectedDate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const showDateParam = searchParams.get("showDate");

    console.log(searchParams, "search params");

    if (showDateParam) {
      setSelectedDate(showDateParam);
    } else {
      setSelectedDate(dayjs(new Date()).format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  const getTheaterById = (id: number) => {
    message.loading({
      type: "loading",
      content: "Loading...",
      key: "loading_msg",
    });
    axios
      .get(BASE_URL + "shows/get-movies/" + id, {
        params: { date: selectedDate },
      })
      .then((res) => {
        setTheatersData(res.data);
        console.log("movies data", res.data);
        message.destroy("loading_msg");
      })
      .catch((e) => {
        message.destroy("loading_msg");
        console.log(e);
      });
  };

  // useEffect(() => {
  //   getTheaterById();
  // }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Theatre Info",
      children: <TheatreInfo theater={theatersData?.theater!} />,
    },
  ];

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
            <MoviesListByDate
              date={dayjs(date).format("YYYY-MM-DD")}
              movies={theatersData?.movies}
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
            <MoviesListByDate
              date={dayjs(date).format("YYYY-MM-DD")}
              movies={theatersData?.movies}
            />
          ),
        });
      }
    }
    setDateItems(initialDateItems);
  };

  useEffect(() => {
    if (theatersData) getFormattedDates();
  }, [theatersData]);

  const handleTabChange = (activeKey: string) => {
    setSelectedDate(activeKey);

    const newQueryParams = new URLSearchParams();
    newQueryParams.set("showDate", activeKey);

    navigate({ search: `?${newQueryParams.toString()}` });
  };

  return (
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
      <div className="font-semibold text-[24px] mt-4">{theater?.name}</div>
      <Tabs items={items} />
      <div className="font-semibold text-[24px] mt-4">Showtimes</div>
      <Tabs
        items={dateItems}
        activeKey={selectedDate}
        onChange={(e) => {
          handleTabChange(e);
        }}
      />
    </div>
  );
};

export default TheatreDetails;
