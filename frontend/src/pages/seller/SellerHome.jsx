import SellerHeader from "../../components/layout/header/SellerHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import ProductRevenue from "../seller/Revenue"
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal",
};
const SellerHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <SellerHeader />
        <main className="page-content">
          <ProductRevenue/>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default SellerHome;
