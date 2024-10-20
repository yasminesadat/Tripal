import React from "react";
import GuestNavBar from "../components/navbar/GuestNavBar";
import SignUpAllUsers from "../components/home/SignUpAllUsers";
import mainLogo from "../assets/images/Tripal-logo.png";

const Home = () => {
  return (
    <div className="home">
      <GuestNavBar />
      <h1 style={{
        color: '#007BFF',
        textAlign: 'center',
        margin: '20px 0',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        WELCOME TO TRIPAL
      </h1>

      <img
        src={mainLogo}
        alt="logo"
        style={{
          float: "right",
          maxWidth: "100%",
          width: "20%",
          height: "auto",
          marginTop: "-5%",
        }}
      />
      <SignUpAllUsers />

    </div>
  );
};

export default Home;
