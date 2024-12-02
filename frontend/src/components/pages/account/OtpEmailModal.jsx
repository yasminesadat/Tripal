import  { useState } from "react";
import { Modal, Input, Button } from "antd";
import { requestOtp } from "@/api/OtpService";

const OtpModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await requestOtp({ email });
      if (response.status === 200) {
        onClose();
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Forgot Password?"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          type="primary"
          onClick={handleRequestOtp}
          loading={loading}
          style={{ marginTop: "20px" }}
        >
          Request OTP
        </Button>
      </div>
      <style>
       {`
       
       `}
      </style>
    </Modal>
  );
};

export default OtpModal;