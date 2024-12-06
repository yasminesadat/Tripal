import TourGuideHeader from "../../components/layout/header/TourGuideHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import ItineraryRevenue from "../tourguide/Revenue"
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal",
};

const TourGuideHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TourGuideHeader />
        <main className="page-content">
          <ItineraryRevenue/>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default TourGuideHome;
