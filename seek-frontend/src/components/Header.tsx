import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { ConnectModal } from './ConnectModal';
import { CreateContentForm } from './CreateContentForm';
import { ThemeToggle } from './ThemeToggle';
import './css/Header.css'

export function Header() {
    const { address, isConnected } = useAccount();
    const { authenticate, logout, isAuthenticated, isAuthenticating } = useAuth();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showContentForm, setShowContentForm] = useState(false);

    // Authenticate when wallet connects and user is not already authenticated
    useEffect(() => {
        if (isConnected && address && !isAuthenticated && !isAuthenticating) {
            authenticate(address).catch((error) => {
                console.error('Authentication failed after wallet connection:', error);
            });
        }
    }, [isConnected, address, isAuthenticated, isAuthenticating, authenticate]);

    // Clear localStorage when wallet disconnects
    useEffect(() => {
        if (!isConnected && isAuthenticated) {
            logout();
        }
    }, [isConnected, isAuthenticated, logout]);

    const handleLogout = () => {
        logout();
    };

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