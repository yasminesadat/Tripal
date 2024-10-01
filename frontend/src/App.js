import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Pages from './pages';
import TagManager from './components/PreferenceTagComponent';
import ActivityCategoryDetails from './components/ActivityCategoryDetails';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/preference-tags" element={<TagManager />} />
            <Route path="/view-products" element={<Pages.ProductList />} />
            <Route path="/product/:productName" element={<Pages.ProductDetails />} />
            <Route path="/adminActivityCategories" element={<ActivityCategoryDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
