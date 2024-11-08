import React from "react";

export default function Hero() {
  return (
    <section className="pageHeader -type-1">
      <div className="pageHeader__bg">
        <img src="/img/pageHeader/1.jpg" alt="image" />
        <img src="/img/hero/1/shape.svg" alt="image" />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div className="pageHeader__content">
              <h1 className="pageHeader__title">Phuket</h1>

              <p className="pageHeader__text">
                Explore deals, travel guides and things to do in Phuket
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
