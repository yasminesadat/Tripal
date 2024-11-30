import { Link, useLocation } from "react-router-dom";

export default function Menu({ refFlights, refHotels, refActivities, refItineraries, refHisPlaces, refProducts }) {

  return (
    <>
      <div className="xl:d-none ">
        <div className="desktopNav">

          <div className="desktopNav__item">
            <Link to="/tourist">Home</Link>
          </div>

          <div className="desktopNav__item" ref={refFlights}>
            <Link to="/tourist/book-flight" >Flights</Link>
          </div>

          <div className="desktopNav__item" ref={refHotels}>
            <Link to="/hotel2">Hotels</Link>
          </div>

          <div className="desktopNav__item" ref={refActivities}>
            <Link to="/upcoming-activities">Activities</Link>
          </div>

          <div className="desktopNav__item" ref={refItineraries}>
            <Link to="/upcoming-itineraries">Itineraries</Link>
          </div>

          <div className="desktopNav__item" ref={refHisPlaces}>
            <Link to="/destinations">Historical Places</Link>
          </div>

          <div className="desktopNav__item" ref={refProducts}>
            <Link to="/tourist/view-products">Products</Link>
          </div>
          
        </div>
      </div>
    </>
  );
}
