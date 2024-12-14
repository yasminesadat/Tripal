import Messages from "@/components/dasboard/Messages";
import { useLocation } from "react-router-dom";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
    title: "Customer Support || Tripal",
};

export default function ComplaintsReplies() {
    const location = useLocation();
    const { complaint, user, role } = location.state || { complaint: null, user: null, role: null };

    return (
        <>
            <MetaComponent meta={metadata} />
            <div className="page-wrapper">
                <TouristHeader />
                <main className="page-content-hana">
                    <Messages complaint={complaint} user={user} role={role} />
                </main>
                <FooterThree />
            </div>
        </>
    );
}
