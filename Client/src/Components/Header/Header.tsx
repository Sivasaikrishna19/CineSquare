import {
  CrownOutlined,
  CrownTwoTone,
  LoginOutlined,
  LogoutOutlined,
  MailTwoTone,
  MenuOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Modal, Space, message } from "antd";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLogOut,
  setUserInfo,
} from "../../state/reducers/authReducer/authReducer";
import { useAppSelector } from "../../state/hooks";
import axios from "axios";
import { BASE_URL } from "../../env";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state: any) => state.auth.isLoggedIn);
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  useEffect(() => {
    console.log(isLoggedIn, userInfo);
  }, [isLoggedIn, userInfo]);

  const items: MenuProps["items"] = [
    {
      label: (
        <span
          className="text-blue-600"
          onClick={() => {
            navigate("/contact");
          }}
        >
          <MailTwoTone className="mr-1" /> Contact Us
        </span>
      ),
      key: "0",
    },
    userInfo?.is_admin === true
      ? {
          label: (
            <span
              className="text-blue-600"
              onClick={() => {
                navigate("/configurations");
              }}
            >
              <SettingOutlined className="mr-1" />
              Admin Settings
            </span>
          ),
          key: "2",
        }
      : {
          label: (
            <span
              className="text-blue-600"
              onClick={() => {
                console.log("test");
                if (userInfo.role === "guestUser") {
                  message.warning("Signup to get user profile");
                } else {
                  navigate("/profile");
                }
              }}
            >
              <SettingOutlined className="mr-1" />
              Profile
            </span>
          ),
          key: "5",
        },
    {
      type: "divider",
    },
    {
      label: (
        <span className="text-blue-600">
          <LogoutOutlined className="mr-1" />
          Log Out
        </span>
      ),
      key: "3",
      onClick: () => {
        localStorage.clear();
        dispatch(setLogOut({}));
        dispatch(setUserInfo(null));
        navigate("/");
      },
    },
  ];
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremiumMember, setIsPremiumMember] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsPremiumMember(true);
    message.success("Payment successful");
    UpdateMembershipStatus();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const UpdateMembershipStatus = () => {
    axios
      .patch(BASE_URL + "account/user/" + userInfo.id, {
        membership_type: "premium",
      })
      .then((res) => {
        dispatch(setUserInfo(res.data));
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setIsModalOpen(false);
      })
      .catch((e) => {
        message.success(e.message);
      });
  };

  return (
    <div className="py-4 bg-[#6BE9FA] flex justify-between items-center px-60 z-40 sticky top-0 shadow-lg">
      <div className="flex items-center">
        <div
          className="text-[32px] font-semibold cursor-pointer"
          onClick={() => {
            navigate("/movies");
          }}
        >
          <img src="https://svgsilh.com/svg/2027080.svg" className="w-[40px]" />
          <span className="ml-2">CineSquare</span>
        </div>{" "}
        <div
          className="ml-14 mr-4 font-semibold hover:text-white cursor-pointer"
          onClick={() => {
            navigate("/movies");
          }}
        >
          Movies
        </div>
        <div
          className="mr-4 font-semibold hover:text-white cursor-pointer"
          onClick={() => {
            navigate("/theaters");
          }}
        >
          Theatres
        </div>
      </div>
      <div className="flex items-center">
        {!isLoggedIn && (
          <div className="flex items-center">
            <Button
              className="mr-4"
              onClick={() => {
                navigate("/signup");
              }}
            >
              <UserAddOutlined /> Join Us
            </Button>

            <Button
              className="mr-16"
              onClick={() => {
                navigate("/login");
              }}
            >
              <LoginOutlined />
              Sign In
            </Button>
          </div>
        )}
        {isLoggedIn == true && (
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div>
                <div className="flex items-center mr-2 font-semibold cursor-pointer">
                  <Avatar className="mr-2 uppercase">
                    {userInfo?.username[0]}
                  </Avatar>{" "}
                  <div>
                    <span>
                      Hi,&nbsp;{" "}
                      <span> {capitalizeFirstLetter(userInfo?.username)}</span>
                    </span>
                    {userInfo.membership_type === "premium" && (
                      <div className="font-md text-[12px] mt-1">
                        Premium member
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Dropdown>
            {userInfo.membership_type !== "premium" && (
              <span
                className="ml-3 text-[12px] cursor-pointer hover:text-blue-500"
                onClick={showModal}
              >
                <CrownOutlined className="mr-1" />
                Get Premium
              </span>
            )}
          </>
        )}
      </div>
      <Modal
        title="Premium membership"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Pay"}
      >
        Premium membership costs 15$ per year
      </Modal>
    </div>
  );
};

export default Header;
