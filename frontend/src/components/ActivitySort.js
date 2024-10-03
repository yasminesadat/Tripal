import React from 'react';

const ActivitySort = ({ onSort }) => {
    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split('-');
        onSort(field, order);
    };

    return (
        <div>
            <label>Sort by:</label>
            <select onChange={handleSortChange}>
                <option value="">Select</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="ratings-asc">Ratings: Low to High</option>
                <option value="ratings-desc">Ratings: High to Low</option>
            </select>
        </div>
    );
};

export default ActivitySort;