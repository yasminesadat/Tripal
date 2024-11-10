import { Button, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import bg from '../../assets/images/bg.png';
import front from '../../assets/images/1.png';
import { getTouristFlights } from '../../api/TouristService';
import { getHotelHistory } from "../../api/HotelService";
const hotelTourist = "6724842b5831eed787083b57"
const TransportationBookingPopUp = ({ setDoneBookTransportation, setBooked }) => {
  const touristFlight = "672aff256aa38ed2c3b51b36";
  const hotelHistoryTourist = "672d644cf0af912964daa4f9"
  const [open, setOpen] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };
  const handleCancel = () => {
    setBooked(false);
    setOpen(false);
    setDoneBookTransportation(true);
  };

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open
      </Button> */}
      <Modal
        open={open}
        // onOk={handleOk}
        // //confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[]}
      >
        <section className="cta -type-1 " >
          <div className="cta__bg" >
            <img src={bg} alt="background" />
          </div>
          <div className="container" >
            <div className="row justify-between">
              <div className="col-xl-5 col-lg-6">
                <div className="cta__content">
                  <h2
                    data-aos="fade-up"
                    data-aos-delay=""
                    className="text-40 md:text-24 lh-13 text-white"
                  >
                    Transport from
                    <br className="lg:d-none" />
                    and to the Airport
                  </h2>

                  <p
                    data-aos="fade-up"
                    data-aos-delay=""
                    className="mt-10 text-white"
                  >
                    Book your transportation from and to the Airport
                    <br className="lg:d-none" />
                    FREE
                  </p>

                  {/* <div
                data-aos="fade-up"
                data-aos-delay=""
                className="text-18 text-white mt-40 md:mt-20"
              >
                Get a magic link sent to your email
              </div> */}

                  <div className="mt-10">
                    <div className="singleInput -type-2 row x-gap-10 y-gap-10">
                      {/* <div className="col-md-auto col-12">
                    <input type="email" placeholder="Email" className="" />
                  </div> */}
                      <div className="col-md-auto col-12">
                        <button
                          data-aos="fade-right"
                          data-aos-delay=""
                          className="button -md -accent-1 bg-white col-12 text-accent-2"
                          onClick={() => {
                            setBooked(true);
                            setOpen(false);
                            setDoneBookTransportation(true);
                          }} // Close the modal on click
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="cta__image">
                  <img src={front} alt="image" />
                </div>
              </div>
            </div>
          </div>
        </section >
      </Modal >
    </>
  );
};
export default TransportationBookingPopUp;


