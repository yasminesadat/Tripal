import { Link } from 'react-router-dom';

export default function PageHeader({ itineraryId, itineraryTitle, userRole }) {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
               {userRole==='Tourist'&& <Link to="/tourist">Home</Link> }
                {userRole==='Admin'&& <Link to="/admin">Home</Link> }
                {userRole==='Tour Guide'&& <Link to="/tourguide">Home</Link> }
                {userRole==='Guest'&&<Link to="/">Home</Link>}
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
                {userRole==='Tourist'&& <Link to="/upcoming-itineraries">Itineraries</Link> }
                {userRole==='Admin'&& <Link to="/admin/itineraries">Itineraries</Link> }
                {userRole==='Tour Guide'&& <Link to="/my-itineraries">Itineraries</Link> }
                {userRole==='Guest'&&<Link to="/upcomingitineraries">Itineraries</Link>}
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