import React, { useState } from "react";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Card, Rate, message } from "antd"; 
import { useNavigate } from "react-router-dom";
import "./product.css";
import { currUser, userRole } from "../../IDs";
import { archiveProduct, unArchiveProduct } from '../../api/ProductService';

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
  averageRating,
  isArchived,
  sales,
}) => {
  const navigate = useNavigate();
  const [newIsArchived, setNewIsArchived] = useState(isArchived);

  const handleCardClick = () => {
    navigate(`product/${id}`, {
      state: {
        id,
        name,
        seller,
        price,
        description,
        quantity,
        picture,
        averageRating,
        sales,
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

  const handleArchiveClick = async (e) => {
    e.stopPropagation();
      if (newIsArchived) {
        try{
          await unArchiveProduct(id);
          message.success("Product unarchived successfully");
          }
        catch(error){
          console.error("Error unarchiving product:", error);
        }
      } 
      else {
        try{
          await archiveProduct(id);
          message.success("Product archived successfully");
        }
      catch (error) {
      console.error("Error archiving product:", error);
    }
  }
  setNewIsArchived(!newIsArchived); 
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
      onClick={userRole === "Tourist" ? handleCardClick : null} 
      actions={
        currUser === productSeller
          ? [
              <EditOutlined key="edit" onClick={handleEditClick} />,
              <span
                key="archive"
                onClick={handleArchiveClick}
                style={{ cursor: "pointer" }}
                className="archive-text"
              >
                {newIsArchived ? "Unarchive" : "Archive"}
              </span>,
            ]
          : (userRole === "Admin") ? [
              <span
                key="archive"
                onClick={handleArchiveClick}
                style={{ cursor: "pointer" }}
                className="archive-text"
              >
                {newIsArchived ? "Unarchive" : "Archive"}
              </span>,
            ]
          : []
      }
      
    >
      <Meta
        title={`${name} - ${price}`}
        description={formattedDescription}
        onClick={handleCardClick}
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Rate value={averageRating} disabled allowHalf />
        <span style={{ marginLeft: "5%", marginBottom: "5%", color: "gray" }}>
          ({averageRating.toFixed(2)})
        </span>
      </div>
    </Card>
  );
};

export default ProductCard;
