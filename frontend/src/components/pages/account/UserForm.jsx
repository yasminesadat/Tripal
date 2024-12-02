import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Row,
  Typography,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { login } from "../../../api/UserService";

const { Title, Text } = Typography;

export default function UserForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = (role) => {
    if (role === "Admin") {
      window.location.href = "/admin";
    } else if (role === "Tourist") {
      window.location.href = "/tourist";
    } else if (role === "Advertiser") {
      window.location.href = "/advertiser";
    } else if (role === "Tour Guide") {
      window.location.href = "/tourguide";
    } else if (role === "Seller") {
      window.location.href = "/seller";
    } else if (role === "Tourism Governor") {
      window.location.href = "/governor";
    }
  };

  const onFinish = async () => {
    setLoading(true);
    const response = await login(
      form.getFieldValue("userName"),
      form.getFieldValue("password")
    );
    setLoading(false);
    if (response.status == "success") {
      message.success(response.message);
      handleLogin(response.role);
    } else if (response.status == "warning") {
      message.warning(response.message);
    } else {
      message.error(response.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please check the form and try again.");
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Card
        bordered={false}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "55%",
          marginLeft: "10%",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          We&apos;re glad to see you again!
        </Title>
        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "1rem",
            color: "black", // Custom color for the "Sign Up" text
          }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" className="sign-up-link">
            Sign Up
          </Link>
        </Text>

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{ remember: true }}
          requiredMark={false}
          style={{ width: "100%" }}
        >
          {/* Username Field */}
          <Form.Item
            label="Username"
            name="userName"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              size="large"
              style={{
                height: "50px",
                border: "1px solid #d9d9d9",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent",
              }}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password
              size="large"
              style={{ height: "50px" }}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Remember Me and Forgot Password */}
          <Form.Item>
            <Row justify="space-between" align="middle">
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" className="sign-up-link">
                Forgot password?
              </Link>
            </Row>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="custom-button"
              style={{ width: "100%", height: "50px" }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <style>{`

        .sign-up-link {
          color: var(--color-stone)!important;
          font-weight: bold;
        }
        .sign-up-link:hover {
          color: var(--color-stone-light)!important;
          font-weight: bold;
        }
        .custom-button {
          background-color: var(--color-dark-purple) !important;
          border-color: var(--color-dark-purple)!important;
        }
        .custom-button:hover,
        .custom-button.ant-btn:hover,
        .custom-button.ant-btn:focus,
        .custom-button.ant-btn-primary:hover {
          background-color: var(--color-light-purple) !important;
          border-color: var(--color-light-purple) !important;
        }

        /* Custom outline color for input fields */
        .ant-input:focus,
        .ant-input-focused,
        .ant-input-password .ant-input:focus,
        .ant-input-password .ant-input-focused,
        .ant-input-affix-wrapper:focus, /* For password visibility toggle */
        .ant-input-affix-wrapper-focused {
          border-color: var(--color-light-purple) !important;
          box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
        }

        /* Custom hover color for password field */
        .ant-input-password:hover,
        .ant-input-password:focus,
        .ant-input-password-focused:hover {
          border-color: var(--color-light-purple) !important;
          box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
        }

        /* Fix for input hover color issue in password field */
        .ant-input-password .ant-input-affix-wrapper:hover {
          border-color: var(--color-light-purple) !important;
          box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
        }

        /* Username input default border color to gray */
        .ant-input {
          border-color: #d9d9d9 !important;  /* Default grey border */
        }

        /* Focused username field should change to light purple */
        .ant-input:focus {
          border-color: var(--color-light-purple) !important;
          box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
        }

        /* Change "Remember me" checkbox color to pink */
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: var(--color-pink) !important;
          border-color: var(--color-pink) !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner::after {
          border-color: white !important;  /* White checkmark for contrast */
        }

        .ant-checkbox:hover .ant-checkbox-inner {
          border-color: var(--color-pink) !important;  /* Hover border color */
        }

        .ant-checkbox-wrapper:hover .ant-checkbox-inner {
          border-color: var(--color-pink) !important;  /* Ensure hover color works */
        }

        /* Ensure the visibility icon remains light purple when clicked */
        .ant-input-password .ant-input-suffix .anticon {
          color: var(--color-light-purple) !important; /* Always light purple */
        }

        /* Ensure the password visibility icon stays light purple in all states */
        .ant-input-password .ant-input-suffix .anticon:focus,
        .ant-input-password .ant-input-suffix .anticon:active,
        .ant-input-password .ant-input-suffix .anticon:hover,
        .ant-input-password .ant-input-suffix .anticon:focus-visible {
          color: var(--color-light-purple) !important;  /* Ensure icon remains light purple */
        }

        /* Prevent default blue color on icon in active state */
        .ant-input-password .ant-input-suffix .anticon.anticon-eye,
        .ant-input-password .ant-input-suffix .anticon.anticon-eye-invisible {
          color: var(--color-light-purple) !important;  /* Enforce light purple for the eye icon */
        }
      `}</style>
    </>
  );
}
