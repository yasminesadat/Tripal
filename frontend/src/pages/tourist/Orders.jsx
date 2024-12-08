import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Orders || Tripal",
};

const Orders = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content"></main>
        <FooterThree />
      </div>
    </>
  );
};

export default Orders;
