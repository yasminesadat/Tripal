import AdminHeader from "../../components/layout/header/AdminHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const AdminDashboard = () => {
  return (
    <div className="page-wrapper">
      <AdminHeader />
      <main className="page-content">
        <h1>Welcome to Admin Dashboard</h1>
        <p>This is a dummy component for the Admin Dashboard.</p>
        <div className="admin-content-details">
          <p>
            Here you can manage your admin tasks, view statistics, and more.
          </p>
        </div>
      </main>
      <FooterThree />
    </div>
  );
};

export default AdminDashboard;
