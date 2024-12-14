import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { completeOrder as completeOrderService } from '@/api/OrderService'; // Assuming this service handles order completion
import MetaComponent from '@/components/common/MetaComponent';
import TouristHeader from '@/components/layout/header/TouristHeader';
import FooterThree from '@/components/layout/footers/FooterThree';

const extractOrderParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    sessionId: searchParams.get('session_id'),
    touristId: searchParams.get('touristId'),
    totalPrice: parseFloat(searchParams.get('totalPrice')),
    deliveryAddress: JSON.parse(decodeURIComponent(searchParams.get('deliveryAddress')))
  };
};

const handleOrderCompletion = async ({ sessionId, touristId, totalPrice, deliveryAddress }) => {
  if (sessionId && touristId && totalPrice && deliveryAddress) {
    try {
      await completeOrderService({ sessionId, touristId, totalPrice, deliveryAddress });
      return true;
    } catch (error) {
      message.error('Failed to complete order. Please try again.');
      return false;
    }
  } else {
    message.error('Missing required order information.');
    return false;
  }
};

export default function OrderCheckout() {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const hasCompletedOrder = useRef(false);

  useEffect(() => {
    if (hasCompletedOrder.current) return;
    hasCompletedOrder.current = true;

    const completeOrderAsync = async () => {
      const orderParams = extractOrderParams();
      const completionStatus = await handleOrderCompletion(orderParams);
      setOrderCompleted(completionStatus);
    };

    completeOrderAsync();
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
        {orderCompleted ? (
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
            <p>Processing your order, please wait...</p>
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
