import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);

    const searchableItems = [
        { title: 'Activities', path: '/upcomingactivities' },
        { title: 'Itineraries', path: '/upcomingitineraries' },
        { title: 'Historical Places', path: '/historicalPlaces' }
    ];

    const filteredItems = searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleItemClick = (path) => {
        navigate(path);
        setSearchTerm('');
        setShowResults(false);
    };

    const handleSearch = () => {
        const exactMatch = searchableItems.find(
            item => item.title.toLowerCase() === searchTerm.toLowerCase()
        );

        if (exactMatch) {
            navigate(exactMatch.path);
        } else {
            navigate('/upcomingactivities');
        }
        setSearchTerm('');
        setShowResults(false);
    };

    return (
        <div className="pageHeader__search relative" style={{ width: '400px' }}>
            <input
                type="text"
                placeholder="Search for a topic"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                style={{
                    width: '100%',
                    padding: '10px 15px',
                    borderRadius: '25px', // More rounded edges
                    border: '1px solid #eee',
                    paddingRight: '45px' // Space for the button
                }}
            />

            <button
                onClick={handleSearch}
                style={{
                    backgroundColor: 'var(--color-dark-purple)',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '45px',    // Increased from 35px
                    height: '45px',   // Increased from 35px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <i className="icon-search text-18 text-white"></i>  {/* Increased icon size too */}
            </button>

            {showResults && searchTerm && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #eee',
                        borderRadius: '15px',
                        marginTop: '5px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        zIndex: 1000
                    }}
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleItemClick(item.path)}
                                style={{
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    borderBottom: index !== filteredItems.length - 1 ? '1px solid #eee' : 'none',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                {item.title}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px 15px', color: '#666' }}>
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;