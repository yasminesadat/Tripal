import  { useEffect, useRef, useState } from "react";

// The search component now accepts an `onSearch` prop to send data back to the parent
export default function HeaderSearch({ white, onSearch }) {
  const [selected, setSelected] = useState(""); // The selected search term
  const [ddActive, setDdActive] = useState(false); // Whether the dropdown is active
  const inputRef = useRef();

  // Update the input value whenever `selected` changes
  useEffect(() => {
    inputRef.current.value = selected;
  }, [selected]);

  // Close the dropdown if the user clicks outside of it
  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActive(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Handle the input change and trigger the onSearch prop
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelected(value); 
    onSearch(value); 
  };

  return (
    <div ref={dropDownContainer} className="header__search js-liverSearch js-form-dd">
      <i className="icon-search text-18"></i>
      <input
        onChange={handleInputChange} // Trigger onChange for the input field
        ref={inputRef}
        onClick={() => setDdActive((prev) => !prev)}
        type="text"
        placeholder="Search activities' titles, categories, or tags"
        className={`js-search ${white ? "text-white" : ""}`}
      />
    </div>
  );
}
