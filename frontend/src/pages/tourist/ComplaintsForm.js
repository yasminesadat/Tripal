import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { createComplaint } from "../../api/ComplaintsService";
import { useParams } from "react-router-dom";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import Footer from "../../components/common/Footer";
import { touristId } from "../../IDs";
const ComplaintsForm = () => {
    const id = touristId;
    const [loading, setLoading] = useState(false); // State for loading
    const [buttonText, setButtonText] = useState("Submit Complaint");

    const handleSubmit = async (values) => {
        setLoading(true); // Set loading to true before form submission
        try {
            setButtonText("Submitting...");
            const complaintData = {
                title: values.title,
                body: values.body,
            };
            console.log(complaintData);
            await createComplaint(id, complaintData); // Create complaint
            message.success("Complaint submitted successfully");
            setButtonText("Success!");
        } catch (error) {
            message.error("Failed to submit complaint");
            setButtonText("Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container2">
            <TouristNavBar />
            <div className="product-form-container">
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: "Please enter the complaint title" },
                        ]}
                    >
                        <Input placeholder="Enter complaint title" />
                    </Form.Item>

                    <Form.Item
                        label="Body"
                        name="body"
                        rules={[
                            { required: true, message: "Please input the complaint description!" },
                        ]}
                    >
                        <Input.TextArea placeholder="Enter complaint description" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: "100%" }}
                            loading={loading}
                        >
                            {buttonText}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Footer />
        </div>
    );
};

export default ComplaintsForm;
