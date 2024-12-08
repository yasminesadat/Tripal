import AdminHeader from "../../components/layout/header/AdminHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import Sidebar from "@/components/dasboard/Sidebar";
import MetaComponent from "@/components/common/MetaComponent";
import React, { useState } from "react";
import States from "@/components/dasboard/main/States";
import Activities from "@/components/dasboard/main/Activities";
import UserStatistics from "./UsersStatistics";
import Header from "@/components/dasboard/Header";
const metadata = {
  title: "Admin Dashboard || Tripal - Travel Agency",
};





export default function AdminDashboard() {
  const [addClass] = useState(true);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [totalUsers,setTotalUsers]=useState(0);
  return (
    <>
      <div
        className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
          } js-dashboard`}
      >
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className="dashboard__content">
          <Header setSideBarOpen={setSideBarOpen} />

          <div className="dashboard__content_content">
            <h1 className="text-30">Dashboard</h1>
            <p className="">Welcome back Admin!</p>

            <States  setTotalUsers={setTotalUsers}/>

            <div className="row pt-30 y-gap-30">
              <UserStatistics totalUsers={totalUsers} />

              <div className="col-xl-4 col-lg-12 col-md-6">
                <div className="px-30 py-25 rounded-12 bg-white shadow-2">
                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Recent Activities</div>
                  </div>

                  <Activities />

                  
                </div>
              </div>
            </div>

            <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

