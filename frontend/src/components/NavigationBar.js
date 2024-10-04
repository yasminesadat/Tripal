import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/admin">Admin Dashboard</Link>
                </li>
                <li>
                    <Link to="/preference-tags">Manage Preference Tags</Link>
                </li>
                <li>
                    <Link to="/view-products">View Products</Link>
                </li>
                <li>
                    <Link to="/upcoming-activities">View Upcoming Activities</Link>
                </li>
                <li>
                    <Link to="/historical-places">View Historical Places</Link>
                </li>
                <li>
                    <Link to="/adminActivityCategories">Activity Categories</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavigationBar;