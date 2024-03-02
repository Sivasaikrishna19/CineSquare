import React, { useEffect } from "react";
import { IShow } from "../../../Interfaces/show.interface";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_URL } from "../../../env";
import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";

export interface IShowInterface {
  showModal: (type: string) => void;
  shows: Array<IShow>;
  getShows: () => void;
  form: any;
  setSelectedShow: any;
}

const Shows = ({
  showModal,
  shows,
  getShows,
  form,
  setSelectedShow,
}: IShowInterface) => {
  useEffect(() => {
    console.log(shows, "shows");
  }, [shows]);
  const DeleteShow = (id: number) => {
    axios
      .delete(BASE_URL + "shows/show/" + id)
      .then((res) => {
        console.log(res);
        getShows();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {shows?.map((show: IShow) => {
        return (
          <div
            className="w-[95%] border-[1px] border-solid border-[#e0e0e0] p-3 mb-2 rounded-md border-l-[4px] border-l-[#6BE9FA] flex items-between justify-between"
            onClick={() => {
              console.log(show);
              setSelectedShow(show);
              form.setFieldsValue(show);
              //   showModal("shows");
            }}
          >
            <div className="flex items-center">
              <div className="mr-4"> Movie :{show.movie.name}</div>{" "}
              <div className="mr-4">Theater :{show.theater.name}</div>
              <div className="mr-4">
                Show Timing :
                {dayjs(show.show_timing).format("dddd, MMMM DD, YYYY, h:mm A ")}
              </div>
            </div>
            <DeleteTwoTone
              className="cursor-pointer"
              onClick={() => {
                DeleteShow(show.id);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Shows;
