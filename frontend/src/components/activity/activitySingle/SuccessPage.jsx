import{ useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { completeBooking } from '../../../api/BookingService';
import MetaComponent from '@/components/common/MetaComponent';
import TouristHeader from '@/components/layout/header/TouristHeader';
import FooterThree from '@/components/layout/footers/FooterThree';

const extractBookingParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    sessionId: searchParams.get('session_id'),
    touristId: searchParams.get('tourist_id'),
    resourceType: searchParams.get('resource_type'),
    tickets: searchParams.get('tickets'),
    resourceId: searchParams.get('resource_id'),
  };
};

const handleBookingCompletion = async ({
  sessionId,
  touristId,
  resourceType,
  tickets,
  resourceId,
}) => {

  if (sessionId && touristId && resourceType && tickets && resourceId) {
    try {
      await completeBooking(
        sessionId,
        touristId,
        resourceType,
        parseInt(tickets, 10),
        resourceId
      );
      message.success('Booking completed successfully.');
      return true;
    } catch (error) {
      console.error('Error completing booking:', error);
      const errorMessage = error instanceof Error ? error.stack || error.message : error.toString();
      message.error(`Failed to complete booking. Error: ${errorMessage}`);
      return false;
    }
  } else {
    if (!sessionId) console.log('Missing sessionId');
    if (!touristId) console.log('Missing touristId');
    if (!resourceType) console.log('Missing resourceType');
    if (!tickets) console.log('Missing tickets');
    if (!resourceId) console.log('Missing resourceId');
    message.error('Missing required booking information. Please check the URL parameters.');
    return false;
  }
};
export default function SuccessPage() {
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const hasCompletedBooking = useRef(false);

  useEffect(() => {
    if (hasCompletedBooking.current) return;
    hasCompletedBooking.current = true;

    const completeBookingAsync = async () => {
      const bookingParams = extractBookingParams();
      const completionStatus = await handleBookingCompletion(bookingParams);
      setBookingCompleted(completionStatus);
    };
    completeBookingAsync();
  }, []);

  return (
    <div>
      <MetaComponent title="Payment Done" />
      <TouristHeader />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)',
          backgroundColor: '#e5f8f8',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {bookingCompleted ? (
          <div
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#11302a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '40px', height: '40px' }}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginTop: '0',
                color: '#8f5774',
              }}
            >
              Payment Done!
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: '#036264',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              Thank you for completing your secure online payment.
            </p>
            <p
              style={{
                fontSize: '18px',
                color: '#036264',
                marginTop: '10px',
              }}
            >
              Have a great day!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#036264',
              textAlign: 'center',
            }}
          >
            <p>Processing your booking, please wait...</p>
            <div
              style={{
                marginTop: '20px',
                width: '50px',
                height: '50px',
                border: '5px solid #036264',
                borderTop: '5px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}
      </div>
      <FooterThree />
    </div>
  );
}