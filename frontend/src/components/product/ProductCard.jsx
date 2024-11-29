import React, { useState } from "react";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { message } from "antd"; 
import { useNavigate } from "react-router-dom";
import { archiveProduct, unArchiveProduct } from '../../api/ProductService';
import { saveProduct } from "@/api/TouristService";
import Stars from "../common/Stars";

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
  userRole,
  userId
}) => {
  const navigate = useNavigate();
  const [newIsArchived, setNewIsArchived] = useState(isArchived);
  const [isSaved, setIsSaved] = useState(false);

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
        userRole
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
        userId: userId,
      },
    });
  };

  const handleArchiveClick = async (e) => {
    e.stopPropagation();
    if (newIsArchived) {
      try {
        await unArchiveProduct(id);
        message.success("Product unarchived successfully");
      } catch (error) {
        console.error("Error unarchiving product:", error);
      }
    } else {
      try {
        await archiveProduct(id);
        message.success("Product archived successfully");
      } catch (error) {
        console.error("Error archiving product:", error);
      }
    }
    setNewIsArchived(!newIsArchived); 
  };

  const formattedDescription = (
    <div
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 3, 
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minHeight: "4.5em",
        lineHeight: "1.5em", 
      }}
    >
      {description}
    </div>
  );

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await saveProduct(id);
      message.success("Product added to wishlist!");
      setIsSaved(true); 
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("Failed to add product to wishlist");
    }
  };

  console.log()

  return (
    <div className="col-lg-3 col-sm-6">
      <div className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow">
        <div className="tourCard__header">
          <div className="tourCard__image ratio ratio-28:20">
            <img
              src={picture}
              alt={name}
              className="img-ratio rounded-12"
            />
          </div>
          {userId === productSeller ? (
            <EditOutlined className="tourCard__favorite" key="edit" onClick={handleEditClick} />
          ) : userRole === "Tourist" ? (
            <button className="tourCard__favorite" onClick={handleHeartClick}>
              <i 
                className={!isSaved ? "icon-heart" : ""}
              />
              <i>{ isSaved && "❤" }</i>
            </button>
          ) : [] }
        </div>
        <div className="tourCard__content px-10 pt-10">
          <h3
            className="tourCardName text-16 fw-500 mt-5"
          >            
            <span 
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}>{name}</span>
          </h3>

          <div className="tourCard__location text-13 text-light-2" style={{ cursor: 'default' }}>
            {formattedDescription}
          </div>

          <div className="tourCard__rating d-flex items-center text-13 mt-5">
            <div className="d-flex x-gap-5">
              <Stars star={averageRating} />
            </div>
            <span className="text-dark-1 ml-10" style={{ cursor: 'default' }}>
              ({averageRating})
            </span>
          </div>

          <div
            className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            {userId === productSeller
              ? [
                  <span
                    key="archive"
                    onClick={handleArchiveClick}
                    style={{ cursor: "pointer" }}
                    className="archive-text"
                  >
                    {newIsArchived ? "Unarchive" : "Archive"}
                  </span>,
                ]
              : [userRole === "Admin" && (
                  <span
                    onClick={handleArchiveClick}
                    style={{
                      cursor: "pointer",
                      marginRight: "auto", 
                    }}
                    className="archive-text"
                  >
                    {newIsArchived ? "Unarchive" : "Archive"}
                  </span>
                )]
            }
            <div style={{ marginLeft: "auto", textAlign: "right",cursor: 'default' }}>
              <span className="text-16 fw-500">${price}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tourCardName span {
          background-repeat: no-repeat;
          background-image: linear-gradient(to right, black 0%, black 100%);
          background-position: 0px 95%;
          background-size: 0px 1px;
          transition: background-size 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0s;
          padding: 0.1% 0px;
          }

        .tourCardName span:hover {
         background-size: 100% 1px;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
