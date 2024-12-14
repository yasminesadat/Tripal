import { Link } from 'react-router-dom';

export default function PageHeader({ activityId, activityTitle, tourist, admin }) {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
                {tourist && <Link to="/tourist">Home</Link> }
                {admin && <Link to="/admin">Home</Link> }
                {!tourist && !admin && <Link to="/">Home</Link> }
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
                {tourist && <Link to="/upcoming-activities">Activities</Link> }
                {admin && <Link to="/admin/activities">Activities</Link> }
                {!tourist && !admin && <Link to="/upcomingactivities">Activities</Link> }
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
                <Link to={`/activity/${activityId}`}>{activityTitle}</Link> 
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