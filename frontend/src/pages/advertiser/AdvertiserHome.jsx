import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const AdvertiserHome = () => {
  return (
    <div className="page-wrapper">
      <AdvertiserHeader />
      <main className="page-content">
        <h1>Welcome Advertiser</h1>
        <p>This is a dummy component.</p>
        <div className="admin-content-details"></div>
      </main>
      <FooterThree />
    </div>
  );
};

export default AdvertiserHome;
