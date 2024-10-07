import React, { useEffect, useState } from "react";
import { getSellerDetails, updateSeller } from "../../api/SellerService";
import { sellerId } from "../../IDs";
import { Form, Input, Button, message } from "antd";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedSeller, setUpdatedSeller] = useState({
    userName: "",
    email: "",
    password: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await getSellerDetails(sellerId);
        setSeller(response.data);
        setUpdatedSeller({
          userName: response.data.userName || "",
          email: response.data.email || "",
          password: response.data.password ||"", 
          name: response.data.name || "",
          description: response.data.description || "",
        });
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

  const handleSubmit = async (values) => {
    setError(null);
    try {
      await updateSeller(sellerId, values);
      message.success("Profile updated successfully!");
      setIsEditing(false);
      const response = await getSellerDetails(sellerId);
      setSeller(response.data);
      setUpdatedSeller({
        userName: response.data.userName || "",
        email: response.data.email || "",
        password: response.data.password||"",
        name: response.data.name || "",
        description: response.data.description || "",
      });
    } catch (error) {
      setError(error.message);
      message.error("Failed to update profile: " + error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!seller) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Seller Profile</h2>

      {!isEditing ? (
        <div>
          <p><strong>User Name:</strong> {seller.userName}</p>
          <p><strong>Email:</strong> {seller.email}</p>
          <p><strong>Password:</strong> ********</p>
          <p><strong>Name:</strong> {seller.name || "N/A"}</p>
          <p><strong>Description:</strong> {seller.description || "N/A"}</p>
          <Button onClick={() => setIsEditing(true)} type="primary">Edit Profile</Button>
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
            rules={[{ required: true, message: 'Please input your username!' }]}
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
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              name="email"
              placeholder="Enter your email"
              value={updatedSeller.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
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
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input.TextArea
              name="description"
              placeholder="Enter a brief description"
              value={updatedSeller.description}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button type="default" onClick={() => setIsEditing(false)} style={{ marginLeft: "8px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default SellerProfile;
