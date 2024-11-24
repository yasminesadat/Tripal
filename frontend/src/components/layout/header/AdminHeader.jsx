import { useState } from "react";
import Menu from "../components/AdminMenu";
import { profile } from "@/data/adminMenu";

import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header3() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pageNavigate = (pageName) => {
    navigate(pageName);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addClass, setAddClass] = useState(true);

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
            <Link to="/" className="ml-20">
              {/*/help-center*/}
              Help
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30"
            >
              <i className="icon-person text-18"></i>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
