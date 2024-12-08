import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e0829d",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

export default function RangeSlider({ priceRange, setPriceRange }) {
  const [value, setValue] = useState(priceRange);

  useEffect(() => {
    setValue(priceRange);
  }, [priceRange]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPriceRange(newValue);
  };

  return (
    <>
      <div className="js-price-rangeSlider" style={{ padding: "20px 15px" }}>
        <div className="px-5">
          <ThemeProvider theme={theme}>
            <Slider
              getAriaLabel={() => "Price Range"}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              max={10000}
              min={0}
              disableSwap
            />
          </ThemeProvider>
        </div>

        <div className="d-flex justify-between mt-20">
          <div className="">
            <span className="">Price:</span>
            <span className="fw-500 js-lower">{value[0]}</span>
            <span> - </span>
            <span className="fw-500 js-upper">{value[1]}</span>
          </div>
        </div>
      </div>
    </>
  );
}