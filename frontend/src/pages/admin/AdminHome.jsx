import AdminHeader from "../../components/layout/header/AdminHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal - Travel Agency",
};

const AdminDashboard = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
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
    </>
  );
};

export default AdminDashboard;
