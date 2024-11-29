import { Link } from 'react-router-dom';
import HeaderSearch from "./HeaderSearch";

export default function PageHeader({onSearch, title,  userRole}) {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
                {userRole==='Admin'&& <Link to="/admin">Home</Link> }
               {userRole==='Tourist'&& <Link to="/tourist">Home</Link> }
              {userRole==='Tour Guide'&& <Link to="/tourguide">Home</Link> }
              </span>

              <span>{">"}</span>
              <span className="breadcrumbs__item">
              {userRole==='Admin'&&<Link to="/admin/itineraries">Itineraries</Link> }
                {userRole==='Tourist'&&<Link to="/upcoming-itineraries">Itineraries</Link> }
                {userRole==='Tour Guide'&&<Link to="/my-itineraries">Itineraries</Link> }
              </span>
            </div>
          </div>

          <div className="col-auto">
            <div className="pageHeader__subtitle">
              <HeaderSearch onSearch={onSearch}/>
            </div>
          </div>
        </div>

        <div className="row pt-30">
          <div className="col-auto">
            <h1 className="pageHeader__title">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
