import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Search } from '../components/Search';
import ContentList from '../components/ContentList.jsx';

export const Home = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(true);
    };

    const clearSearch = () => {
        setSearchResults(null);
        setIsSearching(false);
    };

    return (
        <div className="home">
            <Header />
            <Search onSearch={handleSearch} onClear={clearSearch} />
            <ContentList searchResults={searchResults} isSearching={isSearching} />
        </div>
    );
};
