import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";
import GuestHeader from "@/components/layout/header/GuestHeader";
import OtpForm from "@/components/pages/account/OtpForm";
import { useLocation } from "react-router-dom";

const metadata = {
  title: "Reset Password",
};


export default function ResetPassword() {
    const location = useLocation();
    const { email } = location.state || {}; 

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <GuestHeader />
        <OtpForm email={email} />
        <FooterThree />
      </main>
    </>
  );
}
