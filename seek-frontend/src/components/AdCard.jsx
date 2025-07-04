import React from 'react';
import './css/AdCard.css';

const AdCard = () => {
  // Generate a crypto-themed advertisement thumbnail
  const generateAdThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a modern crypto-themed gradient background
      const gradient = ctx.createLinearGradient(0, 0, 300, 200);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 200);
      
      // Add crypto-themed elements
      // Bitcoin symbol
      ctx.fillStyle = '#f7931a';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('₿', 150, 80);
      
      // Add some geometric crypto elements
      ctx.strokeStyle = '#00d4aa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 120);
      ctx.lineTo(250, 120);
      ctx.stroke();
      
      // Add small crypto icons
      ctx.fillStyle = '#00d4aa';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('ETH', 80, 160);
      ctx.fillText('SOL', 150, 160);
      ctx.fillText('ADA', 220, 160);
      
      // Add a subtle glow effect
      ctx.shadowColor = '#00d4aa';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(0, 212, 170, 0.3)';
      ctx.fillRect(0, 0, 300, 200);
      ctx.shadowBlur = 0;
    }
    
    return canvas.toDataURL();
  };

  const handleAdClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Open external link in new tab
    window.open('https://www.coinbase.com/earn', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="ad-card" onClick={handleAdClick}>
      <div className="ad-badge">Sponsored</div>
      <div className="card-thumbnail">
        <img 
          src={generateAdThumbnail()} 
          alt="Crypto Investment Opportunity"
        />
      </div>
      
      <div className="card-content">
        <h3 className="card-title">
          Earn Crypto Rewards - Start Your Journey Today
        </h3>
        
        <div className="ad-description">
          <p>Discover the world of cryptocurrency with secure, trusted platforms. Learn, earn, and grow your digital assets.</p>
        </div>
        
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">4.8/5</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">2M+ Users</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🔒</span>
            <span className="stat-value">Secure</span>
          </div>
        </div>
        
        <div className="card-meta">
          <span className="network-badge">Crypto</span>
          <span className="file-size">Free to Start</span>
        </div>
      </div>
    </div>
  );
};

export default AdCard; 