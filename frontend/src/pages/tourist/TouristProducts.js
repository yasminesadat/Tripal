import React from "react";
import ProductList from "../../components/product/ProductList";
import TouristNavbar from "../../components/tourist/TouristNavBar";

const TouristProducts = () => {
  return (
    <div>
      <TouristNavbar />
      <ProductList />
    </div>
  );
};

export default TouristProducts;
