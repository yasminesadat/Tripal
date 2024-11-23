import FooterThree from "@/components/layout/footers/FooterThree";
import Header3 from "@/components/layout/header/Header3";
import Register from "@/components/pages/Register";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Register || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function RegisterPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header3 />
        <Register />
        <FooterThree />
      </main>
    </>
  );
}
