import React, { useEffect, useState } from "react";
import ProductList from "../../components/product/ProductList"; 
import TouristNavBar from "../../components/navbar/TouristNavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TouristHomePage = () => {
  const [currency, setCurrency] = useState("EGP"); 

  useEffect(() => {
    const curr = sessionStorage.getItem("currency");
    if (curr) {
      setCurrency(curr);
    }
  }, []);

  return (
    <div>
      <TouristNavBar />
      <ProductList curr={currency} />
      <ToastContainer />
    </div>
  );
};

export default TouristHomePage;