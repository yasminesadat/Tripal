import * as React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import WalletIcon from '@mui/icons-material/Wallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
const Card = styled(MuiCard)(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  width: '100%',
  '&:hover': {
    background:
      'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
    borderColor: 'primary.light',
    boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
    ...theme.applyStyles('dark', {
      background:
        'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
      borderColor: 'primary.dark',
      boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
    }),
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));


export default function PaymentForm({ onNext }) {
  const [paymentType, setPaymentType] = React.useState('creditCard');

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleNext = () => {
    if (paymentType === 'creditCard') {

    } else if (paymentType === 'wallet') {

    } else if (paymentType === 'cashOnDelivery') {

    }
    onNext(paymentType);  
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Card selected={paymentType === 'creditCard'}>
            <CardActionArea
              onClick={() => setPaymentType('creditCard')}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCardRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: 'grey.400',
                      ...theme.applyStyles('dark', {
                        color: 'grey.600',
                      }),
                    }),
                    paymentType === 'creditCard' && {
                      color: 'primary.main',
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: 'medium' }}>Credit Card (Stripe)</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card selected={paymentType === 'wallet'}>
            <CardActionArea
              onClick={() => setPaymentType('wallet')}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WalletIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: 'grey.400',
                      ...theme.applyStyles('dark', {
                        color: 'grey.600',
                      }),
                    }),
                    paymentType === 'wallet' && {
                      color: 'primary.main',
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: 'medium' }}>Wallet</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card selected={paymentType === 'cashOnDelivery'}>
            <CardActionArea
              onClick={() => setPaymentType('cashOnDelivery')}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalAtmIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: 'grey.400',
                      ...theme.applyStyles('dark', {
                        color: 'grey.600',
                      }),
                    }),
                    paymentType === 'cashOnDelivery' && {
                      color: 'primary.main',
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: 'medium' }}>Cash on Delivery</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>

      {paymentType === 'creditCard' && (
        <Alert severity="info">
          You will be redirected to stripe page.
        </Alert>
      )}

      {paymentType === 'wallet' && (
        <Alert severity="info">
          Money will be deducted from wallet.
        </Alert>
      )}

      {paymentType === 'cashOnDelivery' && (
        <Alert severity="info">You can pay cash when the order is delivered.</Alert>
      )}
      
        <Button variant="contained"
                endIcon={<ChevronRightRoundedIcon />} color="primary" 
                onClick={handleNext} sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                style={{marginLeft:"85%", marginBottom:"-13.5%"}}
         >
          Next
        </Button>
    </Stack>
  );
}
