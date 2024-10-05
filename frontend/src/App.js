import { BrowserRouter } from "react-router-dom";
import GuestNavBar from "./components/guest/GuestNavBar";
import RoutesComponent from "./routes/RoutesComponent";
import './components/style.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <GuestNavBar />
        <div className="pages">
          <RoutesComponent />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
