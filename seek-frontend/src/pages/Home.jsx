import React from 'react';
import { Header } from '../components/Header';
import { Search } from '../components/Search';
import ContentList from '../components/ContentList.jsx';

export const Home = () => {
    return (
        <div className="home">
            <Header />
            <Search />
            <ContentList />
        </div>
    );
};
