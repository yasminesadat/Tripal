import DatePicker, { Calendar } from "react-multi-date-picker";
export default function DateCalender() {
  return (
    <>
      <Calendar
        numberOfMonths={2}
        
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
      />
    </>
  );
}
