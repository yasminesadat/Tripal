import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import PromoCodeDetailsComponent from "@/components/dasboard/ViewPromocode"; 
const PromoCodeDetails = () => {
    const [sideBarOpen, setSideBarOpen] = useState(true);

    

    return (
        <>
            <div className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}>
                <Sidebar setSideBarOpen={setSideBarOpen} />
                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                   <PromoCodeDetailsComponent/>
                    <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
                </div>
            </div>
        </>
    );
};

export default PromoCodeDetails;