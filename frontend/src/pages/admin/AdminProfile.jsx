import React, { useEffect, useState } from "react";
import ChangePassword from "@/components/common/ChangePassword";
import Header from "@/components/dasboard/Header";
import Sidebar from "@/components/dasboard/Sidebar";
import FooterThree from "@/components/layout/footers/FooterThree";
import { getUserData } from "@/api/UserService";
const AdminChangePassword = () => {
    const [userData, setUserData] = useState("");
    const [userRole, setUserRole] = useState("");
    const [sideBarOpen, setSideBarOpen] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserData();
                setUserData(user.data.id);
                setUserRole(user.data.role);
                console.log("id is ", user.data.id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div
            className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
        >

            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">

                <Header setSideBarOpen={setSideBarOpen} />

                <div>
                    <ChangePassword id={userData} userType={userRole?.toLowerCase()} />

                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;
