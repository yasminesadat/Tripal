import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function Calendar({ setStartDate, setEndDate }) {
  const [dates, setDates] = useState([
    new DateObject().setDay(5),
    new DateObject().setDay(14).add(1, "month"),
  ]);

  const handleDateChange = (selectedDates) => {
    setDates(selectedDates);
    if (selectedDates.length === 2) {
      setStartDate(selectedDates[0].toDate()); 
      setEndDate(selectedDates[1].toDate());   
    }
  };

  return (
    <DatePicker
      inputClass="custom_input-picker"
      containerClassName="custom_container-picker"
      value={dates}
      onChange={handleDateChange}
      numberOfMonths={2}
      offsetY={10}
      range
      rangeHover
      format="MMMM DD"
    />
  );
}
