import { useState } from "react";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import CreateNewGovernorComponent from "@/components/dasboard/NewGovernor";
export default function CreateNewGovernor() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  return (

    <div
      className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}
    >
      <Sidebar setSideBarOpen={setSideBarOpen} />
      <div className="dashboard__content" style={{ minHeight: '100vh', paddingBottom: '0' }}>
        <Header setSideBarOpen={setSideBarOpen} />
        <CreateNewGovernorComponent />
        <div className="text-center pt-30">
          © Copyright Tripal {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
