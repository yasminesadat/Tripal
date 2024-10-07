import React from "react";
import GovernorNavBar from "../../components/governor/GovernorNavBar";

const GovernorHome = () => {
  return (
    <div>
      <GovernorNavBar />
      <h1 style={{ fontSize: "48px", textAlign: "center", margin: "200px 0" }}>
        Governor
      </h1>
    </div>
  );
};

export default GovernorHome;
