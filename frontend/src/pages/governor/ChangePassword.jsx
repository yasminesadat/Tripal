import { useEffect, useState } from "react";
import ChangePassword from "@/components/common/ChangePassword";
import FooterThree from "@/components/layout/footers/FooterThree";
import { getUserData } from "@/api/UserService";
import GovernorHeader from "@/components/layout/header/GovernorHeader";
const GovernorChangePassword = () => {
    const [userData, setUserData] = useState("");
    const [setUserRole] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();
            setUserData(user.data.id);
            setUserRole(user.data.role);
        };

        fetchUser();
    }, []);

    return (
        <div className="page-wrapper">
            <GovernorHeader />

            <main className="page-content-hana">
                <ChangePassword id={userData} userType={"governor"} />

            </main>
            <FooterThree />
        </div>
    );
};

export default GovernorChangePassword;
