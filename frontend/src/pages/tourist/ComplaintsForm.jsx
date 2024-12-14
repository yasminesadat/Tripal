import { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { createComplaint } from "../../api/ComplaintsService";

const ComplaintsForm = ({ open, onCancel, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Submit Complaint");
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      setButtonText("Submitting...");
      const complaintData = {
        title: values.title,
        body: values.body,
        date: new Date().toISOString(),
      };

      const response = await createComplaint(complaintData);
      const completeData = response;

      message.success("Complaint submitted successfully");
      setButtonText("Success!");

      onSubmitSuccess(completeData);

      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Failed to submit complaint");
      setButtonText("Failed");
    } finally {
      setLoading(false);
      setButtonText("Submit Complaint");
    }
  };

  return (
    <Modal
      title="Share Your Experience"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="complaints-modal"
      centered
    >
      <div className="modal-content">
        <div className="illustration-section">
          <svg viewBox="0 0 200 200" className="feedback-illustration">
            <circle cx="100" cy="100" r="90" fill="#DAC4D0" opacity="0.3" />
            <rect x="60" y="70" width="80" height="60" rx="4" fill="#8F5774" />
            <rect x="70" y="85" width="60" height="4" rx="2" fill="white" />
            <rect x="70" y="95" width="40" height="4" rx="2" fill="white" />
            <rect x="70" y="105" width="50" height="4" rx="2" fill="white" />
          </svg>
          <p className="modal-quote">
            "Your feedback helps us improve and serve you better"
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="styled-form"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the complaint title" },
            ]}
          >
            <Input
              style={{
                height: "50px",
                border: "1px solid #d9d9d9",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent"
              }} placeholder="Enter complaint title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="body"
            rules={[
              {
                required: true,
                message: "Please input the complaint description!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter complaint description"
              rows={4}
              className="description-input"
            />
          </Form.Item>
          <Form.Item className="button-group">
            <Button onClick={onCancel} className="cancel-button">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="submit-button"
            >
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <style>{`
        .complaints-modal .ant-modal-content {
          border-radius: 8px;
          overflow: hidden;
          margin-top: 15%;
        }

        .complaints-modal .ant-modal-header {
          background: var(--color-stone);
          border-bottom: none;
          padding: 16px 24px;
        }

        .complaints-modal .ant-modal-title {
          color: white;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .complaints-modal .ant-modal-close {
          color: white;
          margin-top: 1%;
          transition: transform 0.3s ease;
        }

        .complaints-modal .ant-modal-close:hover {
          color: white;
          background: none;
          box-shadow: none;
          transform: scale(1.2);
        }

        .complaints-modal .ant-modal-close-x {
          font-size: 16px;
          width: 46px;
          height: 46px;
          line-height: 46px;
          margin-right: 120px;
          position: relative;
          left: -20px;
          top: 10px;
        }

        .modal-content {
          padding: 20px 0;
        }

        .illustration-section {
          text-align: center;
          margin-bottom: 24px;
        }

        .feedback-illustration {
          width: 100px;
          height: 100px;
          margin-bottom: 16px;
        }

        .modal-quote {
          color: #666;
          font-size: 14px;
          font-style: italic;
          margin: 0;
        }

        .styled-form {
          padding: 0 24px;
        }

        .styled-form .ant-form-item-label > label {
          color: var(--color-stone);
          font-weight: 500;
        }

        .styled-form .ant-input {
          border-radius: 6px;
          border-color: #ddd;
        }

        .styled-form .ant-input:hover,
        .styled-form .ant-input:focus {
          border-color: var(--color-stone);
          box-shadow: none;
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 0;
        }

        .cancel-button {
          border: 2px solid var(--color-stone);
          color: var(--color-stone);
          border-radius: 20px;
          padding: 4px 16px;
          height: 36px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          color: white !important;
          background-color: var(--color-stone) !important;
          border-color: var(--color-stone) !important;
        }

        .submit-button {
          background: var(--color-stone);
          border: none;
          min-width: 120px;
          height: 36px;
          border-radius: 20px;
          font-weight: 500;
        }

        .submit-button:hover {
          background: var(--color-stone-light) !important;
        }

        .description-input {
          resize: none;
        }
      `}</style>
    </Modal>
  );
};

export default ComplaintsForm;
