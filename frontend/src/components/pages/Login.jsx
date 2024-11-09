import { Link } from "react-router-dom";
import React, { useState } from "react";
import UserForm from "./UserForm";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

export default function Login() {
  return (
    <div className="full-height-container">
      <MDBContainer fluid className="p-4">
        <MDBRow>
          <MDBCol
            md="6"
            className="text-center text-md-start d-flex flex-column justify-content-center"
          >
            <div className="images-container">
              <img
                src="/img/hero/3/1.png"
                alt="image"
                className="background-image"
              />
              <img
                src="/img/hero/3/2.png"
                alt="image"
                className="background-image"
              />
              <img
                src="/img/hero/3/3.png"
                alt="image"
                className="background-image"
              />
            </div>
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
 .images-container {
          position: absolute;
          margin-top: 3%;
          margin-left: 1%;
          width: 50%;
          height: 80%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 1% 30%;
          justify-items: left;
          align-items: center;
        }

        .background-image {
          width: 70%;
          height: auto;
        }

        .images-container img:nth-child(1) {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .images-container img:nth-child(2) {
          grid-column: 1 / 2;
          grid-row: 2 / 3;
        }

        .images-container img:nth-child(3) {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }

      `}</style>
    </div>
  );
}
