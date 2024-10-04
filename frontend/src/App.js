import { BrowserRouter } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import RoutesComponent from "./routes/RoutesComponent";
import './components/style.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <div className="pages">
          <RoutesComponent />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
