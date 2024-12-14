import  { useEffect, useRef, useState } from "react";

export default function HeaderSearch({ white, onSearch }) {
  const [selected, setSelected] = useState("");
  const [ddActive, setDdActive] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = selected;
  }, [selected]);

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelected(value); 
    onSearch(value); 
  };

  return (
    <div ref={dropDownContainer} className="header__search js-liverSearch js-form-dd">
      <i className="icon-search text-18"></i>
      <input
        onChange={handleInputChange}
        ref={inputRef}
        onClick={() => setDdActive((prev) => !prev)}
        type="text"
        placeholder="Search Historical Places' Names or tags"
        className={`js-search ${white ? "text-white" : ""}`}
      />
    </div>
  );
}
