import ArticlesTwo from "@/components/homes/articles/ArticlesTwo";
import BannerFive from "@/components/homes/banners/BannerFive";
import BannerSix from "@/components/homes/banners/BannerSix";
import BrandsTwo from "@/components/homes/brands/BrandsTwo";
import DestinationsThree from "@/components/homes/destinations/DestinationsThree";
import TrendingDestinations from "@/components/homes/destinations/TrendingDestinations";
import FeaturesFour from "@/components/homes/features/FeaturesFour";
import Hero3 from "@/components/homes/heros/Hero3";
import LinksList from "@/components/homes/others/LinksList";
import TestimonialsTwo from "@/components/homes/testimonials/TestimonialsTwo";
import TourSlider2 from "@/components/homes/tours/TourSlider2";
import FooterThree from "@/components/layout/footers/FooterThree";
import Header3 from "@/components/layout/header/Header3";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-3 || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function HomePage3() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header3 />
        <Hero3 />
        <BrandsTwo />
        <DestinationsThree />
        <TourSlider2 />
        <TrendingDestinations />
        <TestimonialsTwo />
        <FeaturesFour />
        <BannerFive />
        <ArticlesTwo />
        <LinksList />
        <BannerSix />
        <FooterThree />
      </main>
    </>
  );
}
