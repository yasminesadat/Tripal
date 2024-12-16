import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { archiveProduct, unArchiveProduct } from '../../api/ProductService';
import { saveProduct } from "@/api/TouristService";
import Stars from "../common/Stars";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";
import { getUserData } from "@/api/UserService";
import { getWishList, removeWishList } from "@/api/TouristService";

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
  userId,
  refProductDetails,
  wishlist,
  setWishlist,
}) => {
  const navigate = useNavigate();
  const [newIsArchived, setNewIsArchived] = useState(isArchived);
  const [isSaved, setIsSaved] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleCardClick = () => {
    console.log("seller name: ", seller);
    navigate(`product/${id}`, {
      state: {
        id,
        productSeller,
        name,
        seller,
        price,
        description,
        quantity,
        picture,
        averageRating,
        sales,
        userRole,
        userId,
        wishlist
      },
    });
  };
  useEffect(() => {
    setIsInWishlist(wishlist.some((product) => product._id === id));
  }, [wishlist, id]);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {

        const data = await getWishList();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist", error);
      }
     
    };
    fetchWishlist();
  }, []);

  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");

  const getExchangeRate = async () => {
    if (currency) {
      try {
        const rate = await getConversionRate(currency);
        setExchangeRate(rate);
      } catch (error) {
        message.error("Failed to fetch exchange rate.");
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1); return () => clearInterval(intervalId);
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
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
      if (isInWishlist) {
        await removeWishList(id);
        message.success("Product removed from wishlist!");
        setIsSaved(false);
        setWishlist(wishlist.filter(product => product._id !== id));
      } else {
        await saveProduct(id);
        message.success("Product added to wishlist!");
        setIsSaved(true);
        setWishlist([...wishlist, { _id: id }]); 
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
      message.warning(errorMessage);
    }
  };
  

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

              <button
              className={`tourCard__favorite ${isInWishlist ? "saved" : ""}`}
              onClick={handleHeartClick}
            >
              <i className={`icon-heart ${isInWishlist ? "icon-selected" : ""}`}></i>
            </button>            

            ) : []}
          </div>
          <div className="tourCard__content px-10 pt-10">
            <h3 className="tourCardName text-16 fw-500 mt-5">
              <span
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
                ref={refProductDetails}
              >
                {name}
              </span>
            </h3>

            <div className="tourCard__location text-13 text-light-2" style={{ cursor: 'default' }}>
              {formattedDescription}
            </div>

            <div className="tourCard__rating d-flex items-center text-13 mt-5">
              <div className="d-flex x-gap-5">
                <Stars star={averageRating} />
              </div>
              <span className="text-dark-1 ml-10" style={{ cursor: 'default' }}>
                ({averageRating.toFixed(2)})
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
              <div style={{ marginLeft: "auto", textAlign: "right", cursor: 'default' }}>
                {userRole === "Tourist" ? (
                  <span className="text-16 fw-500">{currency} {(price * exchangeRate).toFixed(2)}</span>
                ) : (
                  <span className="text-16 fw-500">EGP {(price).toFixed(2)}</span>
                )
                }
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

        .tourCard__favorite {
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    padding: 10px;
    border-radius: 50%;
    transition: background-color 0.3s ease, color 0.3s ease;
    background-color: white;
  }


  .icon-heart {
    font-size: 16px; /* Adjust as needed */
    transition: color 0.3s ease;
  }

 
   
  .tourCard.-type-1 .tourCard__favorite.saved{
  color: white;
  background-color: var(--color-dark-purple);
}
       
      `}</style>
      </div>


  );

};


export default ProductCard;
