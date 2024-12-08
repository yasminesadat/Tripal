import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import { getUserData } from "@/api/UserService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { message, Tour } from "antd";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";
import { getAllHistoricalPlacesByTourismGoverner, deleteHistoricalPlace, getAllHistoricalPlaces } from '../../api/HistoricalPlaceService';
import Spinner from "../../components/common/Spinner";
import Pagination from "@/components/activity/Pagination";

export default function HistoricalPlacesList({ searchTerm }) {
  const [ddActives, setDdActives] = useState(false);
  const dropDownContainer = useRef();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("EGP");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [searchKey, setSearchKey] = useState(searchTerm);
  const errorDisplayed = useRef(false);
  const location = useLocation();
  const refHPDetails = useRef(null);
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchedPlaces, setSearchedPlaces] = useState([]);
  const [viewedPlaces, setViewedPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [filterHistoricType, setFilterHistoricType] = useState([]);
  const [filterHistoricalTagPeriod, setFilterHistoricalTagPeriod] = useState([]);
  const placesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = viewedPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  const steps = [
    {
      title: "Read More",
      description: "Learn more about the place.",
      target: () => refHPDetails.current,
      onFinish: () => {
        setOpen(false);
        localStorage.setItem('currentStep', 6);
        navigate('/tourist', { state: { fromTour: true, targetStep: 6 } });
      }
    },
  ]

  const [exchangeRate, setExchangeRate] = useState(1);
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

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1); return () => clearInterval(intervalId);
  }, [currency]);


  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    const timer = setTimeout(() => {
      if (isFromTour) {
        setOpen(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const getHistoricalPlacesByGoverner = async () => {
      setLoading(true);
      try {
        const result = await getAllHistoricalPlacesByTourismGoverner();
        if (result) {
          console.log("result: ", result);
          setPlaces(result);
          setSearchedPlaces(result);
          setViewedPlaces(result)
          setFilteredPlaces(result);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        //toast.error('Error while fetching')
      }
    }
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await getAllHistoricalPlaces();
        setPlaces(response);
        setSearchedPlaces(response);
        setViewedPlaces(response);
        setFilteredPlaces(response);
      } catch (err) {
        setLoading(false);
        setError(
          err.response?.data?.error || "Error fetching historical places"
        );
      } finally {
        setLoading(false);
      }
    };
    if (userRole !== null) {
      if (userRole === "Guest" || userRole === "Admin" || userRole === "Tourist") {
        fetchPlaces();
      }
      if (userRole === "Tourism Governor") {
        getHistoricalPlacesByGoverner();
      }
    }


  }, [userRole])
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
        } else if (response.data.message === "No token found.") {
          setUserRole("Guest");
        } else {
          if (!errorDisplayed.current) {
            message.error(response.data.message);
            errorDisplayed.current = true;
          }
        }
      } catch (error) {
        if (!errorDisplayed.current) {
          message.error("Failed to fetch user data.");
          errorDisplayed.current = true;
        }
      }
    };

    fetchUserData();
  }, []);
  const handleDelete = async (id) => {
    try {
      const response = await deleteHistoricalPlace(id);
      if (response) {
        setPlaces(places.filter(place => place._id !== id));
        setFilteredPlaces(filteredPlaces.filter(place => place._id !== id));
        setViewedPlaces(viewedPlaces.filter(place => place._id !== id));
        setSearchedPlaces(searchedPlaces.filter(place => place._id !== id));
        message.success("Deleted Successfully");
      }
    }
    catch (e) {
      message.error("Failed to delete");
    }
  }

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((error) => {
        message.error("Failed to copy link");
      });
  };

  const handleShare = (link) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this historical place!",
          url: link,
        })
        .catch((error) => {
          message.error("Failed to share");
        });
    } else {
      window.location.href = `mailto:?subject=Check out this historical place!&body=Check out this link: ${link}`;
    }
  };
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };
  const getMinPrice = (Place) => {

    const minValue = Math.min(Place.ticketPrices.foreigner, Place.ticketPrices.native, Place.ticketPrices.student);
    return minValue;

  }

  useEffect(() => {
    const curr = sessionStorage.getItem("currency");
    if (curr) {
      setCurrency(curr);
    }
  }, []);
  useEffect(() => {
    const handleSearch = () => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = places.filter((place) => {
        const matchesName = place.name
          .toLowerCase()
          .includes(lowerCaseSearchTerm);
        const matchesTags =
          place.tags &&
          place.tags.some(
            (tag) =>
              tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
          );
        const matchesPeriods = place.historicalPeriod &&
          place.historicalPeriod.some(
            (tag) =>
              tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
          );

        return matchesName || matchesTags || matchesPeriods;
      });
      setSearchedPlaces(results);

    };
    handleSearch();
  }, [searchTerm, places]);
  useEffect(() => {
    const handleFilter = () => {
      const historicType = filterHistoricType;
      const historicalTagPeriod = filterHistoricalTagPeriod;
      console.log("tags", filterHistoricType)
      console.log("periods", filterHistoricalTagPeriod)
      if (historicType.length == 0 && historicalTagPeriod.length == 0) {
        setFilteredPlaces(places);
        return;
      }
      const filteredType = places.filter((place) => {
        const matchesHistoricType = historicType.length > 0
          ? place.tags?.some(tag =>
            historicType.some(historicTag =>
              tag.name?.toLowerCase() === historicTag.name.toLowerCase()
            )
          )
          : true;
        return matchesHistoricType;
      });
      const filteredPeriod = places.filter((place) => {
        const matchesHistoricalTag = historicalTagPeriod.length > 0
          ? place.historicalPeriod?.some(tag =>
            historicalTagPeriod.some(historicPeriod =>
              tag.name?.toLowerCase() === historicPeriod.name.toLowerCase()
            )
          )
          : true;
        return matchesHistoricalTag;
      });
      const commonPlaces = filteredType.filter(place1 =>
        filteredPeriod.some(place2 => place1._id === place2._id)
      );
      setFilteredPlaces(commonPlaces);
    };
    handleFilter();
  }, [filterHistoricType, filterHistoricalTagPeriod, places]);
  useEffect(() => {
    const commonPlaces = filteredPlaces.filter(place1 =>
      searchedPlaces.some(place2 => place1._id === place2._id)
    );
    setViewedPlaces(commonPlaces)

  }, [searchedPlaces, filteredPlaces]);
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <section className="layout-pb-xl">
      <style jsx global>{`
        /* Base style for all dots */
        /* Try multiple selectors and approaches */
        .ant-tour .ant-tour-indicators > span {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #dac4d0 !important;
        }
        .ant-tour .ant-tour-indicators > span[class*="active"] {
          background: #036264 !important;
        }

        /* Additional specificity */
        .ant-tour-indicators span[role="dot"][aria-current="true"] {
          background: #036264 !important;
        }

        .ant-tour .ant-tour-inner {
          border: 1px solid #5a9ea0;
          box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
        }

        .ant-tour .ant-tour-content {
          color: #8f5774;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-rendering: optimizeLegibility !important;
        }

        .ant-tour .ant-tour-title {
          color: #5a9ea0;
          font-weight: 600;
        }

        .ant-tour .ant-tour-close {
          color: #5a9ea0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ant-tour .ant-tour-close:hover {
          opacity: 1;
          color: #e5f8f8;
        }

        .ant-tour .ant-tour-buttons .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary
        {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default{
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        
        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color:white;
          background: #5a9ea0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
        }
        .ant-tour .ant-tour-arrow-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }  
      `}</style>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <Sidebar setFilterHistoricType={setFilterHistoricType} setFilterHistoricalTagPeriod={setFilterHistoricalTagPeriod} />
            </div>
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>

                  <span>{viewedPlaces?.length} results</span>

                </div>
              </div>
              {loading &&
                <span><Spinner /></span>
              }
            </div>
            <style>
              {`
.tourCard.-type-2 .tourCard__favorite2 {
  position: absolute;
  top: 20px;
  right: 60px;
  z-index: 1;
}
`}

            </style>

            <div className="row y-gap-30 pt-30">
              {currentPlaces.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      {elm?.images?.length > 0 && elm.images[0]?.url && <img src={elm.images[0].url} alt="image" />}
                      {userRole === "Tourism Governor" && <div className="tourCard__favorite2">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center" onClick={() => {

                          navigate(`/update-historical-place/${elm._id}`, { state: { historicalPlace: elm } });

                        }}>
                          <i className="icon-pencil text-15"></i>
                        </button>
                      </div>}
                      {userRole === "Tourism Governor" && <div className="tourCard__favorite">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center" onClick={() => {
                          handleDelete(elm._id);

                        }}>
                          <i className="icon-delete text-15"></i>
                        </button>
                      </div>}
                      {userRole === "Tourist" && <div className="tourCard__favorite2">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center" onClick={() =>
                          handleCopyLink(
                            `${window.location.origin}/historical-places/${elm._id}`
                          )
                        }>
                          <i className="icon-clipboard text-15"></i>
                        </button>
                      </div>}
                      {userRole === "Tourist" && <div className="tourCard__favorite">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center" onClick={() =>
                          handleShare(
                            `${window.location.origin}/historical-places/${elm._id}`
                          )
                        }>
                          <i className="icon-share text-15"></i>
                        </button>
                      </div>}

                    </div>



                    <div className="tourCard__content">
                      <div className="tourCard__location">
                        <i className="icon-pin"></i>
                        {elm.location.address}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{elm.name}</span>
                      </h3>



                      <p className="tourCard__text mt-5"> {truncateText(elm.description, 50)}</p>
                      <div className="row x-gap-20 y-gap-5 pt-30">
                        {elm.tags?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className=" rounded-12 text-white lh-11 text-13 px-15 py-10" style={{ backgroundColor: '#8f5774' }}>
                              {elm2.name}
                            </div>
                          </div>
                        ))}
                        {elm.historicalPeriod?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className=" rounded-12 text-white lh-11 text-13 px-15 py-10" style={{ backgroundColor: '#8f5774' }}>
                              {elm2.name}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    <div className="tourCard__info">
                      <div>


                        <div className="tourCard__price">
                          <div></div>

                          <div className="d-flex items-center">
                            <span className="text-20 fw-500 ml-5">
                              From  {currency ? currency : "EGP"} {getMinPrice(elm)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button ref={i === 0 ? refHPDetails : null} className="button -outline-accent-1 text-accent-1">
                        <Link to={`/historical-places/${elm._id}`}>
                          View Details
                          <i className="icon-arrow-top-right ml-10"></i>
                        </Link>
                      </button>
                    </div>


                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-center flex-column mt-60">
              {viewedPlaces?.length > placesPerPage && (
                <Pagination
                  totalItems={viewedPlaces?.length}
                  itemsPerPage={placesPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
