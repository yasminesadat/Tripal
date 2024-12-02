import { useState } from "react";
import { Card, Input, Button, message } from "antd";
import { LockKeyholeOpen } from "lucide-react";
import { resetPassword } from "@/api/OtpService";
import { useNavigate } from "react-router-dom";

const ChangePassword =({email})=>{
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await resetPassword({ email, newPassword });
      
      if (response.status === 200) {
        message.success("Password changed successfully.");
        setTimeout(() => {
            setLoading(false);
            navigate("/login");
            setNewPassword("");
            setConfirmPassword("");
          }, 2000);
      } else {
        message.error("Failed to change the password. Please try again.");
      }
    } catch (err) {
      message.error("Error changing password.");
    }
  };
    return (  
        <Card
        style={{
          width: 500,
          height: 450,
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
        <div style={{ marginBottom: "20px" }}>
      <LockKeyholeOpen size={40} color="#036264" />
        </div>
        <h2 style={{ marginBottom: "20px" }}>Change Password</h2>
        <Input.Password
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "15px" }}
      />
      <Input.Password
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "15px" }}
      />
      
      {/* Change Password Button */}
      <Button
        type="primary"
        onClick={handleChangePassword}
        loading={loading}
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        Change Password
      </Button>
        </Card>
    );
}
export default ChangePassword;