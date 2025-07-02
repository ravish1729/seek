import React, { useState } from 'react';
import './css/Search.css'
import { backendUrl } from '../lib/constants';
import axios from 'axios';

interface SearchProps {
    onSearch: (results: any[]) => void;
    onClear: () => void;
}

export function Search({ onSearch, onClear }: SearchProps) {
    const [searchInput, setSearchInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        
        // Clear search results when input is empty
        if (value.trim() === '') {
            onClear();
        }
    };

    const handleKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            try {
                const response = await axios.get(`${backendUrl}/api/v1/search/search_content?query=${searchInput}`);
                console.log(response.data.value);
                onSearch(response.data.value || []);
                /**
                 * response example:
                 [{
                        "id": 1,
                        "user_id": 1,
                        "hash": "QmReV8R4Q97V6mvTAS3HfYyD1fyK1DPeAT5UKAbcaARZvt",
                        "title": "Alien",
                        "file_size": null,
                        "network": "IPFS",
                        "upvotes": 3,
                        "downvotes": 4,
                        "comment_count": 3,
                        "file_type": "image/jpeg",
                        "file_category": "image",
                        "thumbnail": "QmUooBMj4LM5Pi6xpc1VC6juqqBvziauUdg3LxtxhRSY6y",
                        "metadata_cid": "QmexQ3JjW588EXjcCJ6WmvHSGApLLDNNXTokxAFtjQYL2X",
                        "created_at": "2025-07-02 13:27:31",
                        "updated_at": "2025-07-02 19:55:57",
                        "description": null,
                        "license": null,
                        "user_public_key": "0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b",
                        "tags": [
                            "alien"
                        ],
                        "relevance_score": 110.93899421296297
                    }]
                 */
            } catch (error) {
                console.error('Error searching content:', error);
                onSearch([]);
            }
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
