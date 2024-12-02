import ValidateOtp from "./ValidateOtp";
import ChangePassword from "./ChangePassword";
import { useState } from "react";

export default function OtpForm({ email }) {
    const [isOtpValid, setIsOtpValid] = useState(false);

    const handleOtpValidationSuccess = () => {
      setIsOtpValid(true);
    };
  return (
    <div className="full-height-container">
        <div className="layout-pt-xl layout-pb-xl rounded-12">
          <div className="sectionBg">
            <img
              src="/img/about/1/1.png"
              alt="image"
              className="img-ratio rounded-12 md:rounded-0"
            />
            {/* <img
            src="/img/about/1/diana-blob.png"
            alt="image"
            className="img-ratio rounded-12 md:rounded-0"
            /> */}
          </div>

          <div className="row y-gap-30 justify-center items-center">
          {!isOtpValid ? (
            <ValidateOtp email={email} onValidationSuccess={handleOtpValidationSuccess} />
          ) : (
            <ChangePassword email={email} />
          )}
          </div>
        </div>
        <style>{`
        .full-height-container {
          height: 100vh !important;
          margin-top: 6% !important;
          display: flex !important;
          flex-direction: column !important;
          position: relative !important;
        }
      `}</style>
      </div>
  );
}
