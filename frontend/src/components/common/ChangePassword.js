import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { changeTouristPassword } from "../../api/TouristService";
import { changeSellerPassword } from "../../api/SellerService";
import { changeAdvertiserPassword } from "../../api/AdvertiserService";
import { changeAdminPassword } from "../../api/AdminService";
import { changeGovernorPassword } from "../../api/GovernorService";
// import { changeTourGuidePassword } from "../../api/TourGuideService";
const ChangePassword = ({ id, userType }) => {
    const [form] = Form.useForm();
    const handleSubmit = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Passwords don't match");
            return; // Early return to avoid proceeding with the password change
        }


        console.log(userType);
        try {
            switch (userType) {
                case 'tourist':
                    await changeTouristPassword(id, values.oldPassword, values.newPassword);
                    message.success("Password changed successfully"); // Notify success
                    break;

                // case 'tour guide':
                //     await changeTourGuidePassword(id, values.oldPassword, values.newPassword);
                //     message.success("Password changed successfully"); // Notify success
                //     break;

                case 'advertiser':
                    await changeAdvertiserPassword(id, values.oldPassword, values.newPassword);
                    message.success("Password changed successfully"); // Notify success
                    break;

                case 'governor':
                    const res = await changeGovernorPassword(id, values.oldPassword, values.newPassword);
                    console.log(res);
                    message.success("Password changed successfully"); // Notify success
                    break;

                case 'admin':
                    await changeAdminPassword(id, values.oldPassword, values.newPassword);
                    message.success("Password changed successfully"); // Notify success
                    break;
                case 'seller':
                    await changeSellerPassword(id, values.oldPassword, values.newPassword);
                    message.success("Password changed successfully"); // Notify success
                    break;

                default:
                    throw new Error("Invalid user type");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            message.error(error.response.data.error); // Notify failure
        }
    };


    return (
        <div className="signUpUsersForm-container">
            <h2 className="signUpUsersForm-title">Change password</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[
                        { required: true, message: "Please enter your password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        { required: true, message: "Please enter your password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: "Please confirm your password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;