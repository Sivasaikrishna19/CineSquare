import React, { useEffect, useState } from "react";

import { DeleteTwoTone } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../../env";
import { ITheater } from "../../../Interfaces/theater.interface";

interface TheaterConfigurations {
  showModal: (type: string) => void;
  theaters: Array<ITheater>;
  getTheaters: () => void;
  setSelectedTheater: any;
  form: any;
}

const Theaters = ({
  showModal,
  theaters,
  getTheaters,
  setSelectedTheater,
  form,
}: TheaterConfigurations) => {
  useEffect(() => {
    console.log(theaters, "movies");
  }, [theaters]);
  const DeleteTheater = (id: number) => {
    axios
      .delete(BASE_URL + "theater/theater/" + id)
      .then((res) => {
        console.log(res);
        getTheaters();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div>
      {" "}
      <div className="grid grid-cols-2 gap-4">
        {theaters?.map((theater: ITheater) => {
          return (
            <div
              className="rounded-md border-[1px] border-l-[4px] border-l-[#6BE9FA] border-[#e0e0e0] border-solid p-2 hover:shadow-md cursor-pointer"
              onClick={() => {
                form.setFieldsValue(theater);
                setSelectedTheater(theater);
                showModal("theaters");
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  {theater?.name.length > 40
                    ? theater.name.substring(0, 40) + "..."
                    : theater.name}
                </div>
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    DeleteTheater(theater.id);
                  }}
                >
                  <DeleteTwoTone />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-400 text-[12px]">
                  {theater.short_address}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Theaters;
