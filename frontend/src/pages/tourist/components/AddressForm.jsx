import { useState, useEffect } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Button,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import { getAddresses , addAddress} from '../../../api/TouristService';  
import {message} from "antd";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { useNavigate } from "react-router-dom";

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm({ onNext }) {  
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        setDeliveryAddresses(response.addresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
    setUseNewAddress(false); 
  };

  const handleNewAddressToggle = () => {
    setUseNewAddress(!useNewAddress);
    setSelectedAddress('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = async () => {
    const { street, city, country, zipCode } = newAddress;
    if (!street || !city || !country || !zipCode) {
      message.error('Please fill in all fields');
      return;
    }

    try {
      await addAddress(street, city, country, zipCode);
      message.success("Added new address successfully!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message || "Address already exists!");
      } else {
        message.error("Failed to save new address!");
      }
    }
  };

  const handleNext = () => {
    const isAddressSelected = useNewAddress 
    ? newAddress.street && newAddress.city && newAddress.country && newAddress.zipCode
    : selectedAddress !== '';

  if (!isAddressSelected) {
    message.error("Please select an address or fill in the new address fields.");
    return;
  }
    const address = useNewAddress ? newAddress : deliveryAddresses[selectedAddress];
    onNext(address);  
  };

  return (
      <Grid spacing={3} item xs={12}>
        <FormGrid>
          <FormLabel htmlFor="address-selection">Select Address</FormLabel>
          <FormControl fullWidth sx={{ 
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#ccc' }, 
            '&:hover fieldset': { borderColor: '#b77c94' }, 
            '&.Mui-focused fieldset': { borderColor: '#b77c94' }, 
          } 
        }}>
          <Select
            id="address-selection"
            value={selectedAddress}
            onChange={handleAddressChange}
            displayEmpty
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc', 
                },
                '&:hover fieldset': {
                  borderColor: '#b77c94', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b77c94', 
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select an existing address
            </MenuItem>
            {deliveryAddresses.map((address, index) => (
              <MenuItem key={index} value={index}>
                {`${address.street}, ${address.city}, ${address.country}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        </FormGrid>
        <br/>

      <Grid item xs={12}>
        <FormControlLabel
          control={ <Checkbox
            checked={useNewAddress}
            onChange={handleNewAddressToggle}
            
          />}
          label="Use a new address"
        />
      </Grid>

      {useNewAddress && (
        <>
          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="street" required>
                Street
              </FormLabel>
              <OutlinedInput
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                required
                size="small"
              />
            </FormGrid>
          </Grid>
          <br/>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="city" required>
                City
              </FormLabel>
              <OutlinedInput
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
                size="small"
              />
            </FormGrid>
          </Grid>
          <br/>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="country" required>
                Country
              </FormLabel>
              <OutlinedInput
                id="country"
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
                required
                size="small"
              />
            </FormGrid>
          </Grid>
          <br/>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="zipCode" required>
                Zip Code
              </FormLabel>
              <OutlinedInput
                id="zipCode"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleInputChange}
                required
                size="small"
              />
            </FormGrid>
          </Grid>
          <br/>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={saveNewAddress}>
              Save New Address
            </Button>
          </Grid>
        </>
      )}
      <br/>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={() => navigate("/cart")}           
            variant="text"
            sx={{
              display: { xs: 'none', sm: 'flex' }, 
              position: 'relative',
              top: '-10%', 
            }}
          >
            Back to cart
          </Button>

          <Button
            variant="contained"
            endIcon={<ChevronRightRoundedIcon />}
            color="primary"
            onClick={handleNext}
            sx={{
              width: { xs: '100%', sm: 'fit-content' }, 
            }}
          >
            Next
          </Button>
        </Box>

    </Grid>
  );
}
