import React from 'react';
import { Header } from '../components/Header';
import { Search } from '../components/Search';

export const Home = () => {
    return (
        <div className="home">
            <Header />
            <Search />
        </div>
    );
};
