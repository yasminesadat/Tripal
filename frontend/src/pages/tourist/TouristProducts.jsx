import { useEffect, useState } from "react";
import ProductList from "../../components/product/ProductList"; 
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

const TouristProducts = () => {
  const [currency, setCurrency] = useState("EGP"); 

  useEffect(() => {
    const curr = sessionStorage.getItem("currency");
    if (curr) {
      setCurrency(curr);
    }
  }, []);

  return (
    <div>
      <TouristHeader /> <br/>
      <ProductList curr={currency} />
      <FooterThree />

    </div>
  );
};

export default TouristProducts;