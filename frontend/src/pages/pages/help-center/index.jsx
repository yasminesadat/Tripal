import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Activity from "@/components/pages/helpCenter/Activity";
import Faq from "@/components/pages/helpCenter/Faq";
import Hero from "@/components/pages/helpCenter/Hero";
import React from "react";
import GuestHeader from "@/components/layout/header/GuestHeader";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
const metadata = {
  title: "Help center || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function HelpCenterPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <GuestHeader />
        <Hero />
        <Activity />
        <Faq />
        <FooterThree />
      </main>
    </>
  );
}
