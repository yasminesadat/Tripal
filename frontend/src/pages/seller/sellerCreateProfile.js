import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { createSeller, updateSeller } from "../../api/SellerService"; // Adjust the path as necessary
import SellerNavBar from "../../components/seller/SellerNavBar";

const CreateSeller = () => {
  const [userName, setUsername] = useState('');
  const [email, setEmail]=useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');



const handleSubmit = async () => {
    try {
        console.log(userName);
        const newSeller = { userName, email, password };
      const response = await createSeller(newSeller); // Assuming API returns the new admin's username
      const updatedprofile= await updateSeller(response._id,{name,description});
      notification.success({
        message: 'Seller profile Created',
        description: `Seller ${response.userName} created successfully!`, // Adjust according to your API response
      });
      // Clear the input fields after success

      console.log(userName);
    } catch (error) {
      console.log("Response status:", error.response.status);
      if (error.status === 409) {
        notification.error({
          message: 'Username or Email Taken',
          description: 'The username is already in use. Please choose a different one.',
        });}
        else{
      notification.error({
        message: 'Error',
        description: 'Failed to create seller profile. Please try again.',
      });}
    }
  };

  return (
    <>
      <SellerNavBar />
      <div style={{ width: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Create New Seller</h2>
        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input a username!' }]}
          >
            <Input 
              value={userName} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input a password!' }]}
          >
            <Input.Password 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{  message: 'Please input the seller\'s name!' }]}
          >
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{  message: 'Please provide a description!' }]}
          >
            <Input.TextArea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Create Seller
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateSeller;
