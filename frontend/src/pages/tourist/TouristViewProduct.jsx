import React from "react";
import ProductDetails from "../../components/product/ProductDetails";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

const TouristViewProduct = () => {
  return (
    <div>
      <TouristHeader /><br/><br/>
      <ProductDetails homeURL={"/tourist"} productsURL={"/tourist/view-products"}/>
      <FooterThree/>
    </div>
  );
};

export default TouristViewProduct;
