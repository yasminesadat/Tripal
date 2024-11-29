import { useState, useEffect } from "react";
import Menu from "../components/TouristMenu";
import { profile } from "@/data/touristMenu";
import Currency from "../components/Currency";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/api/UserService";
import { message } from "antd";
import {
  updateTouristInformation,
  getTouristInformation,
} from "@/api/TouristService";

export default function TouristHeader() {
  const [profileInformation, setProfileInformation] = useState({});
  const navigate = useNavigate();

  const pageNavigate = (pageName) => {
    navigate(pageName);
  };
  const [, setMobileMenuOpen] = useState(false);
  const [addClass] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let closeTimeout;

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.status === "success") {
      window.location.href = "/login";
    } else {
      message.error(result.message);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setDropdownOpen(true);
  };

  const handleCurrencyChange = async (currency) => {
    const updatedProfileData = {
      choosenCurrency: currency,
    };

    try {
      await updateTouristInformation(updatedProfileData);
      // sessionStorage.removeItem("currency");
      // sessionStorage.setItem("currency", currency);
    } catch (error) {
      message.error("Failed to update user information:", error);
    }
  };

  useEffect(() => {
    const getUserInformation = async () => {
      try {
        const response = await getTouristInformation();
        setProfileInformation(response);
        // sessionStorage.removeItem("currency");
        // sessionStorage.setItem("currency", response.choosenCurrency);
      } catch (error) {
        message.error("Failed to fetch user information:", error);
      }
    };

    getUserInformation();
  }, []);

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
            <Link to="/tourist" className="header__logo">
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
            <div className="ml-15">
              <Currency
                userCurrency={profileInformation.choosenCurrency}
                onCurrencyChange={handleCurrencyChange}
              />
            </div>
            <Link to="/tourist/booking-history" className="ml-20">
              {/*/includes itineraries, activities, flights,and hotels - both history and upcoming bookings*/}
              My Bookings
            </Link>
            <Link to="/" className="ml-20">
              {/*/help-center*/}
              Help
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30 ${
                dropdownOpen ? "hovered" : ""
              }`}
            >
              <i className="icon-person text-18"></i>
            </button>
            {dropdownOpen && (
              <div
                className="dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ul>
                  {profile.map((item) => (
                    <li key={item.id}>
                      {item.title === "Log Out" ? (
                        <a onClick={handleLogout}>{item.title}</a>
                      ) : (
                        <a href={item.href}>{item.title}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
