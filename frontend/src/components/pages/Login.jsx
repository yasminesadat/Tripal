import { Link } from "react-router-dom";
import React, { useState } from "react";
import UserForm from "./UserForm";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(value.includes("@") && value.includes("."));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(value.length >= 6);
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
                  <MDBCol>
                    <UserForm />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <style>{`
        .full-height-container {
          height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
        }

        .password-toggle-icon {
          position: absolute !important;
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          cursor: pointer !important;
        }

        .is-invalid {
          border-color: red;
        }

        .invalid-feedback {
          color: red;
          font-size: 0.875rem;
          margin-top: 5px;
        }

        /* Floating Label Styles */
        .form-input {
          position: relative;
        }

        .form-input input {
          padding-top: 1.25rem;
        }

        .form-input label {
          position: absolute;
          top: 0.75rem;
          left: 0.5rem;
          transition: all 0.2s ease;
          font-size: 1rem;
          color: #888;
        }

        .form-input.floating label,
        .form-input input:focus + label {
          top: -0.5rem;
          left: 0.5rem;
          font-size: 0.75rem;
          color: #333;
        }
      `}</style>
    </div>
  );
}
