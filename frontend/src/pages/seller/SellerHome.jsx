import SellerHeader from "../../components/layout/header/SellerHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal - Travel Agency",
};
const SellerHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <SellerHeader />
        <main className="page-content">
          <h1>Welcome Seller</h1>
          <p>This is a dummy component.</p>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default SellerHome;
