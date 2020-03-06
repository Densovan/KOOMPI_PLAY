import React from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
const Login = () => {
  const onFinish = values => {
    axios
      .post("/api/users/login", values)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
    console.log("Received values of form: ", values);
  };
  return (
    <div className="login-box">
      <Form
        size="large"
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <center className="avatar-login">
          <img src="/img/undraw_profile_pic_ic5t.svg" />
        </center>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Username!"
            }
          ]}
        >
          <Input
            type="email"
            style={{ borderRadius: "14px", border: "none" }}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
              min: 6
            }
          ]}
        >
          <Input
            style={{ borderRadius: "14px", border: "none" }}
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {/* <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item> */}

        <Form.Item>
          <Button
            shape="round"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
