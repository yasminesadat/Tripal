import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Pages from './pages';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Pages.Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
