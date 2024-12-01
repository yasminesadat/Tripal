import FooterThree from "@/components/layout/footers/FooterThree";
import Register from "@/components/pages/Register";

import MetaComponent from "@/components/common/MetaComponent";
import GuestHeader from "@/components/layout/header/GuestHeader";

const metadata = {
  title: "Register || Tripal",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function RegisterPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <GuestHeader />
        <Register />
        <FooterThree />
      </main>
    </>
  );
}
