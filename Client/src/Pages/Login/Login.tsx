import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { IlogIn } from "../../Interfaces/logIn.interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setLogIn,
  setUserInfo,
} from "../../state/reducers/authReducer/authReducer";
import { BASE_URL } from "../../env";

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logIn = (data: IlogIn) => {
    axios
      .post(BASE_URL + "account/login", data)
      .then((res) => {
        message.success("Login successful");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(setLogIn({}));
        dispatch(setUserInfo(res.data));
        navigate("/movies");
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
          <span>Login</span>
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

            <div className="w-full flex justify-center mt-4">
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  console.log(
                    form.getFieldsValue(),

                    "form values"
                  );
                  logIn(form.getFieldsValue());
                }}
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
