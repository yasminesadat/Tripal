import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function Calendar({ setDate,value}) {
  const [dates, setDates] = useState([
    new DateObject().setDate(value)
  ]);

  const handleDateChange = (selectedDates) => {
    setDates(selectedDates);
   
      setDate(selectedDates[0].toDate());   
   
  };

  return (
    <DatePicker
      inputClass="custom_input-picker"
      containerClassName="custom_container-picker"
      value={dates}
      onChange={handleDateChange}
      numberOfMonths={2}
      offsetY={10}
     
     
      format="MMMM DD"
    />
  );
}
