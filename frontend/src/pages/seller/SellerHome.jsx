import SellerHeader from "../../components/layout/header/SellerHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const SellerHome = () => {
  return (
    <div className="page-wrapper">
      <SellerHeader />
      <main className="page-content">
        <h1>Welcome Seller</h1>
        <p>This is a dummy component.</p>
        <div className="admin-content-details"></div>
      </main>
      <FooterThree />
    </div>
  );
};

export default SellerHome;
