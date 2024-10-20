import React from "react";
import ProductForm from "../../components/product/ProductForm";
import SellerNavbar from "../../components/navbar/SellerNavBar";
import Footer from "../../components/common/Footer";

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
