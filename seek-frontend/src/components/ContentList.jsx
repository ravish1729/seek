import React from 'react';
import ContentCard from './ContentCard';
import './css/ContentList.css';

const ContentList = () => {
  // Dummy data array
  const dummyContent = [
    {
      id: 1,
      user_id: 101,
      hash: "QmX123456789abcdef",
      file_size: "2.5 MB",
      network: "IPFS",
      upvotes: 42,
      comments_count: 8,
      downvotes: 3,
      thumbnail: null,
      metadata_cid: "QmMetadata123",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      title: "Amazing Digital Art Collection - A Journey Through Abstract Realms"
    },
    {
      id: 2,
      user_id: 102,
      hash: "QmY987654321fedcba",
      file_size: "1.8 MB",
      network: "Arweave",
      upvotes: 156,
      comments_count: 23,
      downvotes: 12,
      thumbnail: "https://picsum.photos/300/200?random=1",
      metadata_cid: "QmMetadata456",
      created_at: "2024-01-14T15:45:00Z",
      updated_at: "2024-01-14T15:45:00Z",
      title: "Blockchain Technology Explained"
    },
    {
      id: 3,
      user_id: 103,
      hash: "QmZabcdef123456789",
      file_size: "5.2 MB",
      network: "IPFS",
      upvotes: 89,
      comments_count: 15,
      downvotes: 7,
      thumbnail: null,
      metadata_cid: "QmMetadata789",
      created_at: "2024-01-13T09:20:00Z",
      updated_at: "2024-01-13T09:20:00Z",
      title: "The Future of Decentralized Storage"
    },
    {
      id: 4,
      user_id: 104,
      hash: "QmA123456789bcdef",
      file_size: "3.1 MB",
      network: "Arweave",
      upvotes: 234,
      comments_count: 31,
      downvotes: 18,
      thumbnail: "https://picsum.photos/300/200?random=2",
      metadata_cid: "QmMetadata101",
      created_at: "2024-01-12T14:10:00Z",
      updated_at: "2024-01-12T14:10:00Z",
      title: "Web3 Development Guide"
    },
    {
      id: 5,
      user_id: 105,
      hash: "QmB987654321cdefa",
      file_size: "4.7 MB",
      network: "IPFS",
      upvotes: 67,
      comments_count: 12,
      downvotes: 5,
      thumbnail: null,
      metadata_cid: "QmMetadata202",
      created_at: "2024-01-11T11:25:00Z",
      updated_at: "2024-01-11T11:25:00Z",
      title: "Understanding Smart Contracts and Their Applications"
    },
    {
      id: 6,
      user_id: 106,
      hash: "QmCabcdef123456789",
      file_size: "2.9 MB",
      network: "Arweave",
      upvotes: 178,
      comments_count: 27,
      downvotes: 9,
      thumbnail: "https://picsum.photos/300/200?random=3",
      metadata_cid: "QmMetadata303",
      created_at: "2024-01-10T16:40:00Z",
      updated_at: "2024-01-10T16:40:00Z",
      title: "DeFi Protocols and Yield Farming Strategies"
    },
    {
      id: 7,
      user_id: 107,
      hash: "QmD123456789defabc",
      file_size: "6.3 MB",
      network: "IPFS",
      upvotes: 45,
      comments_count: 9,
      downvotes: 4,
      thumbnail: null,
      metadata_cid: "QmMetadata404",
      created_at: "2024-01-09T13:15:00Z",
      updated_at: "2024-01-09T13:15:00Z",
      title: "NFT Marketplace Development Tutorial"
    },
    {
      id: 8,
      user_id: 108,
      hash: "QmE987654321efabcd",
      file_size: "1.5 MB",
      network: "Arweave",
      upvotes: 312,
      comments_count: 45,
      downvotes: 22,
      thumbnail: "https://picsum.photos/300/200?random=4",
      metadata_cid: "QmMetadata505",
      created_at: "2024-01-08T08:50:00Z",
      updated_at: "2024-01-08T08:50:00Z",
      title: "Cryptocurrency Trading Strategies for Beginners"
    }
  ];

  return (
    <div className="content-list">
      <div className="content-grid">
        {dummyContent.map((content) => (
          <ContentCard
            key={content.id}
            {...content}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentList; 