import React, { useState } from 'react';
import Sidebar from '@/components/dasboard/Sidebar';
import Header from '@/components/dasboard/Header';
import UserListComponent from '@/components/dasboard/ViewUsers';
const UserList = () => {
    const [sideBarOpen, setSideBarOpen] = useState(true);
    return (
        <>
            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
                    } js-dashboard`}
            >
                <Sidebar setSideBarOpen={setSideBarOpen} />

                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                    

<UserListComponent/>


                    <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
                </div>
            </div>
        </>
    );
};

export default UserList;