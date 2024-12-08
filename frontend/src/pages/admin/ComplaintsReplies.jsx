import Messages from "@/components/dasboard/Messages";
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import MetaComponent from "@/components/common/MetaComponent";
import { useState } from "react";
const metadata = {
    title: "Complaints",
    description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function ComplaintsReplies() {
    const location = useLocation();
    const [sideBarOpen, setSideBarOpen] = useState(true);

    // Extract complaint from location.state
    const { complaint, user, role } = location.state || { complaint: null, user: null, role: null };

    return (

        <>

            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
            >
                <div className="dashboard__content">
                    <Sidebar setSideBarOpen={setSideBarOpen} />



                    <Header setSideBarOpen={setSideBarOpen} />

                    <MetaComponent meta={metadata} />

                    <Messages complaint={complaint} user={user} role={role} />


                </div>
                <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
            </div>

            {/* </main> */}
        </>
    );
}