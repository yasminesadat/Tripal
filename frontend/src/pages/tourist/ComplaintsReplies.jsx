import Messages from "@/components/dasboard/Messages";
import React from "react";
import { useLocation } from "react-router-dom";

import MetaComponent from "@/components/common/MetaComponent";
import { useState } from "react";
const metadata = {
    title: "Dashboard-messages || ViaTour - Travel & Tour Reactjs Template",
    description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function ComplaintsReplies() {
    const location = useLocation();

    // Extract complaint from location.state
    const { complaint, user, role } = location.state || { complaint: null, user: null, role: null };


    return (

        <>
            <MetaComponent meta={metadata} />
            <main>
                <Messages complaint={complaint} user={user} role={role} />
            </main>
        </>
    );
}