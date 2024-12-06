import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import AppTheme from './shared-theme/AppTheme';
import Info from './components/Info';
import { useLocation } from 'react-router-dom';
import Header from '../../components/layout/header/TouristHeader';
import Footer from '../../components/layout/footers/FooterThree';
import { createOrder } from '@/api/OrderService';
import { loadStripe } from "@stripe/stripe-js";
import { message } from 'antd';

const steps = ['Shipping address', 'Payment details'];

export default function Checkout(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [address, setAddress] = React.useState(null);
  const [paymentType, setPaymentType] = React.useState(null);
  const location = useLocation();
  const cart = location.state?.cart || [];
  const stripePromise = loadStripe("pk_test_51QOIg6DNDAJW9Du6kXAE0ci4BML4w4VbJFTY5J0402tynDZvBzG85bvKhY4C43TbOTzwoGiOTYeyC59d5PVhAhYy00OgGKWbLb");

  const handleNextAddress = (newAddress) => {
    setAddress(newAddress);
    setActiveStep(activeStep + 1);
  };

  const processCreditCardPayment = async (orderData) => {
    try {
      const stripe = await stripePromise; // Initialize stripe here
      console.log("Redirecting to Stripe...");
      
      const response = await createOrder(orderData);
      const sessionId = response?.sessionId; // Safely access sessionId
  
      if (sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe redirection error:", error);
          message.error("Failed to redirect to payment. Please try again.");
        }
      } else {
        console.error("Session ID not received.");
        message.error("Failed to initiate payment session.");
      }
    } catch (error) {
      console.error("Error processing credit card payment:", error.message);
      message.error("Payment processing failed. Please try again.");
    }
  };
  

  
  
  const processWalletPayment = async (orderData) => {
    console.log("Deducting from wallet...");
    const response = await createOrder(orderData);
    message.success ("Payment with wallet successfull!")
    setActiveStep(activeStep + 1);
  };
  
  const processCashOnDelivery = async (orderData) => {
    console.log("Proceeding with cash on delivery...");
    const response = await createOrder(orderData);
    message.success ("COD successfull!")
    setActiveStep(activeStep + 1);
  };
  
  const handleNextPayment = async (newPaymentType) => {
    setPaymentType(newPaymentType);
    const orderData = { deliveryAddress: address, paymentMethod: newPaymentType };
  
    try {
      if (newPaymentType === "Credit Card") {
        await processCreditCardPayment(orderData);
      } else if (newPaymentType === "Wallet") {
        await processWalletPayment(orderData);
      } else if (newPaymentType === "Cash On Delivery") {
        await processCashOnDelivery(orderData);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    console.error("Full Error Object:", error.response || error.message);
    message.error("Failed to create the order. Please try again.");
    }
  };
  

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm onNext={handleNextAddress} />;
      case 1:
        return <PaymentForm onNext={handleNextPayment} />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <div className="page-wrapper">
      <AppTheme {...props}>
        {/* <CssBaseline enableColorScheme /> */}
        <Header />
        <main className="page-content-hana">
          <Grid
            container
            sx={{
              height: 'auto',
              mt: {
                xs: 4,
                sm: 0,
              },
              marginBottom: '8%'
            }}
          >
            <Grid
              item
              xs={12}
              sm={5}
              lg={4}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                backgroundColor: '#8f5774',
                borderRight: { sm: 'none', md: '1px solid' },
                borderColor: { sm: 'none', md: 'divider' },
                alignItems: 'start',
                pt: 16,
                px: 10,
                gap: 4,
                width: '300px',
                position: 'relative',
                marginTop: '1.3%',
                height: 'auto',
                marginBottom: '-8%'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: 'none',
                  height: 'auto',
                }}
              >
                <Info totalPrice={'0'} cart={cart} />
              </Box>
            </Grid>

            <Grid
              item
              sm={12}
              md={7}
              lg={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                width: '100%',
                backgroundColor: { xs: 'transparent', },
                alignItems: 'start',
                pt: { xs: 0, sm: 16 },
                px: { xs: 2, sm: 10 },
                gap: { xs: 4, md: 8 },
                marginTop: '3%',
                marginLeft: '0%',
                flexGrow: 1,
                height: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { sm: 'space-between', md: 'flex-end' },
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: { sm: '100%', md: 600 },
                  height: 'auto', // Adjust height dynamically
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexGrow: 1,
                    height: 'auto', // Ensure height adjusts to content
                  }}
                >
                  <Stepper id="desktop-stepper" activeStep={activeStep} sx={{ width: '100%', height: 40 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: { sm: '100%', md: 600 },
                  gap: { xs: 5, md: 'none' },
                  height: 'auto', // Let the content adjust its height as needed
                }}
              >
                {activeStep === steps.length ? (
                  <Stack spacing={2} useFlexGap>
                    <Typography variant="h1">📦</Typography>
                    <Typography variant="h5">Thank you for your order!</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Your order number is <strong>&nbsp;#140396</strong>. We have emailed your order confirmation and will update you once it's shipped.
                    </Typography>
                    <Button variant="contained" sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}>
                      Go to my orders
                    </Button>
                  </Stack>
                ) : (
                  <React.Fragment>
                    {getStepContent(activeStep)}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        alignItems: 'end',
                        flexGrow: 1,
                        gap: 1,
                        pb: { xs: 12, sm: 0 },
                        mt: { xs: 2, sm: 0 },
                        mb: '60px',
                        justifyContent: 'space-between',
                      }}
                    >
                      {activeStep !== 0 && (
                        <Button
                          startIcon={<ChevronLeftRoundedIcon />}
                          onClick={handleBack}
                          variant="text"
                          sx={{
                            display: { xs: 'none', sm: 'flex' },
                            position: 'relative',
                            top: '-210%',
                          }}
                        >
                          Previous
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </Grid>
          </Grid>
          <Footer />
        </main>
      </AppTheme>
    </div>
  );

}
