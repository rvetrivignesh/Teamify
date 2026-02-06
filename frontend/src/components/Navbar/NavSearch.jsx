import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavSearch = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
            if (query.trim()) {
                navigate(`/explore?q=${encodeURIComponent(query)}`);
            } else {
                navigate('/explore');
            }
            setQuery('');
        }
    };

    return (
        <div className="nav-search-container">
            <input
                type="text"
                className="nav-search-input"
                placeholder="Search Projects & People..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
        </div>
    );
};

export default NavSearch;
