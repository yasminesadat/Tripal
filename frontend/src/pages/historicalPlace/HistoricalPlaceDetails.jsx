import Gallery2 from '../../components/historicalplace/Gallery2';
import MainInformation from '../../components/historicalplace/MainInformation';
import OthersInformation from '../../components/historicalplace/OthersInformation';
import Overview from '../../components/historicalplace/Overview';
import LocationMap from '../../components/common/MapComponent';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHistoricalPlaceDetails } from '../../api/HistoricalPlaceService'
import { useLocation } from 'react-router-dom';
import { getTouristCurrency, getConversionRate } from '@/api/ExchangeRatesService';
const HistoricalPlaceDetails = ({ userRole }) => {
  const location = useLocation();
  const { id } = useParams();
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState([51.505, -0.09]);
  const [historicalPlace, setHistoricalPlace] = useState({});
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");

  const getExchangeRate = async () => {
    if (currency) {
      const rate = await getConversionRate(currency);
      setExchangeRate(rate);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1); return () => clearInterval(intervalId);
  }, [currency]);

  const [validCoordinates, setValidCoordinates] = useState(false);

  // In your useEffect where you set coordinates
  useEffect(() => {
    const getHistoricalPlaceDetail = async (historicalPLaceId) => {
      setLoading(true);
      try {
        const result = await getHistoricalPlaceDetails(historicalPLaceId);
        if (result) {
          const newCoords = [
            result?.location?.coordinates?.latitude,
            result?.location?.coordinates?.longitude
          ];


          if (newCoords[0] && newCoords[1]) {
            setCoordinates(newCoords);
            setValidCoordinates(true); 
          }
          setHistoricalPlace(result);
          setAddress(result?.location?.address);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    getHistoricalPlaceDetail(id);
  }, [id]);
  return (
    <>
      <Gallery2 images={historicalPlace?.images} />
      <section className="pt-30">
        <div className="container">
          <MainInformation historicalPlace={historicalPlace} userRole={userRole} />
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <OthersInformation OpeningHours={historicalPlace.openingHours} ticketPrices={historicalPlace.ticketPrices} currency={currency} exchangerate={exchangeRate} />
              </div>

              <Overview Description={historicalPlace?.description} />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30 mt-60 mb-30">Location</h2>
              <div className="mapTourSingle">
                {validCoordinates ? (
                  <LocationMap
                    markerPosition={coordinates}
                    search={"dont search bro"}
                  />
                ) : (
                  <div>Loading map...</div>
                )}

              </div>

              <div className="line mt-60 mb-60"></div>

            </div>

          </div>
        </div>
      </section>

    </>

  );
}
export default HistoricalPlaceDetails;