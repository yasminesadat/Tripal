import  { useState} from "react";
import Sidebar from '@/components/dasboard/Sidebar';
import Header from '@/components/dasboard/Header';
import RequestsList from "@/components/dasboard/RequestsList";
const Requests = () => {
    const [sideBarOpen, setSideBarOpen] = useState(true);
    return (
        <>
            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
            >
                <Sidebar setSideBarOpen={setSideBarOpen} />

                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                   <RequestsList/>
                    <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
                </div>
            </div>

            
        </>
    );
};

export default Requests;