import FooterThree from "@/components/layout/footers/FooterThree";
import Login from "@/components/pages/account/Login";

import MetaComponent from "@/components/common/MetaComponent";
import GuestHeader from "@/components/layout/header/GuestHeader";

const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <GuestHeader />
        <Login />
        <FooterThree />
      </main>
    </>
  );
}
