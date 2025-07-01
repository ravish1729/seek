import React, { useState } from 'react';
import './css/Search.css'

export function Search() {
    const [searchInput, setSearchInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('Search executed with:', searchInput);
            // Add your search logic here
            // For example: performSearch(searchInput);
        }
    };

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="search-input"
            />
        </div>
    );
}
