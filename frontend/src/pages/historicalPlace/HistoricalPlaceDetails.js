
import Gallery2 from '../../components/historicalplace/Gallery2';
import MainInformation from '../../components/historicalplace/MainInformation';
import OthersInformation from '../../components/historicalplace/OthersInformation';
// import Included from '../../components/historicalplace/Included';
import Overview from '../../components/historicalplace/Overview';
// import RoadMap from '../../components/historicalplace/RoadMap';
// import Map from '../../components/historicalplace/Map';
// import DateCalender from '../../components/historicalplace/DateCalender';
// import Faq from '../../components/historicalplace/Faq';
// import Rating from '../../components/historicalplace/Rating';
// import Reviews from '../../components/historicalplace/Reviews';
// import CommentBox from '../../components/historicalplace/CommentBox';
import TourSlider from '../../components/historicalplace/TourSlider';
//import TourSingleSidebar from '../../components/historicalplace/TourSingleSidebar';
import LocationMap from '../../components/common/MapComponent';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHistoricalPlaceDetails } from '../../api/HistoricalPlaceService'
import { useLocation } from 'react-router-dom';
const HistoricalPlaceDetails = () => {
  const location = useLocation();
  const props = location.state?.governerHistoricalPlace;
  console.log(props);
  const { id } = useParams();
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState([51.505, -0.09,]);
  const [historicalPlace, setHistoricalPlace] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getHistoricalPlaceDetail = async (historicalPLaceId) => {
      setLoading(true);
      try {
        console.log(id);
        const result = await getHistoricalPlaceDetails(historicalPLaceId);
        if (result) {
          console.log("result: ", result);
          setHistoricalPlace(result);
          setCoordinates([result?.location?.coordinates?.latitude ,result?.location?.coordinates?.longitude])
          setAddress(result?.location?.address);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    getHistoricalPlaceDetail(id);
    console.log(props);
  }, [id]);
  return (
    <>
      <Gallery2 images={historicalPlace?.images} />
      <section className="pt-30">
        <div className="container">
          <MainInformation historicalPlace={historicalPlace} />
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <OthersInformation OpeningHours={historicalPlace.openingHours} ticketPrices={historicalPlace.ticketPrices} />
              </div>

              <Overview Description={historicalPlace?.description} />

              <div className="line mt-60 mb-60"></div>

              {/* <h2 className="text-30">What's included</h2>

              <Included />

              <div className="line mt-60 mb-60"></div> */}

              {/* <h2 className="text-30">Itinerary</h2>

              <div className="mt-30">
                <RoadMap />
              </div> */}

              <h2 className="text-30 mt-60 mb-30">Location</h2>
              <div className="mapTourSingle">
                <LocationMap
                  markerPosition={coordinates}
                  setMarkerPosition={setCoordinates}
                  setSelectedLocation={setAddress}
                />
              </div>

              {/* <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Availability Calendar</h2>

              <DateCalender /> */}

               <div className="line mt-60 mb-60"></div>

              {/*<h2 className="text-30">FAQ</h2>

              <div className="accordion -simple row y-gap-20 mt-30 js-accordion">
                <Faq />
              </div> */}

              {/* <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div> */}

              {/* <Reviews /> */}

              {/* <button className="button -md -outline-accent-1 text-accent-1 mt-30">
                See more reviews
                <i className="icon-arrow-top-right text-16 ml-10"></i>
              </button> */}

              {/* <CommentBox /> */}
            </div>


            {/* <TourSlider historicalPlaces={props} /> */}

          </div>
        </div>
      </section>

    </>

  );
}
export default HistoricalPlaceDetails;