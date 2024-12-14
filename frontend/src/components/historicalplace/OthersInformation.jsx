import moment from "moment";

export default function OthersInformation({ OpeningHours, ticketPrices, currency ,exchangerate}) {
  return (
    <>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-clock"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Weekdays Timings</div>
            <div className="text-14 text-light-2 lh-16">{OpeningHours?.weekdays?.openingTime?moment(OpeningHours?.weekdays?.openingTime, "HH:mm:ss").format("HH:mm:ss A"):"N/A"} - {OpeningHours?.weekdays?.closingTime?moment(OpeningHours?.weekdays?.closingTime, "HH:mm:ss").format("HH:mm:ss A"):"N/A"}</div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-clock"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">WeekEnds Timings</div> 
            <div className="text-14 text-light-2 lh-16">{OpeningHours?.weekends?.openingTime?moment(OpeningHours?.weekends?.openingTime, "HH:mm:ss").format("HH:mm:ss A"):"N/A"} - {OpeningHours?.weekends?.closingTime?moment(OpeningHours?.weekends?.closingTime, "HH:mm:ss").format("HH:mm:ss A"):"N/A"}</div>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Foreigner ticket Price</div>
            <div className="text-14 text-light-2 lh-16">{currency||'EGP'} {(ticketPrices?.foreigner*exchangerate).toFixed(2)} </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Native ticket Price</div>
            <div className="text-14 text-light-2 lh-16">{currency||'EGP'}  {ticketPrices?.native} </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Student ticket Price</div>
            <div className="text-14 text-light-2 lh-16">{currency||'EGP'}  {(ticketPrices?.student*exchangerate).toFixed(2)} </div>
          </div>
        </div>
      </div>
    </>
  );
}