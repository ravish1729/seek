import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../contexts/AuthContext';
import { ConnectModal } from './ConnectModal';
import { CreateContentForm } from './CreateContentForm';
import { ThemeToggle } from './ThemeToggle';
import './css/Header.css'

export function Header() {
    const { isAuthenticated } = useAuth();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showContentForm, setShowContentForm] = useState(false);

    const handleCreateContent = () => {
        if (!isAuthenticated) {
            setShowConnectModal(true);
        } else {
            setShowContentForm(true);
        }
    };

    return (
        <div className="header">
            <div className="header-logo">
                <span>👀 Seek</span>
            </div>
            <div className="header-auth">
                <ThemeToggle />
                <button 
                    className="create-content-btn"
                    onClick={handleCreateContent}
                >
                    Create Content
                </button>
                <ConnectButton />
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