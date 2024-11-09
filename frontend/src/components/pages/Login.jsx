import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="full-height-container">
      <MDBContainer fluid className="p-4">
        <MDBRow>
          <MDBCol
            md="6"
            className="text-center text-md-start d-flex flex-column justify-content-center"
          >
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="hero__subtitle mb-20 md:mb-10"
            >
              One site, 300,000+ experiences you'll remember
            </div>

            <h1 className="hero__title" data-aos="fade-up" data-aos-delay="300">
              Your Adventure
              <br className="md:d-none" />
              Travel Experts
              <br className="md:d-none" />
              In World!
              <br />
              <img src="/img/hero/3/brush-1.svg" alt="brush stroke" />
            </h1>
          </MDBCol>

          <MDBCol md="6">
            <MDBCard className="my-5">
              <MDBCardBody className="p-5">
                <MDBRow>
                  <MDBCol
                    md="10"
                    className="text-center text-md-start d-flex flex-column justify-content-center"
                  >
                    <div
                      data-aos="fade-up"
                      data-aos-delay="200"
                      className="hero__subtitle mb-20 md:mb-10"
                    >
                      <div className="text-18 fw-500 mt-20 md:mt-15">
                        We're glad to see you again!
                      </div>
                      <div className="mt-5">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-accent-1">
                          Sign Up!
                        </Link>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="contactForm border-1 rounded-12 px-60 py-60 md:px-25 md:py-30"
                    >
                      <div className="form-input position-relative">
                        <input type="email" required />
                        <label className="lh-1 text-16 text-light-1">
                          Email Address
                        </label>
                      </div>

                      <div className="form-input mt-30 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                        />
                        <label className="lh-1 text-16 text-light-1">
                          Password
                        </label>
                        <span
                          className="password-toggle-icon"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <MDBIcon fas icon="eye-slash" />
                          ) : (
                            <MDBIcon fas icon="eye" />
                          )}
                        </span>
                      </div>

                      <div className="row y-ga-10 justify-between items-center pt-30">
                        <div className="col-auto">
                          <div className="d-flex items-center">
                            <div className="form-checkbox ">
                              <input type="checkbox" name="name" />
                              <div className="form-checkbox__mark">
                                <div className="form-checkbox__icon">
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="lh-11 ml-10">Remember me</div>
                          </div>
                        </div>

                        <div className="col-auto">
                          <a href="#">Lost your password?</a>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="button -md -dark-1 bg-accent-1 text-white col-12 mt-30"
                      >
                        Log In
                        <i className="icon-arrow-top-right ml-10"></i>
                      </button>
                    </form>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <style>{`
        .full-height-container {
          height: 100vh !important; /* Full height of the screen */
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
        }

        .column {
          flex: 1 !important; /* Each column takes equal space */
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .hero__bg img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: -1 !important;
        }

        .password-toggle-icon {
          position: absolute !important;
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
}
