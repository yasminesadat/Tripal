import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/upcomingactivities">Activities</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/tourist">Itineraries</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Historical Places</Link>
          </div>

          {/* <div className="desktopNav__item">
            <Link to="/destinations">Products</Link>
          </div>

          <div className="desktopNav__item">
            <a
              className={
                pathname?.split("/")[1].split("-")[0] == "home"
                  ? "activeMenu"
                  : ""
              }
            >
              Hotels & Flights <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavSubnav">
              <div className="desktopNavSubnav__content">
                {hotelsandflights.map((elm, i) => (
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
          </div> */}
        </div>
      </div>
    </>
  );
}
