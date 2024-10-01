import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Pages from './pages';
import TagManager from './components/PreferenceTagComponent';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/preference-tags" element={<TagManager />} />
            <Route path="/view-products" element={<Pages.ProductList />} />
          </Routes>
        </div>
      </BrowserRouter>

    </div>
    
  );
}

export default App;
