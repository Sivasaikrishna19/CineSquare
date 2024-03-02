import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../env";
import axios from "axios";

const Analytics = () => {
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
        <div>
          <div className="mb-2 font-semibold text-[20px]">Past 60 days</div>
          <div>
            {analytics?.movies_60_days &&
              Object.entries(analytics?.movies_60_days!).map(
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

export default Analytics;
