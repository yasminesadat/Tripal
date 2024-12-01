import ProductList from "../../components/product/ProductList"; 
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

const TouristProducts = () => {

  return (
    <div>
      <TouristHeader /> <br/>
      <ProductList/>
      <FooterThree />
    </div>
  );
};

export default TouristProducts;