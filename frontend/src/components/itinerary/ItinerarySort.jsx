const ItinerarySort = ({ onSort }) => {
    const handleSortChange = (e) => {
        const value = e.target.value;
        onSort(value);
    };
    return (
        <div>
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" onChange={handleSortChange}>
                <option value="">Select</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingAsc">Rating: Low to High</option>
                <option value="ratingDesc">Rating: High to Low</option>
            </select>
        </div>
    );
};

export default ItinerarySort;