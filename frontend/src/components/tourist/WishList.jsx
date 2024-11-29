import Pagination from "../common/Pagination";
import { tourData } from "@/data/tours";
import Stars from "../common/Stars";
import { useState, useEffect } from "react";
import { getWishList } from "@/api/TouristService";

export default function WishList() {
    const [wishlist, setWishlist] = useState([]);

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

    console.log(wishlist)

    return (
        <>
        <div className="dashboard">
            <div className="dashboard__content">
                <div className="dashboard__content_content">
                    <h1 className="text-30">Wishlist</h1>

                    <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30">
                        <div className="row y-gap-30">
                            {wishlist.slice(0, 6).map((elm, i) => (
                                <div key={i} className="col-lg-6">
                                    <div className="border-1 rounded-12 px-20 py-20">
                                        <div className="row x-gap-20 y-gap-20 items-center">
                                            <div className="col-xxl-auto">
                                                <img
                                                    src={elm.picture}
                                                    alt="product"
                                                    className="size-200 w-1/1 object-cover rounded-12"
                                                />
                                            </div>

                                            <div className="col">
                                                <div className="d-flex items-center">
                                                    <i className="icon-pin mr-5"></i>
                                                    {elm.location}
                                                </div>

                                                <div className="text-18 lh-15 fw-500 mt-5">
                                                    {elm.title}
                                                </div>

                            <div className="d-flex items-center mt-5">
                                <div className="d-flex x-gap-5 text-yellow-2 mr-10">
                                <Stars star={elm.rating} />
                                </div>
                                <div>
                                {elm.rating} ({elm.ratingCount})
                                </div>
                            </div>

                            <div className="row y-gap-15 justify-between items-end pt-5">
                                <div className="col-auto">
                                <div className="d-flex items-center">
                                    <i className="icon-clock mr-5"></i>
                                    <div className="text-14">{elm.duration}</div>
                                </div>
                                </div>

                                <div className="col-auto">
                                <div className="text-right md:text-left">
                                    <div className="lh-14">${elm.price}</div>
                                    From{" "}
                                    <span className="text-20 fw-500">
                                    ${elm.price + 1000}
                                    </span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="mt-30">
                    <Pagination />

                    <div className="text-14 text-center mt-20">
                    Showing results 1-30 of 1,415
                    </div>
                </div>
                </div>

                <div className="text-center pt-30">
                © Copyright Viatours {new Date().getFullYear()}
                </div>
            </div>
            </div>
        </div>
        </>
    );
}
