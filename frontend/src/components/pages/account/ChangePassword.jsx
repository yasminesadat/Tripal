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
        <h2 style={{ marginBottom: "20px" }}>Create New Password</h2>
        <p style={{ marginBottom: "20px", color:'gray' }}>Please create a new password for your account.</p>
        <Input.Password
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%",
            marginBottom: "15px",
            border: "1px solid #d9d9d9",
            outline: "none",
            backgroundColor: "transparent",
            }}
      />
      <Input.Password
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%",
            marginBottom: "15px",
            border: "1px solid #d9d9d9",
            outline: "none",
            backgroundColor: "transparent",
            }}
      />
      
      {/* Change Password Button */}
      <Button
        type="primary"
        onClick={handleChangePassword}
        loading={loading}
        style={{
          width: "100%",
          marginTop: "20px",
          backgroundColor: "#036264",
          borderColor: "#036264",
          color: "white"
        }}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5a9ea0";
            e.target.style.borderColor = "#5a9ea0";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#036264";
            e.target.style.borderColor = "#036264";
          }}
      > 
        Change Password
      </Button>
      <style>
       {`
       .custom-input {
        }
        .custom-input:focus {
        border-color: #8f5774;
        }
       `}
      </style>
        </Card>
    );
}
export default ChangePassword;