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
        height: 400,
        margin: "1 auto",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p>Please enter the OTP sent to your email.</p>
      <Input.OTP
        length={6}
        value={otp}
        onChange={(value) => {
          console.log("OTP entered:", value);
          setOtp(value);
        }}
        autoFocus
        style={{ marginBottom: "20px" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        type="primary"
        onClick={handleValidateOtp}
        loading={loading}
        block
      >
        Validate OTP
      </Button>
    </Card>
  );
};

export default ValidateOtp;