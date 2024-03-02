import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../state/hooks";
import { BASE_URL } from "../../env";
import axios from "axios";
import { IUserData } from "../../Interfaces/userInfo.interface";
import dayjs from "dayjs";
import { Avatar, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../state/reducers/authReducer/authReducer";

const UserProfile = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [userData, setUserData] = useState<IUserData>();
  const [cancelId, setCancelId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    CancelTicket(cancelId!);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getUserInfo = () => {
    axios
      .get(BASE_URL + "/account/user/" + userInfo.id)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  useEffect(() => {
    getUserInfo();
  }, [userInfo]);
  useEffect(() => {
    console.log(userData, "user data");
  }, [userData]);

  const CancelTicket = (id: number) => {
    axios
      .patch(BASE_URL + "booking/ticket/cancel/" + id, {})
      .then((res) => {
        message.success("Ticket Cancelled Successfully!");
        getUserInfo();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const UpdateMembershipStatus = () => {
    axios
      .patch(BASE_URL + "account/user/" + userInfo.id, {
        membership_type: "regular",
      })
      .then((res) => {
        dispatch(setUserInfo(res.data));
        localStorage.setItem("userInfo", JSON.stringify(res.data));
      })
      .catch((e) => {
        message.success(e.message);
      });
  };
  return (
    <div className="w-full flex flex-col">
      <div className="font-semibold mb-4 text-[28px]">User Profile</div>
      <div className="m-auto shadow-lg rounded-md flex w-full items-center p-3 mb-4">
        <div className="mr-4">
          <Avatar className="bg-[#6BE9FA] uppercase" size={50}>
            {userInfo?.username[0]}
          </Avatar>
        </div>
        <div className="w-full">
          <div className="mb-2">
            <span className="font-semibold mr-3">Name</span>
            {userInfo.username}
          </div>
          <div className="mb-2">
            <span className="font-semibold mr-3">Email</span>
            {userInfo.email}
          </div>
          <div className="mb-2">
            <span className="font-semibold mr-3">Phone Number</span>
            {userInfo.phoneNumber}
          </div>
          {/* <div className="mb-2">
            <span className="font-semibold mr-3">Reward points</span>
            {userInfo.rewardPoints}
          </div> */}
          {userInfo.membership_type === "premium" && (
            <div
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                UpdateMembershipStatus();
              }}
            >
              Cancel Premium Membership
            </div>
          )}
        </div>
      </div>
      <div className="font-semibold mb-4 text-[28px]">Bookings</div>
      <div className="w-full">
        {userData?.tickets.map((ticket) => {
          return (
            <div className="p-3 border-[#e0e0e0] border-[1px] w-full border-solid rounded-md mb-2 border-l-[4px] border-l-[#6BE9FA]">
              <div className="font-semibold mb-2 flex items-center justify-between">
                <div>
                  <span>Movie : </span>
                  {ticket.movie.name}
                </div>
                {ticket.status !== "cancelled" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setCancelId(ticket.id);
                      showModal();
                    }}
                  >
                    <span className="text-red-400">Cancel Booking</span>
                  </div>
                )}
              </div>
              <div className="font-semibold mb-2">
                <span>Theater : </span>
                {ticket.theater.name}
              </div>
              <div className="mb-2">
                <span className="mr-2">Seats</span>
                {ticket.seats.map((seat: string) => {
                  return seat + " ";
                })}
              </div>
              <div className="mb-2">
                Timing:{" "}
                {" " + dayjs(ticket.show.show_timing).format("YYYY-MM-DD")},
                {dayjs(ticket.show.show_timing).format("h:mm A")}
              </div>
              <div>Status : {ticket.status}</div>
            </div>
          );
        })}
      </div>
      <Modal
        title="Cancel Ticket"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Do you want to cancel the ticket?
      </Modal>
    </div>
  );
};

export default UserProfile;
function setFinalPrice(arg0: number) {
  throw new Error("Function not implemented.");
}
