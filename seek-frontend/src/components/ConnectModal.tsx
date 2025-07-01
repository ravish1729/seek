import React from 'react';
import './css/ConnectModal.css';

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Connect Required</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <p>Please connect your wallet to create content.</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 