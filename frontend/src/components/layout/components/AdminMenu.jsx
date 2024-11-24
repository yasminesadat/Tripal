import { categories, users } from "@/data/adminMenu";

import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  const { pathname } = useLocation();
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/admin">Home</Link>
          </div>

          <div className="desktopNav__item">
            <a
              className={
                pathname?.split("/")[1].split("-")[0] == "home"
                  ? "activeMenu"
                  : ""
              }
              href="#"
            >
              Categories and Tags <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavSubnav">
              <div className="desktopNavSubnav__content">
                {categories.map((elm, i) => (
                  <div key={i} className="desktopNavSubnav__item text-dark-1">
                    <Link
                      className={pathname == elm.href ? "activeMenu" : ""}
                      to={elm.href}
                    >
                      {elm.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Upcoming Events</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Products</Link>
          </div>

          <div className="desktopNav__item">
            <a
              className={
                pathname?.split("/")[1].split("-")[0] == "home"
                  ? "activeMenu"
                  : ""
              }
              href="#"
            >
              Users <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavSubnav">
              <div className="desktopNavSubnav__content">
                {users.map((elm, i) => (
                  <div key={i} className="desktopNavSubnav__item text-dark-1">
                    <Link
                      className={pathname == elm.href ? "activeMenu" : ""}
                      to={elm.href}
                    >
                      {elm.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <Link to="/contact">Complaints</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/revenue">Revenue</Link>
          </div>
        </div>
      </div>
    </>
  );
}
