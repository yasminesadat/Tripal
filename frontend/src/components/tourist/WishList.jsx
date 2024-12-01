import Stars from "../common/Stars";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWishList } from "@/api/TouristService";
import Pagination from "@/components/activity/Pagination";
import { removeWishList } from "@/api/TouristService";
import { message } from "antd";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";

export default function WishList() {
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(1);
    const productsPerPage = 4;

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = wishlist.slice(indexOfFirstProduct, indexOfLastProduct);
    
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    };

    const [currency, setCurrency] = useState( "EGP");

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
    }, 1);  return () => clearInterval(intervalId);
  }, [currency]);

    const navigate = useNavigate();
    const handleCardClick = (id, name, seller, price, description, quantity, picture, averageRating, sales, userRole) => {
        navigate(`/tourist/view-products/product/${id}`, {
            state: { id, name, seller, price, description, quantity, picture, averageRating, sales, userRole }
        });
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeWishList(productId);
            const updatedWishlist = await getWishList();
            setWishlist(updatedWishlist);
            message.success("item removed from the wishlist successfully")
        } catch (error) {
            message.error("item removal failed")
        }
    };
    const formatPrice = (price) => {
        return `${currency} ${(price * exchangeRate).toFixed(2)}`;
      }
      

    return (
        <>
        <div className="dashboard js-dashboard">
            <div className="dashboard__content">
                <div className="dashboard__content_content">
                    <br></br>
                    <br></br>
                    <br></br>
                    <h1 className="text-30">Wishlist</h1>

                    <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30">
                        <div className="row y-gap-30">
                            {currentProducts?.map((elm, i) => (
                                <div key={i} className="col-lg-6">
                                    <div className="border-1 rounded-12 px-20 py-20">
                                        <div className="row x-gap-20 y-gap-20 items-center">
                                            <div className="col-xxl-auto">
                                                <img
                                                    src={elm.picture}
                                                    alt="product"
                                                    className="size-200 object-cover rounded-12"
                                                />
                                            </div>

                                            <div className="col" >
                                                <div className="text-18 lh-15 fw-500 mt-5 tourCardName" onClick={() => handleCardClick(elm._id, elm.name, elm.seller,formatPrice(elm.price), elm.description, elm.quantity, elm.picture, elm.averageRating, elm.sales, elm.userRole)}>
                                                    <span>{elm.name}</span>
                                                </div>

                                                <div className="d-flex items-center mt-5">
                                                    <div className="d-flex x-gap-5 text-yellow-2 mr-10">
                                                        <Stars star={elm.rating} />
                                                    </div>
                                                    <div>{elm.averageRating} ({elm.totalRatings})</div>
                                                </div>

                                                <div className="row y-gap-15 justify-between items-end pt-5">
                                                    <div className="col-auto">
                                                        <div className="d-flex items-center">
                                                            <div className="text-14">{truncateText(elm.description, 100)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <div className="text-right md:text-left">
                                                            <span className="text-20 fw-500"> {formatPrice(elm.price)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="delete-btn-container">
                                                    <button className="button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30" onClick={() => handleRemoveFromWishlist(elm._id)}>
                                                        <i className="icon-delete text-20"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-30">
                        {wishlist?.length > productsPerPage && (
                            <Pagination
                                totalItems={wishlist.length}
                                itemsPerPage={productsPerPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        )}
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
         cursor: pointer;
        }

        .delete-btn-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        `}</style>
        </>
    );
}
