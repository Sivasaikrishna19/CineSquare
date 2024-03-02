import { Card, Button, message } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ITheater } from "../../../Interfaces/theater.interface";
import { theatres_data } from "../../../data/Theatres/theatres_data";
import dayjs from "dayjs";

export interface TheatreListByMovie {
  date: string;
  theaters: any;
}

const TheatreListByMovie = (props: TheatreListByMovie) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(props.theaters, "theaters data");
    if (props.theaters.length == 0)
      message.warning("Oops! Shows for this movie are not added yet!");
  }, [props]);

  return (
    <div className="pt-10 w-[80%] grid grid-cols-2 gap-6">
      {props?.theaters?.map(
        (theater: {
          theater: ITheater;
          shows: Array<{ id: number; show_timing: string }>;
        }) => {
          return (
            <Card
              title={
                theater?.theater?.name?.length > 30 ? (
                  <span className="font-bold">
                    {theater.theater.name.substring(0, 30) + "..."}
                  </span>
                ) : (
                  <span className="font-bold">{theater?.theater?.name}</span>
                )
              }
              style={{ minWidth: 300 }}
              className="cursor-pointer"
            >
              <div>{theater?.theater.short_address}</div>
              <div className="flex flex-wrap gap-3 pt-8">
                {theater?.shows?.map(
                  (show: { id: number; show_timing: string }) => {
                    return (
                      <Button
                        onClick={() => {
                          // navigate(
                          //   `/seatmap?theaterId=${data.id}&movieId=${theater.theater.id}&showDate=${props.date}&showTime=${time}`,
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
  );
};

export default TheatreListByMovie;
