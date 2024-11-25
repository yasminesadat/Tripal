import { useState } from "react";
import Menu from "../components/GuestMenu";
import Currency from "../components/Currency";
import { Link, useNavigate } from "react-router-dom";

export default function GuestHeader() {
  //const [profileInformation, setProfileInformation] = useState({});
  const navigate = useNavigate();

  const pageNavigate = (pageName) => {
    navigate(pageName);
  };
  const [, setMobileMenuOpen] = useState(false);
  const [addClass] = useState(true);

  const handleCurrencyChange = async (currency) => {
    // const updatedProfileData = {
    //   choosenCurrency: currency,
    // };
    // try {
    //   await updateTouristInformation(updatedProfileData);
    //   // sessionStorage.removeItem("currency");
    //   // sessionStorage.setItem("currency", currency);
    // } catch (error) {
    //   message.error("Failed to update user information:", error);
    // }
  };

  return (
    <>
      <header
        className={`header -type-3 js-header ${addClass ? "-is-sticky" : ""}`}
      >
        <div className="header__container container">
          <div className="headerMobile__left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header__menuBtn js-menu-button"
            >
              <i className="icon-main-menu"></i>
            </button>
          </div>

          <div className="header__logo">
            <Link to="/" className="header__logo">
              <img src="/img/general/logo.svg" alt="logo icon" />
            </Link>

            <Menu />
          </div>

          <div className="headerMobile__right">
            <button
              onClick={() => pageNavigate("/tour-list-1")}
              className="d-flex"
            >
              <i className="icon-search text-18"></i>
            </button>

            <button
              onClick={() => pageNavigate("/login")}
              className="d-flex ml-20"
            >
              <i className="icon-person text-18"></i>
            </button>
          </div>

          <div className="header__right">
            <Currency />
            <Link to="/register" className="ml-10">
              Sign up
            </Link>

            <Link
              to="/login"
              className="button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>
      <style>{`
        .button.hovered {
          background-color: var(--color-dark-1) !important;
          color: white !important;
        }

        .dropdown-menu {
          position: absolute;
          top: 90%;
          left: 87%;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px; /* Added border-radius for rounded corners */
          z-index: 1000;
        }

        .dropdown-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .dropdown-menu li {
          padding: 10px 20px;
          cursor: pointer;
        }

        .dropdown-menu a {
          text-decoration: none;
          color: inherit;
        }`}</style>
    </>
  );
}
