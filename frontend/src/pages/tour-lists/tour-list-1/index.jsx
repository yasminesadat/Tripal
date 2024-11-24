import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tours/PageHeader";
import HistoricalPlacesList from "@/components/tours/HistoricalPlacesList";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Tour-list-1 || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function TourListPage1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header1 />
        <PageHeader />
        <HistoricalPlacesList />
        <FooterOne />
      </main>
    </>
  );
}
