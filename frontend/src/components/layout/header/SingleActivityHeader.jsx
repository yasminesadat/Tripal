import React from "react";
import { Link } from 'react-router-dom';

export default function PageHeader({ activityId, activityTitle, tourist }) {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="row justify-between">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
               {tourist&& <Link to="/tourist">Home</Link> }
                {!tourist&& <Link to="/admin">Home</Link> }
              </span>
              <span>{"> "}</span>
              <span className="breadcrumbs__item">
            {tourist&&    <Link to="/upcoming-activities">Activities</Link> }
             {!tourist  && <Link to="/admin/activities">Activities</Link> }
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
