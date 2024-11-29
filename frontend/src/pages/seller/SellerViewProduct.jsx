import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import FooterThree from "@/components/layout/footers/FooterThree";
import SellerHeader from "@/components/layout/header/SellerHeader";

const SellerViewProduct = () => {
  return (
    <div>
      <SellerHeader /><br/><br/>
      <ProductDetails homeURL={"/seller"} productsURL={"/seller/view-products"}/>
      <FooterThree/>
    </div>
  );
};

export default SellerViewProduct;
