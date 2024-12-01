import { useEffect, useState } from "react";
import MetaComponent from "@/components/common/MetaComponent";
import ProductList from "../../components/product/ProductList"; 
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

const metadata = {
  title: "Products || Tripal",
  description: "Products || Tripal",
};

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
      <MetaComponent meta={metadata} />
      <TouristHeader /> <br/>
      <ProductList curr={currency} />
      <FooterThree />
    </div>
  );
};

export default TouristProducts;