import React from "react";
import ProductForm from "../../components/product/ProductForm";
import SellerNavbar from "../../components/seller/SellerNavBar";
import Footer from "../../components/Footer";

const SellerProductEdit = () => {
  return (
    <div>
      <SellerNavbar />
      <ProductForm />
      <Footer />
    </div>
  );
};

export default SellerProductEdit;
