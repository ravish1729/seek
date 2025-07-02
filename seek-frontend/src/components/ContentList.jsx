import React, { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import './css/ContentList.css';
import axios from 'axios';
import { backendUrl } from '../lib/constants';

const ContentList = () => {
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/content/explore_content?by=latest`);
        console.log(response);
        setContent(response.data.value || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent([]);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="content-list">
      <div className="content-grid">
        {content.map((contentItem) => (
          <ContentCard
            key={contentItem.id}
            {...contentItem}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentList; 