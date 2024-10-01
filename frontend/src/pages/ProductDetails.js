import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom'; 
import { Rate, Layout, Breadcrumb, Button, Space, Divider } from 'antd'; 
import { InputNumber } from 'antd';

const onChange = (value) => {
  console.log('changed', value);
};

const { Content } = Layout;

const ProductDetails = () => {
  const { productName } = useParams(); 
  const location = useLocation();
  const { name, sellerID, price, description, quantity, picture, rating } = location.state || {};

  return (
    <div className='productDetails'>
      <div style={{ display: 'flex', margin: '5%' }}>
        <div className='imagePlaceholder' style={{ flex: '0 0 25%', marginLeft: '20%' }}>
          {picture && (
            <div style={{border: '2px solid #ccc', padding: '2%', borderRadius: '1%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',}}>
              <img 
                src={picture} 
                alt={name} 
                style={{ maxWidth: '100%', maxHeight: '70%', borderRadius: '5%', boxSizing: 'border-box' }} 
              />
            </div>
          )}
        </div>
        <div className='contentPlaceholder' style={{ flex: '1', marginLeft: '3%' }}>
          <Content style={{ padding: '0 5%' }}>
            <Breadcrumb style={{ margin: '1.5%' }}>
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/view-products">Products</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{productName || name}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ minHeight: 280 }}>
              <h1>{productName || name}</h1>
              <p><strong>Price:</strong> ${price}</p>
              <p><strong>Seller ID:</strong> {sellerID}</p>
              <p><strong>Description:</strong> {description}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Rating:</strong> <Rate value={rating} disabled allowHalf /></p>
            </div>
            <Space style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <InputNumber
                defaultValue={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                onChange={onChange}
                style={{ textAlign: 'center', width: '100px' }} 
              />
              <Button type="primary" style={{ marginLeft: '10px' }}>Add to Cart</Button>
            </Space>
          </Content>
        </div>
      </div>
      <Divider orientation="left" style={{ padding: '0 10% 0 10%' }}>Reviews</Divider>
      <div className='reviewsSection'></div>
    </div>
  );
};

export default ProductDetails;
