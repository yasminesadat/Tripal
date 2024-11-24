import GovernorHeader from "../../components/layout/header/GovernorHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal - Travel Agency",
};

const GovernorHome = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <GovernorHeader />
        <main className="page-content">
          <h1>Welcome Governor</h1>
          <p>This is a dummy component.</p>
          <div className="admin-content-details"></div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default GovernorHome;
