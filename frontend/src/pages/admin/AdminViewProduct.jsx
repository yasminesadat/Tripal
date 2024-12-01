import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import FooterThree from "@/components/layout/footers/FooterThree";

const AdminViewProduct = () => {
  return (
    <div>
      <ProductDetails homeURL={"/admin"} productsURL={"/admin/view-products"}/>
      <FooterThree/>
    </div>
  );
};

export default AdminViewProduct;
