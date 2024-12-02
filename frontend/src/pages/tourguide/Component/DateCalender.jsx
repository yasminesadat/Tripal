import DatePicker, { Calendar } from "react-multi-date-picker";
export default function DateCalender({value, setValue}) {
  return (
    <>
      <Calendar
       value={value}
        numberOfMonths={2}
        onChange={setValue}
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
      />
    </>
  );
}
