import { homes, pages, tours } from "@/data/menu";

import { Link, useLocation } from "react-router-dom";

import React from "react";

export default function Menu() {
  const { pathname } = useLocation();
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <a
              className={
                pathname?.split("/")[1].split("-")[0] == "home"
                  ? "activeMenu"
                  : ""
              }
              href="#"
            >
              Home <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavSubnav">
              <div className="desktopNavSubnav__content">
                {homes.map((elm, i) => (
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
            <a href="#">
              Tour <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavMega">
              <div className="desktopNavMega__container">
                <div className="desktopNavMega__lists">
                  {tours.map((elm, i) => (
                    <div key={i} className="desktopNavMega-list">
                      <div className="desktopNavMega-list__item">
                        <div className="desktopNavMega-list__title">
                          {elm.title}
                        </div>

                        <div className="desktopNavMega-list__list">
                          {elm.links.map((elm2, i2) => (
                            <div key={i2} className="desktopNavMega-list__link">
                              <Link to={elm2.href}>{elm2.title}</Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="desktopNavMega__info">
                  <div className="specialCardGrid row y-gap-30">
                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <img src="/img/cta/10/1.jpg" alt="image" />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            Enjoy Upto
                          </div>
                          <h3 className="specialCard__title">60 % OFF</h3>
                          <div className="specialCard__text">
                            on Your Booking
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="specialCard">
                        <div className="specialCard__image">
                          <img src="/img/cta/10/2.jpg" alt="image" />
                        </div>

                        <div className="specialCard__content">
                          <div className="specialCard__subtitle">
                            80% Discount
                          </div>
                          <h3 className="specialCard__title">
                            Are You Ready
                            <br /> To Turkey Tour
                          </h3>
                          <div className="specialCard__text"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Destination</Link>
          </div>

          <div className="desktopNav__item">
            <a href="#">Activities</a>
          </div>

          <div className="desktopNav__item">
            <a href="#">
              Pages <i className="icon-chevron-down"></i>
            </a>

            <div className="desktopNavSubnav">
              <div className="desktopNavSubnav__content">
                {pages.map((elm, i) => (
                  <div key={i} className="desktopNavSubnav__item text-dark-1">
                    {elm.href ? (
                      <Link to={elm.href}>{elm.title}</Link>
                    ) : (
                      <a href="#">
                        {elm.title} <i className="icon-chevron-right"></i>
                      </a>
                    )}

                    {elm.subnav && (
                      <div className="desktopNavSubnav">
                        <div className="desktopNavSubnav__content">
                          {elm.subnav.map((elm2, i2) => (
                            <div key={i2} className="desktopNavSubnav__item">
                              <Link to={elm2.href}>{elm2.title}</Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="desktopNav__item">
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </>
  );
}
