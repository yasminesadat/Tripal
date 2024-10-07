import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import AdminNavbar from "../../components/admin/AdminNavBar";

const AdminViewProduct = () => {
  return (
    <div>
      <AdminNavbar />
      <ProductDetails />
    </div>
  );
};

export default AdminViewProduct;
