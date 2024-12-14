import ProductList from "../../components/product/ProductList";
import Header from "@/components/dasboard/Header";
import Sidebar from "@/components/dasboard/Sidebar";
import { useState } from "react";

const AdminProducts = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  return (
       <div
            className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
        >
        <Sidebar setSideBarOpen={setSideBarOpen} />
        <div className="dashboard__content">
          <Header setSideBarOpen={setSideBarOpen} />
          <div>
            <ProductList />
            <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminProducts;
