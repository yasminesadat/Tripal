import DBMain from "@/components/dasboard/main";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Dashboard-main || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function DBMainPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <DBMain />
      </main>
    </>
  );
}
