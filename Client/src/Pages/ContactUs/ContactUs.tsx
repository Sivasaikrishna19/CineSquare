import axios from "axios";
import React, { useEffect, useState } from "react";

const ContactUs = () => {
  return (
    <div>
      <div className="w-full flex items-center justify-center mt-4">
        {" "}
        <span className="font-semibold text-[28px]">Team Tech Titans</span>
      </div>
      <div className="w-full ">
        <div className="flex w-full justify-between my-4 font-semibold p-3 rounded-md border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] cursor-pointer hover:shadow-md">
          <div>Nekkalapu Siva Sai Krishna {"(Frontend)"}</div>

          <div>sivasaikrishna.nekkalapu@sjsu.edu</div>
        </div>
        <div className="flex w-full justify-between my-4 font-semibold p-3 rounded-md border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] cursor-pointer hover:shadow-md">
          <div>Hrithik Puppala {"(Backend)"}</div>
          <div>hrithik.puppala@sjsu.edu</div>
        </div>
        <div className="flex w-full justify-between my-4 font-semibold p-3 rounded-md border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] cursor-pointer hover:shadow-md">
          <div>Vishruth Thippabathuni {"(Frontend)"}</div>
          <div>vishruth.thippabathuni@sjsu.edu</div>
        </div>
        <div className="flex w-full justify-between my-4 font-semibold p-3 rounded-md border-l-[4px] border-l-[#6BE9FA] border-solid border-[#e0e0e0] border-[1px] cursor-pointer hover:shadow-md">
          <div>Raghavendra Dhinesh {"(Backend)"}</div>
          <div>raghavenradhinesh.gurram@sjsu.edu</div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        {" "}
        <span className="font-semibold text-[28px] mt-6">Thank you!</span>
      </div>
    </div>
  );
};

export default ContactUs;
