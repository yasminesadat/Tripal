import React from "react";
import { tourismGovernerID } from "../../IDs";
import ChangePassword from "../../components/common/ChangePassword";
import Footer from "../../components/common/Footer";
import GovernorNavBar from "../../components/navbar/GovernorNavBar";

const GovernorChangePassword = () => {

    return (
        <div>
            <GovernorNavBar />
            <ChangePassword id={tourismGovernerID} userType="governor" />
            <Footer />
        </div>
    );
};

export default GovernorChangePassword;