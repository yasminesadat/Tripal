import ProductList from "../../components/product/ProductList";
import FooterThree from "@/components/layout/footers/FooterThree";
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
            <FooterThree/>
          </div>
        </div>
    </div>
  );
};

export default AdminProducts;
