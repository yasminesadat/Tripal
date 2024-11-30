import React from "react";
import ProductList from "../../components/product/ProductList";
import FooterThree from "@/components/layout/footers/FooterThree";


const AdminProducts = () => {
  return (
    <div>
      <ProductList />
      <FooterThree/>
    </div>
  );
};

export default AdminProducts;
