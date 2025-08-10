import React, { useState, useRef, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPoints } from '../hooks/useUserPoints';
import { useUserTips } from '../hooks/useUserTips';
import { ConnectModal } from './ConnectModal';
import { CreateContentForm } from './CreateContentForm';
import { ThemeToggle } from './ThemeToggle';
import './css/Header.css'
import { useWallet } from '../hooks/useWallet';

export function Header() {
    const { isAuthenticated } = useAuth();
    const { points, loading } = useUserPoints();
    const { tips, loading: tipsLoading } = useUserTips();
    const navigate = useNavigate();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showContentForm, setShowContentForm] = useState(false);
    const [walletMenuOpen, setWalletMenuOpen] = useState(false);
    const walletMenuRef = useRef<HTMLDivElement | null>(null);
    const { disconnect } = useWallet();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
                setWalletMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                <button 
                    className="create-content-btn"
                    onClick={handleCreateContent}
                >
                    Post Content
                </button>
                {isAuthenticated && (
                    <div className="user-stats">
                        <div className="user-points pill">
                            {loading ? (
                                <span className="points-loading">Loading...</span>
                            ) : (
                                <span className="points-display">💎 {points !== null ? points : 0} points</span>
                            )}
                        </div>
                        <div className="user-tips pill">
                            {tipsLoading ? (
                                <span className="tips-loading">Loading...</span>
                            ) : (
                                <span className="tips-display">💰 {tips !== null ? tips.toFixed(4) : '0.0000'} FIL</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Custom wallet controls for consistent look */}
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        mounted,
                        openAccountModal,
                        openConnectModal,
                        openChainModal,
                    }) => {
                        const connected = mounted && account && chain;
                        const truncatedAddress = account?.address
                            ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
                            : '';

                        return (
                            <div className="wallet-controls" ref={walletMenuRef}>
                                <div className="wallet-container">
                                    <button
                                        type="button"
                                        className="wallet-button pill"
                                        onClick={() => {
                                            if (!connected) {
                                                openConnectModal();
                                            } else {
                                                setWalletMenuOpen((v) => !v);
                                            }
                                        }}
                                        aria-haspopup={connected ? 'menu' : undefined}
                                        aria-expanded={walletMenuOpen}
                                    >
                                        {connected ? (
                                            <span className="wallet-label">{truncatedAddress}</span>
                                        ) : (
                                            'Connect Wallet'
                                        )}
                                    </button>

                                    {connected && walletMenuOpen && (
                                        <div className="wallet-dropdown" role="menu">
                                            <div className="wallet-dropdown-section">
                                                <div className="wallet-address" title={account?.address || ''}>
                                                    {account?.address}
                                                </div>
                                            </div>
                                            {chain && (
                                                <button
                                                    className="wallet-dropdown-item"
                                                    onClick={() => {
                                                        setWalletMenuOpen(false);
                                                        openChainModal();
                                                    }}
                                                >
                                                    Network: {chain.name}
                                                </button>
                                            )}
                                            <button
                                                className="wallet-dropdown-item"
                                                onClick={() => {
                                                    if (account?.address) {
                                                        navigator.clipboard.writeText(account.address);
                                                    }
                                                    setWalletMenuOpen(false);
                                                }}
                                            >
                                                Copy address
                                            </button>
                                            <button
                                                className="wallet-dropdown-item"
                                                onClick={() => {
                                                    setWalletMenuOpen(false);
                                                    openAccountModal();
                                                }}
                                            >
                                                View account
                                            </button>
                                            <button
                                                className="wallet-dropdown-item destructive"
                                                onClick={() => {
                                                    setWalletMenuOpen(false);
                                                    disconnect();
                                                }}
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }}
                </ConnectButton.Custom>

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