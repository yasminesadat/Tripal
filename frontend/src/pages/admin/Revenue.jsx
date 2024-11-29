import { useState, useEffect } from "react";
import { message } from "antd";
import { getAllActivities } from "@/api/ActivityService";
import { getAllItineraries } from "@/api/ItineraryService";
import {fetchProducts} from "@/api/ProductService";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import Spinner from "@/components/common/Spinner";

const Revenue = () => {
    const tabs = ["Itineraries", "Activities", "Products"];
    const [sideBarOpen, setSideBarOpen] = useState(true);
    const [currentTab, setCurrentTab] = useState("Itineraries");
    const [loading, setLoading] = useState(true);
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const activityResponse = await getAllActivities();
                console.log("activities "+activityResponse.data)
                setActivities(activityResponse.data);
                //haddd ye fix el 404 daaaaaaaaaaaaaaaa
                const itineraryResponse = await getAllItineraries();
                console.log("itineraries"+itineraryResponse);
                setItineraries(itineraryResponse);
                const productResponse = await fetchProducts();
                setProducts(productResponse.products);
            } catch (error) {
                message.error("Error fetching data.");
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    const renderTable = () => {
        if (currentTab === "Itineraries") {
            return (
                <table className="tableTest mb-30">
                    <thead className="bg-light-1 rounded-12">
                        <tr>
                            <th>Itinerary ID</th>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>Bookings</th>
                            <th>Price</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itineraries.map((itinerary) => (
                            <tr key={itinerary.id}>
                                <td>#{itinerary._id.slice(-3)}</td>
                                <td>{itinerary.title}</td>
                                <td>{new Date(itinerary.startDate).toLocaleDateString()}</td>
                                <td style={{ paddingLeft: '50px' }}>{itinerary.bookings.length}</td>
                                <td>EGP {itinerary.price}</td>
                                <td>EGP {(itinerary.bookings.length*itinerary.price*0.1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (currentTab === "Activities") {
            return (
                <table className="tableTest mb-30">
                    <thead className="bg-light-1 rounded-12">
                        <tr>
                            <th>Activity ID</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Bookings</th>
                            <th>Price</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <tr key={activity.id}>
                                <td>#{activity._id.slice(-3)}</td>
                                <td>{activity.title}</td>
                                <td>{new Date(activity.date).toLocaleDateString()}</td>
                                <td style={{ paddingLeft: '50px' }}>{activity.bookings.length}</td>
                                <td>EGP {activity.price}</td>
                                <td>EGP {(activity.bookings.length*activity.price*0.1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (currentTab === "Products") {
            return (
                <table className="tableTest mb-30">
                    <thead className="bg-light-1 rounded-12">
                        <tr>
                            <th>Product ID</th>
                            <th>Title</th>
                            <th>Units</th>
                            <th>Price</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>#{product._id.slice(-3)}</td>
                                <td>{product.name}</td>
                                <td>{product.sales}</td>
                                <td>EGP {product.price}</td>
                                <td>EGP {product.sales*product.price*0.1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <>
            <div className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}>
                <Sidebar setSideBarOpen={setSideBarOpen} />
                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                    <div className="revenue">
                        <div className="dashboard__content_content">
                            <h1 className="text-30">Revenue Management</h1>
                            <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60">
                                <div className="tabs -underline-2 js-tabs">
                                    <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
                                        {tabs.map((tab, i) => (
                                            <div key={i} className="col-auto" onClick={() => setCurrentTab(tab)}>
                                                <button
                                                    className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${tab === currentTab ? "is-tab-el-active" : ""}`}
                                                >
                                                    {tab}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tabs__content js-tabs-content">
                                        <div className="tabs__pane -tab-item-1 is-tab-el-active">
                                            <div className="overflowAuto">
                                                {renderTable()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-button {
                    background-color: var(--color-dark-purple) !important;
                    border: 2px solid var(--color-dark-purple) !important;
                    color: #fff !important;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
                }

                .custom-button:hover,
                .custom-button:focus {
                    background-color: var(--color-light-purple) !important;
                    border-color: var(--color-light-purple) !important;
                    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
                }

                .custom-button-green {
                    background-color: var(--color-stone) !important;
                    border: 2px solid var(--color-stone) !important;
                    color: #fff !important;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
                }

                .custom-button-green:hover,
                .custom-button-green:focus {
                    background-color: var(--color-stone-light) !important;
                    border-color: var(--color-stone-light) !important;
                }
            `}</style>
        </>
    );
}

export default Revenue;
