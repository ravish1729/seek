import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPoints } from '../hooks/useUserPoints';
import { useUserTips } from '../hooks/useUserTips';
import { ConnectModal } from './ConnectModal';
import { CreateContentForm } from './CreateContentForm';
import { ThemeToggle } from './ThemeToggle';
import './css/Header.css'

export function Header() {
    const { isAuthenticated } = useAuth();
    const { points, loading } = useUserPoints();
    const { tips, loading: tipsLoading } = useUserTips();
    const navigate = useNavigate();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showContentForm, setShowContentForm] = useState(false);

    const handleCreateContent = () => {
        if (!isAuthenticated) {
            setShowConnectModal(true);
        } else {
            setShowContentForm(true);
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="header">
            <div className="header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <span>👀 Seek</span>
            </div>
            <div className="header-auth">
                {isAuthenticated && (
                    <div className="user-stats">
                        <div className="user-points">
                            {loading ? (
                                <span className="points-loading">Loading...</span>
                            ) : (
                                <span className="points-display">
                                    💎 {points !== null ? points : 0} points
                                </span>
                            )}
                        </div>
                        <div className="user-tips">
                            {tipsLoading ? (
                                <span className="tips-loading">Loading...</span>
                            ) : (
                                <span className="tips-display">
                                    💰 {tips !== null ? tips.toFixed(4) : '0.0000'} FIL
                                </span>
                            )}
                        </div>
                    </div>
                )}
                <button 
                    className="create-content-btn"
                    onClick={handleCreateContent}
                >
                    Create Content
                </button>
                <ConnectButton />
                <ThemeToggle />
            </div>
            
            <ConnectModal 
                isOpen={showConnectModal} 
                onClose={() => setShowConnectModal(false)} 
            />
            
            <CreateContentForm 
                isOpen={showContentForm} 
                onClose={() => setShowContentForm(false)} 
            />
        </div>
    );
} 