import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ContentCard.css';

const ContentCard = ({
  id,
  user_id,
  hash,
  file_size,
  network,
  upvotes,
  comment_count,
  downvotes,
  thumbnail,
  metadata_cid,
  created_at,
  updated_at,
  title = `Content ${id}` // Default title if not provided
}) => {
  const navigate = useNavigate();
  // Generate dummy thumbnail if none provided
  const generateDummyThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 300, 200);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 200);
      
      // Add some geometric shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(75, 75, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(200, 50, 60, 60);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(100, 120);
      ctx.lineTo(150, 150);
      ctx.closePath();
      ctx.fill();
    }
    
    return canvas.toDataURL();
  };

  const thumbnailUrl = thumbnail ? `http://103.194.228.64/ipfs/${thumbnail}` : generateDummyThumbnail();

  const handleCardClick = () => {
    navigate(`/${metadata_cid}`);
  };

  return (
    <div className="content-card" onClick={handleCardClick}>
      <div className="card-thumbnail">
        <img 
          src={thumbnailUrl} 
          alt={title}
          onError={(e) => {
            const target = e.target;
            target.src = generateDummyThumbnail();
          }}
        />
      </div>
      
      <div className="card-content">
        <h3 className="card-title" title={title}>
          {title}
        </h3>
        
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-icon">👍</span>
            <span className="stat-value">{upvotes}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">👎</span>
            <span className="stat-value">{downvotes}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{comment_count}</span>
          </div>
        </div>
        
        <div className="card-meta">
          <span className="network-badge">{network}</span>
          <span className="file-size">{file_size}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 