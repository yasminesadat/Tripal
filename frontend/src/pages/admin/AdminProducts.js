import React from "react";
import ProductList from "../../components/product/ProductList";
import AdminNavbar from "../../components/navbar/AdminNavBar";

const AdminProducts = () => {
  return (
    <div>
      <AdminNavbar />
      <ProductList />
    </div>
  );
};

export default AdminProducts;
