import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function Info({ cart }) {
  const totalPrice = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <React.Fragment>
      <Typography variant="h4" sx={{ color: '#ffffff' }}>
        Total
      </Typography>
      <Typography variant="h4" sx={{ color: '#ffffff' }} gutterBottom>
        ${totalPrice}
      </Typography>

      <List disablePadding>
        {cart.map((item) => (
              <ListItem key={item.product._id} sx={{ py: 2, px: 0, display: 'flex', alignItems: 'center' }}>
              <img
                src={item.product.picture}
                alt=""
                style={{ width: "70px", height: "70px", marginRight: '16px' }} 
              />
              <ListItemText
                sx={{ mr: 2 }}
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1" sx={{ fontWeight: 'medium',color:"#ffffff" }}>
                ${item.price.toFixed(2)}
              </Typography>
            </ListItem>
        ))}
      </List>
      <br/><br/>
    </React.Fragment>
  );
}

Info.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        picture: PropTypes.string.isRequired,
      }).isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Info;
