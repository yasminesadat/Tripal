import { BrowserRouter } from "react-router-dom";
import RoutesComponent from "./routes/RoutesComponent";
import './components/style.css'
import './components/oldstyle.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <RoutesComponent />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
