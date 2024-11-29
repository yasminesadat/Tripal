import Stars from "../common/Stars";
import { useState, useEffect } from "react";
import { getWishList } from "@/api/TouristService";
import Pagination from "@/components/activity/Pagination";

export default function WishList() {
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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
    const currentProducts = wishlist.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    
    const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
    };
    
    return (
        <>
        <div className="dashboard js-dashboard">
            <div className="dashboard__content">
                <div className="dashboard__content_content">
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

                                            <div className="col">
                                                <div className="text-18 lh-15 fw-500 mt-5">
                                                    {elm.name}
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
                                                            <div className="text-14">{truncateText(elm.description, 50)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <div className="text-right md:text-left">
                                                            <span className="text-20 fw-500">{elm.price}</span>
                                                        </div>
                                                    </div>
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

                <div className="text-center pt-30">
                    © Copyright Tripal {new Date().getFullYear()}
                </div>
            </div>
        </div>
        </>
    );
}
