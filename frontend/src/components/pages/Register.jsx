import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Select, DatePicker, Radio, message, Upload, Checkbox } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import { nationalities } from "../../assets/Nationalities";
import { useNavigate } from "react-router-dom";
import { createTourist } from "@/api/TouristService";
import { createRequest, SetRequestStatus } from "@/api/RequestService";
const { Option } = Select;

const RegisterIllustration = () => (
  <svg viewBox="0 0 400 300" className="register-illustration floating">
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dac4d0" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#e0829d" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#dac4d0" />
        <stop offset="100%" stopColor="#e0829d" />
      </linearGradient>
    </defs>

    {/* Background elements */}
    <circle cx="200" cy="150" r="120" fill="url(#gradient1)" className="pulse" />
    <circle cx="300" cy="100" r="50" fill="url(#gradient1)" className="float-slow" />
    <circle cx="100" cy="200" r="70" fill="url(#gradient1)" className="float-delay" />

    {/* Airplane */}
    <g className="float-slow" transform="translate(220,100) rotate(15)">
      <path d="M0,20 L-5,25 L-40,25 L-45,20 L-40,15 L-5,15 L0,20" fill="#dac4d0" />
      <path d="M0,20 L60,20 L65,25 L60,30 L0,30 L-5,25 L0,20" fill="#dac4d0" />
      <path d="M45,15 L55,20 L45,25" fill="#dac4d0" />
      <path d="M10,10 L20,20 L10,30" fill="#dac4d0" />
    </g>

    {/* Suitcase */}
    <g className="float">
      <rect x="120" y="120" width="100" height="80" rx="8" fill="url(#gradient2)" />
      <rect x="120" y="110" width="100" height="20" rx="5" fill="#dac4d0" />
      <rect x="160" y="105" width="20" height="10" rx="2" fill="#dac4d0" />
      <circle cx="135" cy="170" r="8" fill="#fff" opacity="0.6" />
      <circle cx="205" cy="170" r="8" fill="#fff" opacity="0.6" />
    </g>

    {/* Travel elements */}
    <g className="float-reverse">
      <circle cx="280" cy="160" r="15" fill="#dac4d0" opacity="0.5" />
      <text x="280" y="165" textAnchor="middle" fill="#fff" fontSize="14">✈</text>
    </g>
    <g className="float-delay">
      <circle cx="150" cy="80" r="12" fill="#dac4d0" opacity="0.5" />
      <text x="150" y="84" textAnchor="middle" fill="#fff" fontSize="12">🌍</text>
    </g>
    <g className="pulse">
      <circle cx="320" cy="200" r="10" fill="#dac4d0" />
      <text x="320" y="204" textAnchor="middle" fill="#dac4d0" fontSize="10">🗺</text>
    </g>

    {/* Dotted path */}
    <path
      d="M100,180 Q200,120 300,160"
      stroke="#dac4d0"
      strokeWidth="2"
      strokeDasharray="5,5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

export default function Register() {
  const [requestId, setRequestId] = useState('')
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [role, setRole] = useState("tourist");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState("");




  const handleRoleChange = (e) => {
    setRole(e.target.value);
    form.resetFields();
    setTermsAndConditionsCheck(false);
    setCurrentTab(0);
  };
  const handleDocumentChange = (info) => {
    if (info.fileList.length === 0) {
      setDocumentUploaded("");
      return;
    }

    const file = info.fileList[0].originFileObj;

    // Optional: Add validations
    if (file.type !== 'application/pdf') {
      message.error('Please upload a PDF file only!');
      setDocumentUploaded("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('File must be smaller than 5MB!');
      setDocumentUploaded("");
      return;
    }

    setDocumentUploaded(file);
  };

  const handleRemove = () => {
    setFormData({ ...formData, document: null });
  };

  const handleSubmit = async (values) => {
    if (!termsAccepted) {
      message.warning("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const formattedDateOfBirth = role === "tourist"
        ? new Date(values.dateOfBirth).toISOString().split("T")[0]
        : values.dateOfBirth;

      const commonUser = {
        userName: values.userName,
        email: values.email,
        password: values.password,
      };

      let newUser;
      let response;

      if (role === "tourist") {
        newUser = {
          ...commonUser,
          mobileNumber: values.mobileNumber,
          nationality: values.nationality,
          dateOfBirth: formattedDateOfBirth,
          job: values.job,
        };
      } else {
        newUser = commonUser;
      }

      try {
        if (role === "seller") {
          response = await createRequest({
            ...commonUser,
            role: "Seller",
          }, documentUploaded);

          navigate("/pendingRequest", {
            state: {
              ...commonUser,
              role: "Seller"
            }
          });
        } else if (role === "tour-guide") {
          response = await createRequest({
            ...commonUser,
            role: "Tour Guide",
          }, formData.document);

          navigate("/seller/pending", {
            state: {
              ...commonUser,
              role: "Tour Guide"
            }
          });
        } else if (role === "advertiser") {
          response = await createRequest({
            ...commonUser,
            role: "Advertiser",
          }, formData.document);

          navigate("/seller/pending", {
            state: {
              ...commonUser,
              role: "Advertiser"
            }
          });
        } else if (role === "tourist") {
          response = await createTourist(newUser);
          const touristId = response.data.id || response.data._id;
          // navigate(`/tourist/select-preferences/${touristId}`, { state: { touristId } });
          //MENNAH ADD UR STUFF HEREEE !
        }

        setLoading(false);
        message.success("Registration successful!");
      } catch (error) {
        setLoading(false);
        message.error(error.message); // Display backend error
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="illustration-section">
          <RegisterIllustration />
          <div className="welcome-text">
            <h2>Welcome to Tripal</h2>
            <p>Your gateway to extraordinary travel experiences</p>
          </div>
        </div>

        <div className="register-card">
          <div className="register-header">
            <div className="logo-section">
              <div className="brand-circle">T</div>
              <h1>Tripal</h1>
            </div>
            <p>Start your journey with us</p>
          </div>

          <div className="register-form-container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              validateTrigger="onBlur"
            >
              <div className="role-tabs">
                <Radio.Group
                  value={role}
                  onChange={handleRoleChange}
                  buttonStyle="solid"
                >
                  <Radio.Button value="tourist">Tourist</Radio.Button>
                  <Radio.Button value="seller">Seller</Radio.Button>
                  <Radio.Button value="tour-guide">Tour Guide</Radio.Button>
                  <Radio.Button value="advertiser">Advertiser</Radio.Button>
                </Radio.Group>
              </div>

              <div className="form-sections">
                <div className="form-section">
                  <h3>Account Information</h3>
                  <Form.Item
                    name="userName"
                    rules={[{ required: true, message: "Username is required" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Please enter a valid email" }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email Address" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" },
                      { min: 8, message: "Password must be at least 8 characters" }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                </div>

                {role === "tourist" && (
                  <div className="form-section">
                    <h3>Personal Details</h3>
                    <Form.Item
                      name="mobileNumber"
                      rules={[{ required: true, message: "Mobile number is required" }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" />
                    </Form.Item>

                    <Form.Item
                      name="nationality"
                      rules={[{ required: true, message: "Please select nationality" }]}
                    >
                      <Select
                        placeholder="Select Nationality"
                        suffixIcon={<GlobalOutlined />}
                      >
                        {nationalities.map((nationality, index) => (
                          <Option key={index} value={nationality}>{nationality}</Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <div className="two-columns">
                      <Form.Item
                        name="dateOfBirth"
                        rules={[{ required: true, message: "Date of birth is required" }]}
                      >
                        <DatePicker
                          placeholder="Date of Birth"
                          format="DD/MM/YYYY"
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>

                      <Form.Item
                        name="job"
                        rules={[{ required: true, message: "Job is required" }]}
                      >
                        <Input prefix={<IdcardOutlined />} placeholder="Occupation" />
                      </Form.Item>
                    </div>
                  </div>
                )}

                {role !== "tourist" && (
                  <div className="form-section">
                    <h3>Documents</h3>
                    <Form.Item
                      name="document"
                      rules={[{ required: true, message: "Please upload required documents" }]}
                    >
                      <Upload.Dragger accept=".pdf" onChange={handleDocumentChange}
                        onRemove={handleRemove} beforeUpload={() => false} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                          {role === "tour-guide"
                            ? "Upload ID & Certificate"
                            : "Upload ID & Tax Registry"}
                        </p>
                        <p className="ant-upload-hint">
                          Click or drag file to this area to upload
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </div>
                )}

                <div className="form-section">
                  <Form.Item>
                    <div className="terms-section">
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      >
                        I accept the <Link to="/terms" className="terms-link">Terms & Conditions</Link>
                      </Checkbox>
                    </div>
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={!termsAccepted}
                    block
                  >
                    Create Account
                  </Button>

                  <div className="login-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <style>{`
      

        /* Layout Styles */
        .register-page {
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 80px;
        }

        .register-container {
          display: flex;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        /* Illustration Styles */
        .illustration-section {
          flex: 1;
          max-width: 400px;
          display: none;
          margin-top: -40px;
        }

        .register-illustration {
          width: 100%;
          height: auto;
          transform-origin: center;
          animation: float 6s ease-in-out infinite;
        }

        /* Animation Keyframes */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.3; }
        }

        /* Animation Classes */
        .floating { animation: float 6s ease-in-out infinite; }
        .float-slow { animation: float-slow 8s ease-in-out infinite; }
        .float-delay { animation: float-delay 7s ease-in-out infinite 1s; }
        .float-reverse { animation: float-reverse 5s ease-in-out infinite; }
        .pulse { animation: pulse 4s ease-in-out infinite; }

        /* Welcome Text Styles */
        .welcome-text {
        

          text-align: center;
          margin-top: 24px;
          color: #8f5774;
          animation: fadeIn 0.8s ease-out;
        }

        .welcome-text h2 {

          font-size: 28px;
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .welcome-text p {
          font-size: 16px;
          opacity: 0.8;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Card Styles */
        .register-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(143, 87, 116, 0.12);
          width: 100%;
          max-width: 800px;
          overflow: hidden;
        }

        /* Header Styles */
        .register-header {
         background: var(--color-light-purple);
          padding: 30px;
          text-align: center;
          color: white;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .brand-circle {
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: #8f5774;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .register-header h1 {
          margin: 0;
          font-size: 32px;
          color: white;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .register-header p {
          margin: 5px 0 0;
          opacity: 0.9;
        }

        /* Form Container Styles */
        .register-form-container {
          padding: 40px;
        }

        /* Role Tabs Styles */
        .role-tabs {
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
        }

        /* Form Section Styles */
        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #dac4d0;
          transition: all 0.3s ease;
        }

        .form-section:hover {
          border-color: #8f5774;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(143, 87, 116, 0.1);
        }

        .form-section h3 {
          margin: 0 0 20px;
          color: #8f5774;
          font-size: 18px;
          font-weight: 600;
        }

        /* Ant Design Overrides */
        .ant-form-item {
          margin-bottom: 20px;
        }

        .ant-radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ant-radio-button-wrapper {
          border-radius: 8px !important;
          height: 36px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          border-color: #dac4d0 !important;
          transition: all 0.3s ease;
        }

        .ant-radio-button-wrapper:hover {
          color: #8f5774;
          transform: translateY(-1px);
        }

        .ant-radio-button-wrapper-checked {
          background: #8f5774 !important;
          border-color: #8f5774 !important;
          box-shadow: 0 2px 8px rgba(143, 87, 116, 0.2) !important;
        }

        /* Input Styles */
        .ant-input,
        .ant-input-password,
        .ant-select-selector,
        .ant-picker {
          height: 42px !important;
          border-radius: 8px !important;
          border: 2px solid #dac4d0 !important;
          transition: all 0.3s ease;
          background: white !important;
        }

        .ant-input-affix-wrapper {
          padding: 0 11px;
          border-radius: 8px !important;
          border: 2px solid #dac4d0 !important;
          background-color: white !important;
        }

        .ant-input-affix-wrapper input {
          border: none !important;
          height: 38px !important;
        }

        .ant-input-prefix {
          color: #8f5774;
          margin-right: 8px;
        }

        /* Focus & Hover States */
        .ant-input-affix-wrapper:hover,
        .ant-input:hover,
        .ant-input-password:hover,
        .ant-select-selector:hover,
        .ant-picker:hover {
          border-color: #8f5774 !important;
        }

        .ant-input:focus,
        .ant-input-password-focused,
        .ant-select-focused .ant-select-selector,
        .ant-picker-focused,
        .ant-input-affix-wrapper-focused {
          border-color: #8f5774 !important;
          box-shadow: 0 0 0 2px rgba(143, 87, 116, 0.1) !important;
        }

        /* Two Columns Layout */
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Button Styles */
        .ant-btn-primary {
          height: 42px;
          background: linear-gradient(135deg, #8f5774 0%, #e0829d 100%);
          border: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #7a4363 0%, #d16c89 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(143, 87, 116, 0.2);
        }

        .ant-btn-primary[disabled] {
          background: #dac4d0;
          opacity: 0.7;
        }

        /* Links & Terms */
        .terms-section {
          margin-bottom: 20px;
        }

        .terms-link {
          color: #8f5774;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }

        .login-link a {
          color: #8f5774;
          font-weight: 500;
        }

        /* Responsive Styles */
        @media (min-width: 1024px) {
          .illustration-section {
            display: block;
            transform: translateY(-40px);
          }
        }

        @media (max-width: 768px) {
          .register-card {
            margin: 20px;
          }

          .register-form-container {
            padding: 20px;
          }

          .form-section {
            padding: 20px;
          }

          .two-columns {
            grid-template-columns: 1fr;
          }

          .ant-radio-group {
            flex-direction: column;
            width: 100%;
          }

          .ant-radio-button-wrapper {
            width: 100%;
            justify-content: center;
          }
        }
          /* Upload area styles */
.ant-upload-drag {
    border: 2px dashed #dac4d0 !important;
    border-radius: 16px !important;
    padding: 20px;
    background: white !important;
}

.ant-upload-drag:hover {
    border-color: #8f5774 !important;
}

.ant-upload-drag-icon {
    color: #8f5774 !important;
}

.ant-upload-drag-icon .anticon {
    color: #8f5774 !important;
    font-size: 48px;
}

.ant-upload-text {
    color: #333;
    margin: 8px 0;
}

.ant-upload-hint {
    color: #666;
}
      `}</style>
    </div>
  );
}

