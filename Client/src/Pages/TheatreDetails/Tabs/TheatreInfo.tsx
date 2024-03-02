import React, { useEffect } from "react";
import { ITheater } from "../../../Interfaces/theater.interface";
interface ITheaterInfo {
  theater: ITheater;
}
const TheatreInfo = ({ theater }: ITheaterInfo) => {
  useEffect(() => {
    console.log(theater, "theater data");
  }, [theater]);

  return (
    <div>
      <div className="text-xl font-semibold">{theater?.name}</div>
      <div className="my-2">{theater?.short_address}</div>
    </div>
  );
};

export default TheatreInfo;
