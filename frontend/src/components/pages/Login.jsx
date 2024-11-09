import { Link } from "react-router-dom";
import React from "react";

export default function Login() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img src="/img/hero/5/bg.png" alt="background" />
      </div>

      <div className="container">
        <div className="column1"></div>

        <div className="column2">
          <div>
            <img src="/img/hero/3/1.png" alt="image" />
            <img src="/img/hero/3/3.png" alt="image" />
            <div />
            <div className="column3">
              <img src="/img/hero/3/2.png" alt="image" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
       .hero {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
        }

        .container {
          display: flex;
          justify-content: space-between;
          align-items: stretch; /* Align heights of columns */
          height: 100%;
        }

        .column2 {
          margin-right: 20%; /* Add space between columns */
        }

        .login-section {
          z-index: 1;
          background: rgba(255, 255, 255, 0.8); /* White background with opacity */
          padding: 20px;
          border-radius: 8px;
          transform: translateY(50px); /* Translate down */
        }

        .hero__image {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          z-index: 1;
        }

        .hero__image img {
          margin-bottom: 10px; /* Add some space between images */
        }
      `}</style>
    </section>
  );
}
