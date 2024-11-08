import Profile from "@/components/dasboard/Profile";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Dashboard-my-profile || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function DBProfilePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Profile />
      </main>
    </>
  );
}
