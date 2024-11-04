import React from "react";
import { adminId } from "../../IDs";
import ChangePassword from "../../components/common/ChangePassword";
import AdminNavBar from "../../components/navbar/AdminNavBar";
import Footer from "../../components/common/Footer";
const AdminChangePassword = () => {

    return (
        <div>
            <AdminNavBar />
            <ChangePassword id={adminId} userType="admin" />
            <Footer />
        </div>
    );
};

export default AdminChangePassword;