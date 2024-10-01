import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Rate, Modal } from 'antd';

const { Meta } = Card;

const ProductCard = ({ name, sellerID, price, description, quantity, picture, rating }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Card
        style={{width: 300,padding: '10px',border: '1px solid #f0f0f0',borderRadius: '5px',boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',}}
        cover={
          <div
            style={{display: 'flex',justifyContent: 'center',alignItems: 'center',height: '200px',overflow: 'hidden',marginBottom: '-20px'}}>
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
          <EllipsisOutlined key="ellipsis" onClick={showModal} />,
        ]}
      >
        <Meta
          title={`${name} - $${price}`}
          description={description}
        />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Rate value={rating} disabled allowHalf />
        </div>
      </Card>

      <Modal 
        title="Product Details" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={null}
      >
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Seller ID:</strong> {sellerID}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Rating:</strong> <Rate value={rating} disabled allowHalf /></p>
      </Modal>
    </>
  );
};

export default ProductCard;
