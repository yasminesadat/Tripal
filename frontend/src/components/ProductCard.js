import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const ProductCard = ({ name, sellerID, price, description, quantity, picture, rating }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${name}`, { state: { name, sellerID, price, description, quantity, picture, rating } });
  };

  return (
    <Card
      onClick={handleCardClick}
      style={{
        width: 300,
        padding: '10px',
        border: '1px solid #f0f0f0',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer', 
      }}
      cover={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            overflow: 'hidden',
            marginBottom: '-20px',
          }}
        >
          <img
            alt={name}
            src={picture}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta title={`${name} - $${price}`} description={description} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Rate value={rating} disabled allowHalf />
      </div>
    </Card>
  );
};

export default ProductCard;
