import React from "react";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Card, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import "./product.css";
import { currUser } from "../../IDs";

const { Meta } = Card;

const ProductCard = ({
  id,
  productSeller,
  name,
  seller,
  price,
  description,
  quantity,
  picture,
  ratings,
  averageRating,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`product/${id}`, {
      state: {
        name,
        seller,
        price,
        description,
        quantity,
        picture,
        ratings,
        averageRating,
      },
    });
  };

  const handleEditClick = (e) => {
    navigate(`/seller/edit-product/${id}`, {
      state: {
        initialName: name,
        initialPrice: price,
        initialDescription: description,
        initialQuantity: quantity,
        initialPicture: picture,
      },
    });
  };

  const descriptionLength = description.length;
  const formattedDescription = (
    <div style={{ flexDirection: "column" }}>
      {description}
      {descriptionLength <= 30 && <div style={{ height: "20px" }} />}
    </div>
  );

  return (
    <Card
      className="product-card"
      cover={
        <div className="product-card-image-container">
          <img
            alt={name}
            src={picture}
            onClick={handleCardClick}
            className="product-card-image"
          />
        </div>
      }
      actions={
        currUser === productSeller
          ? [
              <EditOutlined key="edit" onClick={handleEditClick} />,
              <EllipsisOutlined key="ellipsis" onClick={handleCardClick} />,
            ]
          : [<EllipsisOutlined key="ellipsis" onClick={handleCardClick} />]
      }
    >
      <Meta
        title={`${name} - $${price}`}
        description={formattedDescription}
        onClick={handleCardClick}
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Rate value={averageRating} disabled allowHalf />
        <span style={{ marginLeft: "5%", marginBottom: "5%", color: "gray" }}>
          ({averageRating})
        </span>
      </div>
    </Card>
  );
};

export default ProductCard;
