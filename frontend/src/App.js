import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Pages from './pages';
import TagManager from './components/PreferenceTagComponent';
import AdminDashboard from './components/AdminDashboard';
import UpcomingActivities from './pages/UpcomingActivities';
import NavigationBar from './components/NavigationBar';
import TouristHomePage from './pages/TouristHomePage';
import ActivityCategoryDetails from './components/ActivityCategoryDetails';
import HistoricalPlaces from './pages/HistoricalPlaces';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/preference-tags" element={<TagManager />} />
            <Route path="/view-products" element={<Pages.ProductList />} />
            <Route path="/product/:productName" element={<Pages.ProductDetails />} />
            <Route path="/adminActivityCategories" element={<ActivityCategoryDetails />} />
            <Route path="/upcoming-activities" element={<UpcomingActivities />} />
            <Route path="/historical-places" element={<HistoricalPlaces />} />
            <Route path="/tourist-home" element={<TouristHomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
