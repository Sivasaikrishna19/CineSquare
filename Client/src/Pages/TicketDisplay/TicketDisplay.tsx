import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ISeatmap } from "../../Interfaces/seatmap.interface";
import dayjs from "dayjs";
import { Button } from "antd";
import { useAppSelector } from "../../state/hooks";
import { CheckCircleFilled, CheckCircleTwoTone } from "@ant-design/icons";
import QRCode from "react-qr-code";

const TicketDisplay = () => {
  let val = Math.floor(1000 + Math.random() * 9000);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const data: { seatmapData: ISeatmap; selectedSeats: Array<string> } =
    location.state;

  useEffect(() => {
    console.log(data, "page data");
  }, [data]);

  return (
    <div>
      {" "}
      <div className="my-10 w-full text-[30px] text-green-500 flex items-center justify-center border-[1px] border-solid border-green-500 p-4 rounded-md bg-[#cdffcd]">
        <CheckCircleFilled style={{ color: "#65a765" }} />
        <span className="ml-2">Ticket Booked Successfully!</span>
      </div>
      <div className="font-semibold text-[24px] mb-3">Ticket</div>
      <div className="p-3 flex items-center w-full justify-center border-[#e0e0e0] border-[1px] w-full border-solid rounded-md mb-2 border-l-[4px] border-l-[#6BE9FA]">
        <div className="flex w-[160px] h-[160px] ">
          <img
            src={data.seatmapData.movie.image_url}
            alt=""
            className="rounded-md"
          />
        </div>
        <div className="w-full ml-4">
          <div className="mb-2 text-[20px] font-semibold">
            {data.seatmapData.movie.name}
          </div>
          <div className="mb-2 font-semibold">
            at {data.seatmapData.theater.name}
          </div>
          <div>
            <span className="font-semibold">Timing:</span>{" "}
            {" " +
              dayjs(data.seatmapData.show_timing).format("YYYY-MM-DD, h:mm A")}
          </div>
          <div className="w-full flex items-center mt-2">
            {" "}
            <div className="mr-2 font-semibold">Selected Seats </div>
            <div>
              {data.selectedSeats.map((seat: string) => {
                return seat + " ";
              })}
            </div>
          </div>
        </div>
        <div className="mr-4">
          <QRCode
            size={100}
            value={
              "Ticket ID :" +
              val +
              "Movie :" +
              data.seatmapData.movie.name +
              " at" +
              data.seatmapData.theater.name +
              " Timing:" +
              dayjs(data.seatmapData.show_timing).format("YYYY-MM-DD, h:mm A")
            }
          />
        </div>
      </div>{" "}
      <div className="w-full mt-10 flex justify-center">
        <Button
          type="primary"
          onClick={() => {
            userInfo.role !== "guestUser"
              ? navigate("/profile")
              : navigate("/");
          }}
        >
          {userInfo.role !== "guestUser" ? (
            <span>Go to my bookings</span>
          ) : (
            <span>Book more tickets!</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TicketDisplay;
