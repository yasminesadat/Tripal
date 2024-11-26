import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal ",
};
const AdvertiserHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <AdvertiserHeader />
        <main className="page-content">
          <h1>Welcome Advertiser</h1>
          <p>This is a dummy component.</p>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default AdvertiserHome;
