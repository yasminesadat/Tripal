import React from "react";
import SignUp from "../components/SignUp";
import SignUpAllUsers from "../components/SignUpAllUsers";
import mainLogo from "../assets/images/Tripal-logo.png";
const Home = () => {
  return (
    <div className="home">
      <h1>WELCOME TO TRIPAL</h1>
      <img
        src={mainLogo}
        alt="Description of the image"
        style={{
          float: "right",
          maxWidth: "100%",
          height: "auto",
          marginTop: "-15%",
        }}
      />

      <SignUpAllUsers />
    </div>
  );
};

export default Home;
