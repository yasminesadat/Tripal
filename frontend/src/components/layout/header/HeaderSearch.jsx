import  { useEffect, useRef, useState } from "react";

export default function HeaderSearch({ white, onSearch, activity }) {
  const [selected, setSelected] = useState(""); 
  const [ddActive, setDdActive] = useState(false);
  const inputRef = useRef();

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
      {activity && <input
        onChange={handleInputChange}
        ref={inputRef}
        onClick={() => setDdActive((prev) => !prev)}
        type="text"
        placeholder="Search for activities by name, category, or tags..."
        className={`js-search ${white ? "text-white" : ""}`}
      />}
      {!activity && <input
        onChange={handleInputChange}
        ref={inputRef}
        onClick={() => setDdActive((prev) => !prev)}
        type="text"
        placeholder="Search for itineraries by name, or tags..."
        className={`js-search ${white ? "text-white" : ""}`}
      />}
    </div>
  );
}
