import  { useState } from "react";
import { Modal, Input, Button } from "antd";
import { requestOtp } from "@/api/OtpService";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ visible, onClose,clearError  }) => {

    //#region user State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
    //#endregion
    
    //#region functions
    const handleRequestOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await requestOtp({ email });
      if (response.status === 200) {
        onClose();
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      setError("Failed to send OTP. Please write a valid email.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  const handleModalClose = () => {
    setError("");
    clearError();
    onClose();
  };
    //#endregion
  
    return (
    <Modal
      title="Forgot Password?"
      visible={visible}
      onCancel={handleModalClose}
      footer={null}
      centered
    >
      <div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            border: "1px solid #d9d9d9",
            outline: "none",
            backgroundColor: "transparent",
          }}        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          type="primary"
          onClick={handleRequestOtp}
          loading={loading}
          style={{
            marginTop: "20px",
            backgroundColor: "#8f5774",
            borderColor: "#8f5774",
            color: "white"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#e0829d";
            e.target.style.borderColor = "#e0829d";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#8f5774";
            e.target.style.borderColor = "#8f5774";
          }}
        >
          Request OTP
        </Button>
      </div>
      <style>
       {`
       .custom-input {
        border-color: grey;
        }
        .custom-input:focus {
        border-color: #8f5774;
        }
       `}
      </style>
    </Modal>
  );
};

export default OtpModal;