import { useState, useRef, useEffect } from "react";
import { Tour, ConfigProvider } from "antd";
import ArticlesOne from "@/components/homes/articles/ArticlesOne";
import Banner9 from "@/components/homes/banners/Banner9";
import BannerEight from "@/components/homes/banners/BannerEight";
import BrandsThree from "@/components/homes/brands/BrandsThree";
import DestinationsFive from "@/components/homes/destinations/DestinationsFive";
import Hero5 from "@/components/homes/heros/Hero5";
import TestimonialsFour from "@/components/homes/testimonials/TestimonialsFour";
import TourTypesTwo from "@/components/homes/tourTypes/TourTypesTwo";
import FeaturedTrips from "@/components/homes/tours/FeaturedTrips";
import FooterThree from "@/components/layout/footers/FooterThree";
import GuestHeader from "@/components/layout/header/GuestHeader";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal",
};

export default function HomePage5() {
  const [open, setOpen] = useState(false);
  const refHeader = useRef(null);
  const refLogin = useRef(null);

  const steps = [
    {
      title: "Welcome to TriPal!",
      description: "This is your guide to hassle-free travel planning, from start to finish.",
      target: () => {
        refHeader.current;
      },
    },
    {
      title: "Sign up or Log in",
      description: "You are 1 step away from getting introduced to a rollercoaster of events.",
      target: () => refLogin.current,
      // onFinish: () => {
      //   setOpen(false)
      // }
    },
  ];

  return (
    <>
      <MetaComponent meta={metadata} />
      <main >
        <GuestHeader ref={refHeader} refLogin={refLogin} setOpen={setOpen} />
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        <Hero5 />
        <BrandsThree />
        <TourTypesTwo />
        <FeaturedTrips />
        <BannerEight />
        <DestinationsFive />
        <TestimonialsFour />
        <ArticlesOne />
        <Banner9 />
        <FooterThree />
      </main>
    </>
  );
}
