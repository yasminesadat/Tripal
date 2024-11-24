import React from "react";
import { Link } from 'react-router-dom';

export default function PageHeader() {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
                <Link to="/tourist">Home</Link> 
              </span>

              <span>{">"}</span>
              <span className="breadcrumbs__item">
                <Link to="/upcoming-activities">Activities</Link> 
              </span>
              {/* <span>{">"}</span>
              <span className="breadcrumbs__item">
                <a href="#">Phuket</a>
              </span> */}
            </div>
          </div>

          <div className="col-auto">
            <div className="pageHeader__subtitle">
              {/* THE 10 BEST Phuket Tours & Excursions */}
            </div>
          </div>
        </div>

        <div className="row pt-30">
          <div className="col-auto">
            <h1 className="pageHeader__title">
              Explore all upcoming activities
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
