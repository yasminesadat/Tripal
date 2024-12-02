import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
// import { speedFeatures } from "@/data/tourFilteringOptions";
import Stars from "../../components/common/Stars";
// import {Pagination} from  "../../components/common/Pagination";
import { getUserData } from "@/api/UserService";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAllHistoricalPlacesByTourismGoverner, deleteHistoricalPlace, getAllHistoricalPlaces } from '../../api/HistoricalPlaceService';
export default function HistoricalPlacesList({ searchTerm }) {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();
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
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const errorDisplayed = useRef(false);
 useEffect(()=>{
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
      //toast.error('Error while fetching')
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
  if(userRole!==null){
    if (userRole === "Guest" || userRole === "Admin" || userRole === "Tourist") {
      fetchPlaces();
    }
    if (userRole === "Tourism Governor") {
      getHistoricalPlacesByGoverner();
    }  
  }


 },userRole)
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
        setGovernerHistoricalPlace(governerHistoricalPlace.filter(place => place._id !== id));
      }
    }
    catch (e) {
      // error msg
    }
  }
  const getMinPrice = (Place) => {

    const minValue = Math.min(Place.ticketPrices.foreigner, Place.ticketPrices.native, Place.ticketPrices.student);
    return minValue;

  }


  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("EGP");
  const [filters, setFilters] = useState({ historicType: [], historicalTagPeriod: [] });
  useEffect(() => {
    const curr = sessionStorage.getItem("currency");
    if (curr) {
      setCurrency(curr);
    }
  }, []);

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

  const handleFilter = (filters) => {
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

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <Sidebar setFilters={setFilters} />
            </div>

            {/* <div className="accordion d-none mb-30 lg:d-flex js-accordion">
              <div
                className={`accordion__item col-12 ${sidebarActive ? "is-active" : ""
                  } `}
              >
                <button
                  className="accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12"
                  onClick={() => setSidebarActive((pre) => !pre)}
                >
                  <i className="icon-sort-down mr-10 text-16"></i>
                  Filter
                </button> */}

                {/* <div
                  className="accordion__content"
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}
                > */}
                  {/* <div className="pt-20">
                    <Sidebar setFilters={setFilters} />
                  </div> */}
                {/* </div> */}
              {/* </div> */}
            {/* </div> */}
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>{filteredPlaces?.length} results</div>
              </div>

             
             
            </div>

            <div className="row y-gap-30 pt-30">
              {filteredPlaces.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      {elm?.images?.length > 0 && elm.images[0]?.url&& <img src={elm.images[0].url} alt="image" />}
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
