import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import SellerNavbar from "../../components/navbar/SellerNavBar";

const SellerViewProduct = () => {
  return (
    <div>
      <SellerNavbar />
      <ProductDetails homeURL={"/seller"} productsURL={"/seller/view-products"}/>
    </div>
  );
};

export default SellerViewProduct;
