// src/components/CreateAdmin.js
import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { createAdmin } from '../api/AdminService'; // Adjust the path as necessary

const CreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await createAdmin(username, password);
      notification.success({
        message: 'Admin Created',
        description: `Admin ${response.username} created successfully!`, // Adjust according to your API response
      });
      setUsername(''); // Reset the form
      setPassword('');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create admin. Please try again.',
      });
    }
  };

  return (
    <div style={{ width: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Create New Admin</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input a username!' }]}
        >
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input a password!' }]}
        >
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Create Admin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAdmin;
