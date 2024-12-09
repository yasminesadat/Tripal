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
    },
  ];

  return (
    <>
      <style jsx global>{`
        /* Base style for all dots */
        /* Try multiple selectors and approaches */
        .ant-tour .ant-tour-indicators > span {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #dac4d0 !important;
        }
           .ant-tour {
  z-index: 2000 !important;
}

.ant-tour-mask {
  z-index: 1999 !important; 
}
        .ant-tour .ant-tour-indicators > span[class*="active"] {
          background: #036264 !important;
        }

        /* Additional specificity */
        .ant-tour-indicators span[role="dot"][aria-current="true"] {
          background: #036264 !important;
        }

        .ant-tour .ant-tour-inner {
          border: 1px solid #5a9ea0;
          box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
        }

        .ant-tour .ant-tour-content {
          color: #8f5774;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-rendering: optimizeLegibility !important;
        }

        .ant-tour .ant-tour-title {
          color: #5a9ea0;
          font-weight: 600;
        }

        .ant-tour .ant-tour-close {
          color: #5a9ea0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ant-tour .ant-tour-close:hover {
          opacity: 1;
          color: #e5f8f8;
        }

        .ant-tour .ant-tour-buttons .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary
        {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default{
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        
        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color:white;
          background: #5a9ea0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
        }
        .ant-tour .ant-tour-arrow-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }  
      `}</style>
      <MetaComponent meta={metadata} />
      <main >
        <GuestHeader ref={refHeader} refLogin={refLogin} setOpen={setOpen} homepage={"home"} />
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        <Hero5 />
        <BrandsThree />
        <TourTypesTwo />
        <br></br>
        <br></br>
        <BannerEight tourist={false}/>
        <DestinationsFive />
        <TestimonialsFour />
        <FooterThree />
      </main>
    </>
  );
}
