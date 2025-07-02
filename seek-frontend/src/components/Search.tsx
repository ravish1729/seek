import React, { useState } from 'react';
import './css/Search.css'
import { backendUrl } from '../lib/constants';
import axios from 'axios';

export function Search() {
    const [searchInput, setSearchInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const response = await axios.get(`${backendUrl}/api/v1/search/search_content?query=${searchInput}`);
            console.log(response.data.value);
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
