import { Form, Input, Button, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useState } from "react";
import { ISignUp } from "../../Interfaces/signUp.interface";
import { useDispatch } from "react-redux";
import {
  setLogIn,
  setUserInfo,
} from "../../state/reducers/authReducer/authReducer";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../env";

const authentication = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremiumMember, setIsPremiumMember] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsPremiumMember(true);
    message.success("Payment successful");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const signUp = (data: ISignUp) => {
    axios
      .post(BASE_URL + "account/sign_up", {
        ...data,
        role: "member",
        membership_type: isPremiumMember ? "premium" : "regular",
      })
      .then((res) => {
        message.success("Signup successful");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(setLogIn({}));
        dispatch(setUserInfo(res.data));
        navigate("/");
        console.log(res);
      })
      .catch((e) => {
        message.error(e.message);
        console.log(e);
      });
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="rounded-md w-[80%] p-4 ">
        <div className="flex w-full justify-center items-center font-semibold text-[24px] mb-4 ">
          <span>Sign Up</span>
        </div>
        <div>
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
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
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
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<any>
              label="Confirm Password"
              name="confirm_password"
              rules={[
                { required: true, message: "Please confirm your password!" },
              ]}
            >
              <Input.Password />
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

            <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<any>
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<any>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div
              className="text-blue-500 cursor-pointer font-semibold"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Not a user? Join Us
            </div>
            <div>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  showModal();
                }}
              >
                Join premium membership?
              </span>
            </div>
            <div className="w-full flex justify-center mt-4">
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  console.log(
                    {
                      ...form.getFieldsValue(),
                      role: "member",
                      membership_type: isPremiumMember ? "premium" : "regular",
                    },
                    "form values"
                  );
                  signUp(form.getFieldsValue());
                }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
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

export default authentication;
