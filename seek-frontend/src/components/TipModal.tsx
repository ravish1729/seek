import React, { useState, useEffect } from 'react';
import { useTip } from '../hooks/useTip';
import './css/TipModal.css';

interface TipModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientAddress: string;
    recipientName?: string;
}

export function TipModal({ isOpen, onClose, recipientAddress, recipientName }: TipModalProps) {
    const [amount, setAmount] = useState('');
    const [platformFee, setPlatformFee] = useState('0');
    const [netAmount, setNetAmount] = useState('0');
    const [error, setError] = useState('');
    
    const {
        sendTip,
        calculateFee,
        validateAmount,
        validateAddress,
        platformFeePercentage,
        isSending,
        isWaitingForReceipt,
        isTransactionSuccessful,
        sendError,
        hash,
        receipt
    } = useTip();

    const isLoading = isSending || isWaitingForReceipt;

    useEffect(() => {
        if (isOpen) {
            setError('');
            setPlatformFee('0');
            setNetAmount('0');
        }
    }, [isOpen]);

    useEffect(() => {
        if (sendError) {
            setError(sendError.message || 'Failed to send tip');
        }
    }, [sendError]);

    useEffect(() => {
        if (isTransactionSuccessful && receipt) {
            alert('Tip sent successfully!');
            onClose();
            setAmount('');
            setPlatformFee('0');
            setNetAmount('0');
        }
    }, [isTransactionSuccessful, receipt, onClose]);

    useEffect(() => {
        if (hash) {
            alert(`Transaction submitted! Hash: ${hash}`);
        }
    }, [hash]);

    const handleAmountChange = async (value: string) => {
        setAmount(value);
        setError('');

        if (!validateAmount(value)) {
            setPlatformFee('0');
            setNetAmount('0');
            return;
        }

        try {
            const { fee, netAmount: calculatedNetAmount } = await calculateFee(value);
            setPlatformFee(fee);
            setNetAmount(calculatedNetAmount);
        } catch (err) {
            console.error('Failed to calculate fee:', err);
            setError('Failed to calculate platform fee');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateAmount(amount)) {
            setError('Please enter a valid amount');
            return;
        }

        if (!validateAddress(recipientAddress)) {
            setError('Invalid recipient address');
            return;
        }

        setError('');

        try {
            await sendTip(recipientAddress, amount);
        } catch (err: any) {
            console.error('Failed to send tip:', err);
            setError(err.message || 'Failed to send tip');
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
            setAmount('');
            setPlatformFee('0');
            setNetAmount('0');
            setError('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content tip-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Send Tip</h2>
                    <button 
                        className="modal-close" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="recipient-info">
                        <h3>Recipient</h3>
                        <p className="recipient-address">
                            {recipientName ? `${recipientName} (${recipientAddress})` : recipientAddress}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="tip-form">
                        <div className="form-group">
                            <label htmlFor="amount">Amount (FIL)</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                placeholder="0.01"
                                step="0.001"
                                min="0.001"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {amount && validateAmount(amount) && (
                            <div className="fee-breakdown">
                                <div className="fee-item">
                                    <span>Platform Fee ({platformFeePercentage}%):</span>
                                    <span>{parseFloat(platformFee).toFixed(6)} FIL</span>
                                </div>
                                <div className="fee-item net-amount">
                                    <span>Recipient receives:</span>
                                    <span>{parseFloat(netAmount).toFixed(6)} FIL</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="modal-button secondary"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="modal-button primary"
                                disabled={isLoading || !amount || !validateAmount(amount)}
                            >
                                {isLoading ? 'Sending...' : 'Send Tip'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 