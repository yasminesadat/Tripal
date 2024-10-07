import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import AdminNavbar from "../../components/admin/AdminNavBar";

const AdminViewProduct = () => {
  return (
    <div>
      <AdminNavbar />
      <ProductDetails homeURL={"/admin"} productsURL={"/admin/view-products"}/>
    </div>
  );
};

export default AdminViewProduct;
