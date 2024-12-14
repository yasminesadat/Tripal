import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { changeTouristPassword } from "@/api/TouristService";
import { changeSellerPassword } from "@/api/SellerService";
import { changeAdvertiserPassword } from "@/api/AdvertiserService";
import { changeAdminPassword } from "@/api/AdminService";
import { changeGovernorPassword } from "@/api/GovernorService";
import { changeTourGuidePassword } from "@/api/TourGuideService";
import { LockOutlined, UnlockOutlined, SecurityScanOutlined } from "@ant-design/icons";
const ChangePassword = ({ id, userType }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Passwords don't match");
            return;
        }

        try {
            switch (userType) {
                case 'tourist':
                    await changeTouristPassword(id, values.oldPassword, values.newPassword);
                    break;
                case 'tour guide':
                    await changeTourGuidePassword(id, values.oldPassword, values.newPassword);
                    break;
                case 'advertiser':
                    await changeAdvertiserPassword(id, values.oldPassword, values.newPassword);
                    break;
                case 'governor':
                    await changeGovernorPassword(values.oldPassword, values.newPassword);
                    break;
                case 'admin':
                    await changeAdminPassword(values.oldPassword, values.newPassword);
                    break;
                case 'seller':
                    await changeSellerPassword(id, values.oldPassword, values.newPassword);
                    break;
                default:
                    throw new Error("Invalid user type");
            }
            message.success("Password changed successfully");
        } catch (error) {
            console.error("Error changing password:", error);
            message.error(error.response?.data?.error || "Failed to change password");
        }
    };

    return (
        <div
            className="signUpUsersForm-container"
            style={{
                padding: '3rem',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(143, 87, 116, 0.15)',
                width: '100%',
                maxWidth: '550px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#8f5774',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SecurityScanOutlined style={{ fontSize: '30px', color: 'white' }} />
                </div>

                <h2
                    className="signUpUsersForm-title"
                    style={{
                        color: '#8f5774',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    Change Password
                </h2>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                >
                    <Form.Item
                        label={<span style={{ color: '#036264', fontSize: '1rem' }}>Old Password</span>}
                        name="oldPassword"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password
                            prefix={<UnlockOutlined style={{ color: '#8f5774' }} />}
                            style={{
                                borderColor: '#dac4d0',
                                borderWidth: '2px',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#036264', fontSize: '1rem' }}>New Password</span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#8f5774' }} />}
                            style={{
                                borderColor: '#dac4d0',
                                borderWidth: '2px',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#036264', fontSize: '1rem' }}>Confirm New Password</span>}
                        name="confirmPassword"
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#8f5774' }} />}
                            style={{
                                borderColor: '#dac4d0',
                                borderWidth: '2px',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{
                                width: "100%",
                                height: "50px",
                                backgroundColor: '#8f5774',
                                borderColor: '#8f5774',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                marginTop: '1rem',
                                boxShadow: '0 4px 12px rgba(143, 87, 116, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#e0829d';
                                e.currentTarget.style.borderColor = '#e0829d';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#8f5774';
                                e.currentTarget.style.borderColor = '#8f5774';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;