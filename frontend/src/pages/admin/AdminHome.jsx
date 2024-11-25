import AdminHeader from "../../components/layout/header/AdminHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import Sidebar from "@/components/dasboard/Sidebar";
import MetaComponent from "@/components/common/MetaComponent";
import React, { useState } from "react";
import States from "@/components/dasboard/main/States";
import Activities from "@/components/dasboard/main/Activities";
import Statistics from "@/components/dasboard/main/Statistics";
import Header from "@/components/dasboard/Header";
const metadata = {
  title: "Admin Dashboard || Tripal - Travel Agency",
};





export default function AdminDashboard() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
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

            <States />

            <div className="row pt-30 y-gap-30">
              <Statistics />

              <div className="col-xl-4 col-lg-12 col-md-6">
                <div className="px-30 py-25 rounded-12 bg-white shadow-2">
                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Recent Activities</div>
                  </div>

                  <Activities />

                  <div className="pt-40">
                    <button className="button -md -outline-accent-1 col-12 text-accent-1">
                      View More
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-30">
              © Copyright Viatours {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

