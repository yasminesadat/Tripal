import { useState, useEffect } from "react";
import { getUserData } from "@/api/UserService";
import MetaComponent from "@/components/common/MetaComponent";
import Activity from "@/components/pages/helpCenter/Activity";
import Faq from "@/components/pages/helpCenter/Faq";
import Hero from "@/components/pages/helpCenter/Hero";
import GuestHeader from "@/components/layout/header/GuestHeader";
import TouristHeader from "@/components/layout/header/TouristHeader";
import SellerHeader from "@/components/layout/header/SellerHeader";
import TourGuideHeader from "@/components/layout/header/TourGuideHeader";
import AdvertiserHeader from "@/components/layout/header/AdvertiserHeader";
import GovernorHeader from "@/components/layout/header/GovernorHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const metadata = {
  title: "Help center || Tripal",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function HelpCenterPage() {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserData();
        setUserData(user.data.id);
        setUserRole(user.data.role);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserRole("guest");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const renderHeader = () => {
    if (isLoading) return null;

    switch (userRole) {
      case "Tourist":
        return <TouristHeader />;
      case "Seller":
        return <SellerHeader />;
      case "Advertiser":
        return <AdvertiserHeader />;
      case "Tour Guide":
        return <TourGuideHeader />;
      case "Tourism Governor":
        return <GovernorHeader />;
      default:
        return <GuestHeader />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        {renderHeader()}
        <Hero />
        <Activity />
        <Faq />
        <FooterThree />
      </main>
    </>
  );
}