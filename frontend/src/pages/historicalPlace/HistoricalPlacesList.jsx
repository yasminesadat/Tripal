import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import { getUserData } from "@/api/UserService";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";
import { getAllHistoricalPlacesByTourismGoverner, deleteHistoricalPlace, getAllHistoricalPlaces } from '../../api/HistoricalPlaceService';
export default function HistoricalPlacesList({ searchTerm }) {
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();
  const [currency, setCurrency] = useState("EGP");
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


  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1); return () => clearInterval(intervalId);
  }, [currency]);



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
  const [governerHistoricalPlace, setGovernerHistoricalPlace] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [searchKey, setSearchKey] = useState(searchTerm);
  const errorDisplayed = useRef(false);

  useEffect(() => {
    const getHistoricalPlacesByGoverner = async () => {

      setLoading(true);
      try {
        const result = await getAllHistoricalPlacesByTourismGoverner();
        if (result) {
          console.log("result: ", result);
          setPlaces(result);
          setFilteredPlaces(result);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);

      }
    }
    const fetchPlaces = async () => {
      try {
        const response = await getAllHistoricalPlaces();
        setPlaces(response);
        setFilteredPlaces(response);
      } catch (err) {
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


  }, userRole)
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
  const getMinPrice = (Place) => {

    const minValue = Math.min(Place.ticketPrices.foreigner, Place.ticketPrices.native, Place.ticketPrices.student);
    return minValue;

  }


  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ historicType: [], historicalTagPeriod: [] });


  const handleSearch = () => {
    const lowerCaseSearchTerm = searchKey.toLowerCase();
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
    setFilteredPlaces(results);
  };

  const handleFilter = () => {
    const { historicType, historicalTagPeriod } = filters;

    if (historicType.length == 0 && historicalTagPeriod.length == 0) {
      setFilteredPlaces(places);
      return;
    }

    const filtered = places.filter((place) => {
      const matchesHistoricType = historicType.length > 0
        ? place.tags &&
        place.tags.some(placeTag =>
          historicType.some(
            historicTag =>
              placeTag.name &&
              historicTag &&
              placeTag.name.toLowerCase().includes(historicTag.toLowerCase())
          )
        )
        : true;
      const matchesHistoricalTag = historicalTagPeriod > 0
        ? place.historicalPeriod && place.historicalPeriod.some(tag => historicalTagPeriod.some(
          historicPeriod =>
            tag.name &&
            historicPeriod &&
            tag.name.toLowerCase().includes(historicPeriod.toLowerCase())
        ))
        : true;

      return matchesHistoricType && matchesHistoricalTag;
    });

    setFilteredPlaces(filtered);
  };


  return (

    
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <Sidebar setFilters={setFilters} />
            </div>


          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>{filteredPlaces?.length} results</div>
              </div>
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
              {filteredPlaces.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      {elm?.images?.length > 0 && elm.images[0]?.url && <img src={elm.images[0].url} alt="image" />}
                      {userRole === "Tourism Governor" && <div className="tourCard__favorite2">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center" onClick={() => {

                          navigate(`/update-historical-place/${elm._id}`, { state: { historicalPlace:elm } });

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



                      <p className="tourCard__text mt-5">{elm.description}</p>


                    </div>

                    <div className="tourCard__info">
                      <div>


                        <div className="tourCard__price">
                          <div></div>

                          <div className="d-flex items-center">
                            From{" "}
                            <span className="text-20 fw-500 ml-5">
                              {currency}{getMinPrice(elm)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button -outline-accent-1 text-accent-1">
                        <Link to={{
                          pathname: `/historical-places/${elm._id}`,
                          state: {
                            ticketPrices: {
                              foreigner: convertPrice(elm.ticketPrices.foreigner),
                              native: convertPrice(elm.ticketPrices.native),
                              student: convertPrice(elm.ticketPrices.student),
                            },
                            currency: currency,
                          },
                        }}>
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
              {/* <Pagination /> */}

              <div className="text-14 text-center mt-20">
                {/* Showing results 1-30 of 1,415 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
