import TourGuideHeader from "../../components/layout/header/TourGuideHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal - Travel Agency",
};

const TourGuideHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TourGuideHeader />
        <main className="page-content">
          <h1>Welcome Tour Guide</h1>
          <p>This is a dummy component.</p>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default TourGuideHome;
