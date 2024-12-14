import DatePicker from "react-multi-date-picker";

export default function Calender({dates,setDates}) {
  return (
    <DatePicker
      inputClass="custom_input-picker"
      containerClassName="custom_container-picker"
      value={dates}
      onChange={setDates}
      numberOfMonths={2}
      offsetY={10}
      range
      rangeHover
      format="DD MMM YY"
    />
  );
}