import { useState } from "react";
import { Input, Button, Card } from "antd";
import { validateOtp } from "@/api/OtpService";

const ValidateOtp = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidateOtp = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("at frontend ", email, otp);
      const response = await validateOtp({ email, otp });
      if (response.status === 200) {
        console.log("OTP validated successfully!");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
    title="Validate OTP"
    style={{
      width: 400,
      height: 300,
      margin: "auto",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}
  >
      <p>Please enter the OTP sent to your email.</p>
      <Input.OTP
        length={6}
        value={otp}
        autoFocus
        status="warning"
        onChange={(value) => {
          console.log("OTP entered:", value);
          setOtp(value);
        }}
        style={{ marginBottom: "20px" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        type="primary"
        onClick={handleValidateOtp}
        loading={loading}
        block
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
        Validate OTP
      </Button>
    </Card>
  );
};

export default ValidateOtp;