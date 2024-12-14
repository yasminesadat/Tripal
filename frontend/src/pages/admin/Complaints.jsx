import { useState } from "react";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";

import ComplaintsComponent from "@/components/dasboard/Complaints";
const ComplaintsPage = () => {
    const [sideBarOpen, setSideBarOpen] = useState(true);
    return (
        <>
            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
            >
                <Sidebar setSideBarOpen={setSideBarOpen} />
                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                   <ComplaintsComponent />
                    <div className="text-center pt-30">
                        © Copyright Tripal {new Date().getFullYear()}
                    </div>
                </div>
            </div>
            <style>{`
      .custom-button {
   background-color: var(--color-dark-purple) !important;
   border: 2px solid var(--color-dark-purple) !important;
   color: #fff !important; /* Text color */
   border-radius: 20px; /* Slightly smaller rounded edges */
   padding: 8px 16px; /* Reduced padding */
   font-size: 12px; /* Adjusted font size */
   font-weight: 500; /* Medium font weight */
   cursor: pointer; /* Pointer cursor on hover */
   transition: all 0.3s ease; /* Smooth transitions */
   box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
 }
 
 .custom-button:hover,
 .custom-button:focus {
   background-color: var(--color-light-purple) !important;
   border-color: var(--color-light-purple) !important;
   box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow on hover */
 }
 
 .custom-button:active {
   transform: scale(0.98); /* Slightly shrink the button on click */
 }
 
 .custom-button:disabled {
   background-color: #ccc !important;
   border-color: #ccc !important;
   color: #666 !important;
   cursor: not-allowed;
   box-shadow: none;
 }
 .custom-button-green {
  background-color: var(--color-stone) !important;
   border: 2px solid var(--color-stone) !important;
   color: #fff !important; /* Text color */
   border-radius: 20px; /* Slightly smaller rounded edges */
   padding: 8px 16px; /* Reduced padding */
   font-size: 12px; /* Adjusted font size */
   font-weight: 500; /* Medium font weight */
   cursor: pointer; /* Pointer cursor on hover */
   transition: all 0.3s ease; /* Smooth transitions */
   box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-button-green:hover,
.custom-button-green:focus {
  background-color: var(--color-stone-light) !important;
  border-color: var(--color-stone-light) !important;
}
     `}</style>
        </>
    );
}
export default ComplaintsPage;