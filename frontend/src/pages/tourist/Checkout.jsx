import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import Review from './components/Review';
import AppTheme from './shared-theme/AppTheme';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

export default function Checkout(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [address, setAddress] = React.useState(null);
  const [paymentType, setPaymentType] = React.useState(null);

  const handleNextAddress = (newAddress) => {
    setAddress(newAddress);  
    setActiveStep(activeStep + 1); 
  };

  const handleNextPayment = (newPaymentType) => {
    setPaymentType(newPaymentType);  
    if (newPaymentType === 'creditCard') {
      console.log("Redirecting to Stripe...");
    } else if (newPaymentType === 'wallet') {
      console.log("Deducting from wallet...");
    } else if (newPaymentType === 'cashOnDelivery') {
      console.log("Proceeding with cash on delivery...");
    }

    setActiveStep(activeStep + 1);  
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
      case 2:
        return <Review />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <div style={{ marginLeft: "20%", marginTop: "-8%" }}>
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            marginTop:"5%",
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: '100%', height: 40 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Your order number is <strong>&nbsp;#140396</strong>. We have emailed your order confirmation and will update you once its shipped.
                </Typography>
                <Button variant="contained" sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}>
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)} 
                <Box
                  sx={[
                    {
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      alignItems: 'end',
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: '60px',
                    },
                    activeStep !== 0
                      ? { justifyContent: 'space-between' }
                      : { justifyContent: 'flex-end' },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && activeStep !== 1 && (
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </div>
    </AppTheme>
  );
}
