import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import SellerNavbar from "../../components/seller/SellerNavBar";

const SellerViewProduct = () => {
  return (
    <div>
      <SellerNavbar />
      <ProductDetails />
    </div>
  );
};

export default SellerViewProduct;
