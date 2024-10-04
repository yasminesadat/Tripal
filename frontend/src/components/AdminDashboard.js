import React from "react";
import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

//const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handlePreferenceTags = () => {
    navigate("/preference-tags");
  };

  const handleActivityCategory = () => {
    navigate("/activity-category");
  };

  return (
    <Layout>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "blue", margin: 0 }}>
          Admin Dashboard
        </Title>
      </div>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button type="primary" size="large" onClick={handlePreferenceTags}>
          Manage Preference Tags
        </Button>
        <Button type="primary" size="large" onClick={handleActivityCategory}>
          Manage Activity Categories
        </Button>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
