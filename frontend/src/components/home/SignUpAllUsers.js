import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Radio, message, Upload, Modal, Checkbox } from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { createTourist } from "../../api/TouristService";
import { nationalities } from "../../assets/Nationalities";
import { useNavigate } from "react-router-dom";
import { createRequest, SetRequestStatus } from "../../api/RequestService";
const { Option } = Select;

const SignUpAllUsers = () => {
  const tabs = [
    {
      title: (<h2 className="text-20 fw-500">Introduction</h2>),
      content:
        (<p className="mt-10" >1.1 Acceptance of Terms
          By using Tripal, you agree to these terms and conditions.If you do not agree, please do not use our services.
          <br />
          1.2 Services Provided
          Tripal offers an online platform to browse, book, and manage flights, hotel reservations, tours, activities, and itineraries.We act as an intermediary, facilitating bookings and purchases with third - party suppliers.
          <br />
          1.3 Eligibility
          To use our services, you must be at least 18 years of age or of legal age in your jurisdiction to enter into binding contracts.
          <br />
          1.4 User Responsibilities
          You agree to provide accurate, complete, and up- to - date information.You are responsible for ensuring the accuracy of any booking details, including traveler names and contact information.
        </p>)
    },
    {
      title: (<h2 className="text-20 fw-500">Booking and Reservation Process</h2>),
      content: (<p className="mt-10" >
        2.1 Flights, Hotels, and Activities
        All bookings are subject to availability and confirmation from the relevant third-party provider. Prices may vary based on availability and are not guaranteed until a booking is confirmed.
        <br />
        2.2 Payment
        Full payment or a deposit may be required at the time of booking. Payment policies are specific to each service, as determined by the provider.
        <br />
        2.3 Cancellation and Refunds
        Cancellation policies vary depending on the service and the third-party provider's policies. Please review each provider’s policy before booking. Refunds, if available, will be processed per the provider’s terms, and [Website Name] may charge an additional processing fee.
      </p>),
    },
    {
      title: (<h2 className="text-20 fw-500">Pricing and Fees</h2>),
      content:
        (<p className="mt-10" >
          3.1 Service Fees
          Tripal may charge a service fee for booking management, support, or added convenience. Fees will be disclosed prior to finalizing your booking.
          <br />
          3.2 Price Changes and Accuracy
          We strive to provide accurate pricing information. However, Tripal cannot guarantee that prices will be the same at the time of booking, as prices can change due to market demand or provider pricing changes.
        </p>),
    },
    {
      title: (<h2 className="text-20 fw-500">Privacy</h2>),
      content: (<p className="mt-10" >
        4.1 Intellectual Property
        All content on Tripal, including text, graphics, and logos, is protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, or distribute any content without express permission.
        <br />
        4.2 User-Generated Content
        You may submit reviews, comments, and feedback on our site. By submitting content, you grant Tripal a worldwide, royalty-free license to use, display, and distribute this content.
        <br />
        4.3 Privacy and Data Protection
        Our [Privacy Policy](link to privacy policy) governs how we collect, use, and protect your personal data. Please review this policy for more information.
        <br />
        4.4 Modifications to Terms
        Tripal reserves the right to modify these terms at any time. Changes will be posted on this page, and continued use of our services signifies acceptance of any updated terms.
        <br />
        4.5 Governing Law and Jurisdiction
        These terms are governed by the laws of [Your Country/State]. Any disputes arising from these terms shall be resolved in the courts of [Your Jurisdiction].
      </p>),
    },
    {
      title: (<h2 className="text-20 fw-500">Liability and Disclaimer</h2>),
      content: (<p className="mt-10" >
        5.1 Limited Liability
        Tripal is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our services, including but not limited to travel interruptions, cancellations, loss of personal items, or changes in booking details.
        <br />
        5.2 Disclaimer of Warranties
        We provide our services "as is" and make no warranties or representations about the accuracy, reliability, or suitability of the information and services offered.
      </p>),
    }

  ];

  const [currentTab, setCurrentTab] = useState(0);
  useEffect(() => {
    const termsContainer = document.getElementById("termsContainer");
    if (termsContainer) {
      termsContainer.style.opacity = 0;
      setTimeout(() => {
        termsContainer.style.opacity = 1;
      }, 300);
    }
  }, [currentTab]);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    if (currentTab === 4) {
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
      setTermsAndConditionsCheck(true);
    }
    else {
      setCurrentTab((oldTab) => oldTab + 1);
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const [termsAndConditionsCheck, setTermsAndConditionsCheck] = useState(false);
  const [requestId, setRequestId] = useState('')
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    nationality: "",
    dateOfBirth: "",
    job: "",
    document: ""
  });
  const handleAcceptRequest = () => {
    acceptRequestFE(requestId);
  };
  const [role, setRole] = useState("seller");
  const [form] = Form.useForm();

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const acceptRequestFE = async (RequestID) => {
    try {
      const response = await SetRequestStatus(RequestID, "accepted");
      // console.log("Request accepted successfully:", response);
      return response;
    } catch (error) {
      console.error("Error accepting request:", error.message);

    }
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    form.resetFields();
  };
  const handleDocumentChange = (info) => {
    if (info.fileList.length === 0) {
      setFormData({ ...formData, document: null });
      return;
    }
    const file = info.fileList[0].originFileObj;

    setFormData({ ...formData, document: file });

  }

  const handleRemove = () => {
    setFormData({ ...formData, document: null });
  };
  const onAcceptTermsAndConditions = () => {
    if (!termsAndConditionsCheck) {
      showModal();
    }
    else {
      setTermsAndConditionsCheck(false);
    }
  }

  const handleSubmit = async (values) => {
    // if ((role === "seller" || role === "tour-guide" || role === "advertiser") && !formData.document) {
    //   message.error("Please upload the required documents in one pdf.");
    //   return;
    // }
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
        }, formData.document);

        navigate("/seller/pending", {
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
        message.success("Sign up successful!");
        navigate(`/tourist/select-preferences/${touristId}`, { state: { touristId } });

      }

    } catch (error) {


      message.error(error.message); // Display backend error

    }
  };



  return (
    <div className="signUpUsersForm-container">
      <h2 className="signUpUsersForm-title">Sign Up</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Role">
          <Radio.Group onChange={handleRoleChange} value={role}>
            <Radio value="seller">Seller</Radio>
            <Radio value="tour-guide">Tour Guide</Radio>
            <Radio value="advertiser">Advertiser</Radio>
            <Radio value="tourist">Tourist</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Username"
          name="userName"
          rules={[{ required: true, message: "Please enter your user name" }]}
        >
          <Input
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Form.Item>

        {role === "tourist" && (
          <>
            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[{ required: true, message: "Please enter your mobile number" }]}
            >
              <Input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Nationality"
              name="nationality"
              rules={[{ required: true, message: "Please select your nationality" }]}
            >
              <Select
                value={formData.nationality}
                onChange={(value) => handleChange("nationality", value)}
              >
                <Option value="">Select Nationality</Option>
                {nationalities.map((nationality, index) => (
                  <Option key={index} value={nationality}>
                    {nationality}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: "Please select your date of birth" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                value={formData.dateOfBirth ? moment(formData.dateOfBirth) : null}
                onChange={(date, dateString) => handleChange("dateOfBirth", dateString)}
              />
            </Form.Item>
            <Form.Item
              label="Job"
              name="job"
              rules={[{ required: true, message: "Please enter your job" }]}
            >
              <Input
                value={formData.job}
                onChange={(e) => handleChange("job", e.target.value)}
              />
            </Form.Item>
          </>
        )}
        {role !== "tourist" && (
          <Form.Item name="document" rules={[{ required: true, message: "Please upload your required documents" }]}
          >
            <Upload

              accept=".pdf"
              beforeUpload={() => false}
              // beforeUpload={handleBeforeUpload}
              // required
              onChange={handleDocumentChange}
              onRemove={handleRemove}
            >

              {!formData.document && (
                <Button
                  icon={<UploadOutlined />}
                  size="small"
                  type="default"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "0 8px",
                    width: "auto",
                  }}


                >
                  {(role === "seller" || role === "advertiser") && "Upload ID & taxation registery"}
                  {(role === "tour-guide") && "Upload ID & certificate"}

                </Button>
              )}

            </Upload>
          </Form.Item>
        )}
        <Form.Item
          name="TermsAndConditions" rules={[{ required: !termsAndConditionsCheck, message: "Please accept the terms and conditions" }]}
        >
          <Checkbox onChange={onAcceptTermsAndConditions} checked={termsAndConditionsCheck}>Accept Terms and Conditions</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Sign Up
          </Button>
        </Form.Item>

      </Form>

      <Input
        placeholder="enter request/user id"
        value={requestId}
        onChange={(e) => setRequestId(e.target.value)}
      />
      <br></br> <br></br>
      <Button type="primary" style={{ width: "50%" }} onClick={handleAcceptRequest}>
        Accept Request
      </Button>

      <br></br> <br></br>
      <Modal
        title="Terms and conditions"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={currentTab === tabs.length - 1 ? "Done" : "Accept"}
      >
        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="tabs -terms js-tabs">
              <div className="row y-gap-30">
                <div className="col-lg-3">
                  <div className="tabs__controls row y-gap-10 js-tabs-controls">
                    {tabs.map((elm, i) => (
                      <div
                        key={i}
                        className="col-12"
                        onClick={() => setCurrentTab(i)}
                      >
                        <button
                          className={`tabs__button relative pl-20 js-tabs-button ${i === currentTab ? "is-tab-el-active" : ""
                            } `}
                          data-tab-target=".-tab-item-1"
                        >
                          {elm.title}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-9">
                  <div className="tabs__content">
                    {tabs.map(
                      (tab, index) =>
                        index === currentTab && (
                          <div key={index} className="tabs__pane is-tab-el-active">
                            {tab.title}
                            {tab.content}

                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal>
    </div>

  );
};

export default SignUpAllUsers;