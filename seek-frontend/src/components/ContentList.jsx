import React, { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import AdCard from './AdCard';
import './css/ContentList.css';
import axios from 'axios';
import { backendUrl } from '../lib/constants';

const ContentList = ({ searchResults, isSearching }) => {
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/content/explore_content?by=latest`);
        console.log(response.data.value);
        setContent(response.data.value || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent([]);
      }
    };
    
    // Only fetch default content if not searching
    if (!isSearching) {
      fetchContent();
    }
  }, [isSearching]);

  // Use search results if available, otherwise use default content
  const displayContent = isSearching ? (searchResults || []) : content;

  return (
    <div className="content-list">
      {isSearching && (
        <div className="search-results-header">
          <h3>Search Results ({displayContent.length} items)</h3>
        </div>
      )}
      <div className="content-grid">
        {displayContent.map((contentItem) => (
          <ContentCard
            key={contentItem.id}
            {...contentItem}
          />
        ))}
        {isSearching && displayContent.length > 0 && <AdCard />}
      </div>
      {isSearching && displayContent.length === 0 && (
        <div className="no-results">
          <p>No results found for your search.</p>
        </div>
      )}
    </div>
  );
};

export default ContentList; 