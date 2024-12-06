import React from "react";
import SearchComponent from './SearchComponent';
export default function Hero() {
  return (
    <section className="pageHeader -type-2">
      <div className="pageHeader__bg">
        <img src="/img/pageHeader/2.jpg" alt="image" />
        <img src="/img/hero/1/shape.svg" alt="image" />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div className="pageHeader__content">
              <p className="pageHeader__text">
                <h1 className="pageHeader__title">Welcome to Our Travel Help Center</h1>
                <p className="pageHeader__text">
                  Find answers, guides, and expert assistance for all your travel questions. Whether you're planning your first trip or seeking destination advice, we're here to help you create your perfect getaway.
                </p>              </p>

              <SearchComponent />
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
