import React, { useEffect, useState } from 'react';
import { viewUpcomingActivities } from '../api/ActivityApi'; 
import ActivitiesList from '../components/ActivitiesList';
import ActivitySearch from '../components/ActivitySearch';
import ActivityFilter from '../components/ActivityFilter';
import ActivitySort from '../components/ActivitySort';

const UpcomingActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await viewUpcomingActivities();
                setActivities(response.data);
                setFilteredActivities(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching activities');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const handleSearch = (searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = activities.filter(activity => {
            const hasMatchingTitle = activity.title.toLowerCase().includes(lowerCaseSearchTerm);
            const hasMatchingCategory = activity.category && activity.category.name && activity.category.name.toLowerCase().includes(lowerCaseSearchTerm);
            const hasMatchingTags = activity.tags && activity.tags.some(tag => tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm));
            
            return hasMatchingTitle || hasMatchingCategory || hasMatchingTags;
        });
        setFilteredActivities(results);
    };

    const handleFilter = (filters) => {
        const { startDate, endDate, budgetMin, budgetMax, category, rating } = filters;

        const filtered = activities.filter(activity => {
            const activityDate = new Date(activity.date);
            const activityBudget = activity.price;
            const activityCategory = activity.category; 
            const activityRating = activity.ratings; 

            const isDateValid = (!startDate || activityDate >= new Date(startDate)) && (!endDate || activityDate <= new Date(endDate));
            const isBudgetValid = (!budgetMin || activityBudget >= budgetMin) && (!budgetMax || activityBudget <= budgetMax);
            const isCategoryValid = !category || (activityCategory.name && activityCategory.name.toLowerCase() === category.toLowerCase());
            const isRatingValid = !rating || (activityRating && activityRating >= rating);

            return isDateValid && isBudgetValid && isCategoryValid && isRatingValid;
        });

        setFilteredActivities(filtered);
    };

    const handleSort = (field, order) => {
        const sortedActivities = [...filteredActivities].sort((a, b) => {
            const aValue = field === 'price' ? a.price : a.ratings;
            const bValue = field === 'price' ? b.price : b.ratings;

            if (order === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
        setFilteredActivities(sortedActivities);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Upcoming Activities</h1>
            <ActivitySearch onSearch={handleSearch} />
            <ActivityFilter onFilter={handleFilter} />
            <ActivitySort onSort={handleSort} />
            <ActivitiesList activities={filteredActivities} />
        </div>
    );
};

export default UpcomingActivitiesPage;
