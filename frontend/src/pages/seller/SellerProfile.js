import React, { useEffect, useState } from "react";
import { getSellerDetails, updateSeller } from "../../api/SellerService";
import SellerNavBar from "../../components/navbar/SellerNavBar";
import { sellerId } from "../../IDs";
import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./SellerProfile.css";
import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/DeletionRequestService";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const userType = "seller";
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedSeller, setUpdatedSeller] = useState({
    userName: "",
    email: "",
    password: "",
    name: "",
    description: "",
    logo: "", // Add logo to the state
  });
  const [initialLogo, setInitialLogo] = useState(""); // State to store the initial logo
  const [loading, setLoading] = useState(false); // State for loading
  const [buttonText, setButtonText] = useState("Save Changes");

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await getSellerDetails(sellerId);
        setSeller(response.data);
        setUpdatedSeller({
          userName: response.data.userName || "",
          email: response.data.email || "",
          password: response.data.password || "",
          name: response.data.name || "",
          description: response.data.description || "",
          logo: response.data.logo || "", // Set logo if present
        });
        setInitialLogo(response.data.logo || ""); // Set initial logo
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSellerProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSeller((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (info) => {
    if (info.fileList.length === 0) {
      setUpdatedSeller({ ...updatedSeller, logo: null });
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUpdatedSeller({ ...updatedSeller, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeUpload = (file) => {
    if (updatedSeller.logo) {
      message.error("Only one logo can be uploaded.");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUpdatedSeller({ ...updatedSeller, logo: reader.result });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = () => {
    setUpdatedSeller({ ...updatedSeller, logo: null });
  };

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true); // Set loading to true before form submission
    try {
      setButtonText("Submitting...");
      const sellerData = {
        userName: updatedSeller.userName,
        email: updatedSeller.email,
        password: updatedSeller.password,
        name: updatedSeller.name,
        description: updatedSeller.description,
      };

      // Only include the logo if it has been changed
      if (updatedSeller.logo !== initialLogo) {
        sellerData.logo = updatedSeller.logo;
        sellerData.initialLogo = initialLogo; // Include initialLogo for deletion
      }

      await updateSeller(sellerId, sellerData);
      message.success("Profile updated successfully!");
      setButtonText("Success!");
      setIsEditing(false);
      const response = await getSellerDetails(sellerId);
      setSeller(response.data);
      setUpdatedSeller({
        userName: response.data.userName || "",
        email: response.data.email || "",
        password: response.data.password || "",
        name: response.data.name || "",
        description: response.data.description || "",
        logo: response.data.logo || "", // Set logo if present
      });
      setInitialLogo(response.data.logo || ""); // Update initial logo
    } catch (error) {
      setError(error.message);
      message.error("Failed to update profile: " + error.message);
      setButtonText("Failed");
    } finally {
      setLoading(false); // Set loading to false after form submission
      setTimeout(() => {
        setButtonText("Save Changes");
      }, 1000);
    }
  };

  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion("Seller", sellerId);
      message.success(response.message); 
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred."); 
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!seller) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <SellerNavBar />
        <div className="seller-profile-container">
          <h2 className="profile-title">Seller Profile</h2>

          {!isEditing ? (
            <div className="profile-info">
              <div className="profile-details">
                <p>
                  <strong>User Name:</strong> {seller.userName}
                </p>
                <p>
                  <strong>Email:</strong> {seller.email}
                </p>
                <p>
                  <strong>Name:</strong> {seller.name || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong> {seller.description || "N/A"}
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  type="primary"
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  Edit Profile
                </Button>
              </div>
              {seller.logo && (
                <img
                  src={seller.logo}
                  alt="Seller Logo"
                  className="seller-logo"
                />
              )}{" "}
              {/* Display logo if present */}
            </div>
          ) : (
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={updatedSeller}
            >
              <Form.Item
                label="User Name"
                name="userName"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  name="userName"
                  placeholder="Enter your username"
                  value={updatedSeller.userName}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  name="email"
                  placeholder="Enter your email"
                  value={updatedSeller.email}
                  onChange={handleInputChange}
                />
              </Form.Item>
              {/* <Form.Item
                      label="Password"
                      name="password"
                      rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <Input.Password
                        name="password"
                        placeholder="Enter your new password"
                        value={updatedSeller.password}
                        onChange={handleInputChange}
                      />
                    </Form.Item> */}
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input
                  name="name"
                  placeholder="Enter your name"
                  value={updatedSeller.name}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input your description!" },
                ]}
              >
                <Input.TextArea
                  name="description"
                  placeholder="Enter a brief description"
                  value={updatedSeller.description}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Logo" name="logo">
                <Upload
                  name="logo"
                  listType="picture"
                  accept=".png,.jpeg,.jpg"
                  beforeUpload={handleBeforeUpload} // Prevent multiple uploads
                  onChange={handleLogoChange}
                  onRemove={handleRemove} // Allow removal of the logo
                  fileList={
                    updatedSeller.logo
                      ? [
                        {
                          uid: "-1",
                          name: "logo.png",
                          status: "done",
                          url: updatedSeller.logo,
                        },
                      ]
                      : []
                  } // Ensure only one file is shown
                >
                  {!updatedSeller.logo && (
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
                      Upload Logo
                    </Button>
                  )}
                </Upload>
                {updatedSeller.logo && (
                  <img
                    src={updatedSeller.logo}
                    alt="Seller Logo"
                    className="seller-logo-preview"
                  />
                )}{" "}
                {/* Display logo preview if present */}
              </Form.Item>
              <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "8px" }}
                  loading={loading}
                >
                  {buttonText}
                </Button>
                <Button type="default" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
        <ChangePassword id={sellerId} userType={userType} />
        <button onClick={handleDeletion}>Delete Account</button>
      </div>
    </>
  );
};

export default SellerProfile;
