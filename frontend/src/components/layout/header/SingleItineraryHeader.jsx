import { Link } from 'react-router-dom';

export default function PageHeader({ itineraryId, itineraryTitle, tourist, admin, tourguide }) {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
                {tourist && <Link to="/tourist">Home</Link> }
                {admin && <Link to="/admin">Home</Link> }
                {tourguide && <Link to="/tourguide">Home</Link> }
                {!tourist && !admin && !tourguide && <Link to="/">Home</Link>}
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
                {tourist && <Link to="/upcoming-itineraries">Itineraries</Link> }
                {admin && <Link to="/admin/itineraries">Itineraries</Link> }
                {tourguide && <Link to="/my-itineraries">Itineraries</Link> }
                {!tourist && !admin && !tourguide && <Link to="/upcomingitineraries">Itineraries</Link>}
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
                <Link to={`/itinerary/${itineraryId}`}>{itineraryTitle}</Link> 
              </span>
            </div>
          </div>

          <div className="col-auto">
          </div>
        </div>
      </div>
    </section>
  );
}