import React from "react";
import ProductList from "../../components/product/ProductList";
import SellerNavbar from "../../components/seller/SellerNavBar";

const SellerProducts = () => {
  return (
    <div>
      <SellerNavbar />
      <ProductList />
    </div>
  );
};

export default SellerProducts;
