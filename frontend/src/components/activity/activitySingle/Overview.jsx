export default function Overview({serviceFee, accessibility, itineraryDescription, activityDescription, refActivityBook}) {
  const resource = itineraryDescription? 'Itinerary':'Activity';
  return (
    <>
      <h2 className="text-30" ref={refActivityBook}> {resource} Overview</h2>
      <p className="mt-20">
        {itineraryDescription}{activityDescription}
      </p>

      <h3 className="text-20 fw-500 mt-20">{resource} Highlights</h3>
      <ul className="ulList mt-20">
      <li>Immerse yourself in the local culture with interactive activities and workshops.</li>
      {itineraryDescription&&<>  
      <li>Experience a curated journey designed for all types of travelers.</li>
      <li>Discover unique landmarks, hidden gems, and cultural treasures along the way.</li>
      <li>Enjoy the comfort of a personalized tour with a limited number of guests.</li>
      <li>Learn fascinating stories and historical insights from our expert guides.</li>
      <li>Capture unforgettable moments at stunning scenic viewpoints.</li>
      <li>Relish a balanced itinerary that offers both exploration and relaxation.</li>
        <li>
          <b>Service Fee:</b> {serviceFee}.
        </li>
        <li><b>Accessibility available:</b>  {accessibility.join(', ')}.</li></>}
      </ul>
    </>
  );
}