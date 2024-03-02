import React, { useEffect, useRef, useState } from "react";
import SeatMap from "./SeatMap";
import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../../env";
import { ISeatmap } from "../../Interfaces/seatmap.interface";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../state/hooks";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import {
  setLogIn,
  setUserInfo,
} from "../../state/reducers/authReducer/authReducer";

const MovieSeatmap = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const { id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<Array<string>>([]);
  const [seatmapData, setSeatmapData] = useState<ISeatmap>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    GuestSignUp();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getSeatmap = () => {
    message.loading({
      type: "loading",
      content: "Loading...",
      key: "loading_msg",
    });
    axios
      .get(BASE_URL + "/shows/show/" + id)
      .then((res) => {
        console.log("show data", res.data);
        setSeatmapData(res.data.show);
        message.destroy("loading_msg");
      })
      .catch((e) => {
        message.error("Something gone wrong!");
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) getSeatmap();
  }, [id]);

  const NavigateFunc = () => {
    if (userInfo !== null && userInfo.role !== "guestUser") {
      navigate("/order-confirmation", {
        state: {
          seatmapData: { ...seatmapData, id: id },
          selectedSeats: selectedSeats,
        },
      });
    } else {
      showModal();
    }
  };

  const GuestSignUp = () => {
    axios
      .post(BASE_URL + "account/sign_up", {
        ...form.getFieldsValue(),
      })
      .then((res) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(setLogIn({}));
        dispatch(setUserInfo(res.data));
        navigate("/order-confirmation", {
          state: {
            seatmapData: { ...seatmapData, id: id },
            selectedSeats: selectedSeats,
          },
        });
        console.log(res);
      })
      .catch((e) => {
        message.error("Signup failed");
        console.log(e);
      });
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
      <div className="mb-8">
        <div className="w-full flex mb-4">
          <span className="text-[32px] font-semibold m-auto">
            {seatmapData?.movie?.name}
          </span>
        </div>
        <div className="w-full flex mb-4">
          <span className="text-[16px] font-semibold m-auto">
            {seatmapData?.theater.name}
          </span>
        </div>
        <div className="w-full flex mb-4">
          <div className="m-auto">
            <span className="text-[16px] font-semibold m-auto">
              {dayjs(seatmapData?.show_date).format("MMMM D, YYYY,h:mm A")}
            </span>
            <span className="text-[16px] font-semibold m-auto ml-2">
              {seatmapData?.show_time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%]  mr-4">
          <SeatMap
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            preBookedSeats={seatmapData?.seat_matrix || []}
            rows_m={seatmapData?.no_of_rows!}
            columns_n={seatmapData?.no_of_cols!}
          />
        </div>
        <div className="rounded-md shadow-lg w-[30%] p-3">
          <div className="flex justify-center mb-4 font-semibold">
            <span className="text-[24px]">
              Selected {selectedSeats.length} tickets
            </span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="h-full">
              <div className="mb-6 text-[16px]">
                <div className="mb-4">
                  <span className="font-semibold">Seats :</span>
                  {selectedSeats.map((selectedSeat) => {
                    return selectedSeat + " ";
                  })}
                </div>
                <div>
                  <span className="font-semibold">Price : </span>
                  {selectedSeats.length * seatmapData?.discounted_price!} $
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Button
                  type="primary"
                  onClick={() => {
                    NavigateFunc();
                  }}
                >
                  {userInfo !== null && userInfo.role !== "guestUser"
                    ? "Checkout"
                    : "Guest Checkout"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="User Info"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Checkout"}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<any>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<any>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<any>
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieSeatmap;
