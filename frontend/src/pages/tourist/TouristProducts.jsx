import MetaComponent from "@/components/common/MetaComponent";
import ProductList from "../../components/product/ProductList"; 
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

const metadata = {
  title: "Products || Tripal",
  description: "Products || Tripal",
};

const TouristProducts = () => {

  return (
    <div>
      <MetaComponent meta={metadata} />
      <TouristHeader /> <br/>
      <ProductList/>
      <FooterThree />
    </div>
  );
};

export default TouristProducts;