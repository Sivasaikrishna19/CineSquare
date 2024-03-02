import { message } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

interface ISeatMap {
  selectedSeats: Array<string>;
  setSelectedSeats: (selectedSeats: Array<string>) => void;
  preBookedSeats: Array<string>;
  rows_m: number;
  columns_n: number;
}

const SeatMap = ({
  selectedSeats,
  setSelectedSeats,
  preBookedSeats,
  rows_m,
  columns_n,
}: ISeatMap) => {
  function generateArrays(
    m: number,
    n: number
  ): { rows: Array<string>; columns: Array<string> } {
    const rows: Array<string> = Array.from({ length: m }, (_, index) =>
      String.fromCharCode(65 + index)
    );
    const columns: Array<string> = Array.from({ length: n }, (_, index) =>
      (index + 1).toString()
    );

    return { rows, columns };
  }
  const { rows, columns } = generateArrays(rows_m, columns_n);
  const handleSelectSeats = (seat: string) => {
    let tempSelectedSeats: Array<string> = [...selectedSeats];
    if (tempSelectedSeats.includes(seat)) {
      tempSelectedSeats = tempSelectedSeats.filter(
        (selectedSeat) => selectedSeat !== seat
      );
    } else {
      tempSelectedSeats.push(seat);
    }

    setSelectedSeats(tempSelectedSeats);
  };

  return (
    <div>
      <div className="flex justify-center items-center p-3 bg-[#e0e0e0] mb-10">
        <span>Screen</span>
      </div>
      <div>
        {rows.map((row: string) => {
          return (
            <>
              <div className="flex justify-center items-center w-full mb-2">
                {columns.map((column: string) => {
                  let tempSeat = row + column;
                  return (
                    <div
                      className={`${
                        preBookedSeats.includes(tempSeat)
                          ? "bg-gray-300 text-white pointer-none"
                          : ""
                      } ${
                        selectedSeats.includes(tempSeat)
                          ? "bg-green-600 text-white"
                          : "bg-blue-400"
                      } p-2 px-3 rounded-t-md m-auto text-sm cursor-pointer hover:text-[white]`}
                      onClick={() => {
                        if (preBookedSeats.includes(tempSeat) === false) {
                          if (
                            selectedSeats.includes(tempSeat) ||
                            selectedSeats.length < 8
                          ) {
                            handleSelectSeats(tempSeat);
                          } else {
                            message.warning(
                              "You have reached maximum ticket booking limit!"
                            );
                          }
                        }
                      }}
                    >
                      {tempSeat}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-evenly">
        <div className="flex items-center">
          <div className="p-2 px-3 rounded-t-md m-auto text-sm cursor-pointer hover:text-[white] bg-blue-400">
            <span className="text-blue-400">A</span>
          </div>
          <span className="ml-2">Available</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="p-2 px-3 rounded-t-md m-auto text-sm cursor-pointer hover:text-[white] bg-gray-300">
            <span className="text-gray-300">A</span>
          </div>
          <span className="ml-2">Booked</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="p-2 px-3 rounded-t-md m-auto text-sm cursor-pointer hover:text-[white] bg-green-600">
            <span className="text-green-600">A</span>
          </div>
          <span className="ml-2">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
