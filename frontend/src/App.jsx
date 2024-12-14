import { BrowserRouter } from "react-router-dom";
import "./styles/style.css";
import Aos from "aos";
import { useEffect } from "react";
import ScrollTopBehaviour from "./components/common/ScrollTopBehavier";
import ScrollToTop from "./components/common/ScrollToTop";
import RoutesComponent from "./routes/RoutesComponent";

function App() {
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <RoutesComponent />
        <ScrollTopBehaviour />
      </BrowserRouter>
      <ScrollToTop />
    </>
  );
}

export default App;