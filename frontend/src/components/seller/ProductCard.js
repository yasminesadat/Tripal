import React from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import "../../pages/product/product.css";

const { Meta } = Card;

const ProductCard = ({
  id,
  name,
  seller,
  price,
  description,
  quantity,
  picture,
  rating,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`, {
      state: { name, seller, price, description, quantity, picture, rating },
    });
  };

  const handleEditClick = () => {
    navigate(`/edit-product/${id}`, {
      state: { price, description },
    });
  };

  return (
    <Card
      className="product-card"
      cover={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            overflow: "hidden",
            marginBottom: "-20px",
          }}
        >
          <img
            alt={name}
            src={picture}
            onClick={handleCardClick}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" onClick={handleEditClick} />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        title={`${name} - $${price}`}
        description={description}
        onClick={handleCardClick}
      />
      <div
        style={{ marginTop: "20px", textAlign: "center" }}
        onClick={handleCardClick}
      >
        <Rate value={rating} disabled allowHalf />
      </div>
    </Card>
  );
};

export default ProductCard;
