import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { Header } from '../components/Header';
import { TipModal } from '../components/TipModal';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { backendUrl, TIP_CONTRACT_ADDRESS } from '../lib/constants';
import { TIP_CONTRACT_ABI } from '../lib/tipABI';
import { useContractRead } from 'wagmi';
import './css/ContentDetail.css';

const ContentDetail = () => {
    const { metadata_cid } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { address } = useWallet();
    
    const [content, setContent] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);

    // Fetch total tips received by the content creator
    const { data: totalTipsReceived, isLoading: isLoadingTips } = useContractRead({
        address: TIP_CONTRACT_ADDRESS,
        abi: TIP_CONTRACT_ABI,
        functionName: 'getTotalTipsReceived',
        args: content?.public_key ? [content.public_key] : undefined,
        enabled: !!content?.public_key,
    });

    useEffect(() => {
        fetchContent();
    }, [metadata_cid]);

    const fetchContent = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/content/get_content_information?metadata_cid=${metadata_cid}`);
            console.log(response.data.value);
            setContent(response.data.value);
            
            // setContent(dummyContent);
            setUpvotes(response.data.value.upvotes);
            setDownvotes(response.data.value.downvotes);
            
            // Fetch comments after content is loaded
            await fetchComments(response.data.value.id);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (contentId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/content/get_comments?content_id=${contentId}`);
            console.log(response.data.value);
            setComments(response.data.value);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            const response = await axios.post(`${backendUrl}/api/v1/content/post_comment`, {data: {
                content_id: content.id,
                comment: newComment
            }}, { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            
            // Refresh comments after successful submission
            await fetchComments(content.id);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleUpvote = async () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to vote');
            return;
        }
        setUpvotes(prev => prev + 1);
        const response = await axios.get(`${backendUrl}/api/v1/content/upvote_content?content_id=${content.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    };

    const handleDownvote = async () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to vote');
            return;
        }
        setDownvotes(prev => prev + 1);
        const response = await axios.get(`${backendUrl}/api/v1/content/downvote_content?content_id=${content.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    };

    const handleTip = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to tip');
            return;
        }
        setIsTipModalOpen(true);
    };

    const handleMint = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to mint');
            return;
        }
        alert('Mint functionality coming soon!');
    };

    const handleOpenColab = () => {
        if (content.hash) {
            const colabUrl = `https://colab.research.google.com/github/googlecolab/colabtools/blob/master/notebooks/colab-github-demo.ipynb`;
            window.open(colabUrl, '_blank');
        }
    };

    if (isLoading) {
        return (
            <div className="content-detail">
                <Header />
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="content-detail">
                <Header />
                <div className="error">Content not found</div>
            </div>
        );
    }

    const isOwner = address && address.toLowerCase() === content.public_key.toLowerCase();

    return (
        <div className="content-detail">
            <Header />
            <br/>
            <div className="content-container">
                <TipModal
                    isOpen={isTipModalOpen}
                    onClose={() => setIsTipModalOpen(false)}
                    recipientAddress={content.public_key}
                    recipientName={content.title}
                />
                <div className="content-header">
                    <button className="back-button" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                    <h1 className="content-title">{content.title}</h1>
                </div>

                <div className="content-main">
                    <div className="content-left">
                        {content.thumbnail && (
                            <div className="thumbnail-container">
                                <img 
                                    src={content.thumbnail ? `http://103.194.228.64/ipfs/${content.thumbnail}` : content.thumbnail} 
                                    alt={content.title}
                                    className="content-thumbnail"
                                />
                            </div>
                        )}
                        
                        <div className="content-actions">
                            <div className="vote-buttons">
                                <button 
                                    className="vote-btn upvote" 
                                    onClick={handleUpvote}
                                    disabled={!isAuthenticated}
                                >
                                    👍 {upvotes}
                                </button>
                                <button 
                                    className="vote-btn downvote" 
                                    onClick={handleDownvote}
                                    disabled={!isAuthenticated}
                                >
                                    👎 {downvotes}
                                </button>
                            </div>
                            {content.file_category === 'dataset' && (
                                <div className="dataset-actions">
                                    <button 
                                        className="action-btn colab-btn"
                                        onClick={handleOpenColab}
                                    >
                                        📊 Open with Colab
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="content-right">
                        <div className="content-info">
                            <div className="info-section">
                                <h3>Content Information</h3>
                                <div className="info-grid">
                                    {content.hash && (
                                        <div className="info-item">
                                            <span className="label">Hash:</span>
                                            <span className="value">{content.hash}</span>
                                        </div>
                                    )}
                                    {content.file_type && (
                                        <div className="info-item">
                                            <span className="label">File Type:</span>
                                            <span className="value">{content.file_type}</span>
                                        </div>
                                    )}
                                    {content.file_category && (
                                        <div className="info-item">
                                            <span className="label">Category:</span>
                                            <span className="value">{content.file_category}</span>
                                        </div>
                                    )}
                                    {content.file_size && (
                                        <div className="info-item">
                                            <span className="label">File Size:</span>
                                            <span className="value">{content.file_size}</span>
                                        </div>
                                    )}
                                    {content.network && (
                                        <div className="info-item">
                                            <span className="label">Network:</span>
                                            <span className="value">{content.network}</span>
                                        </div>
                                    )}
                                    {content.license && (
                                        <div className="info-item">
                                            <span className="label">License:</span>
                                            <span className="value">{content.license}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="creator-section">
                                <h3>Owner</h3>
                                <div className="creator-info">
                                    <div className="public-key">
                                        <span className="label">Public Key:</span>
                                        <span className="value">{content.public_key}</span>
                                    </div>
                                    <div className="tips-info">
                                        <span className="label">Total Tips Received:</span>
                                        <span className="value">
                                            {isLoadingTips ? (
                                                'Loading...'
                                            ) : (
                                                totalTipsReceived ? 
                                                    `${(Number(totalTipsReceived) / 1e18).toFixed(4)} FIL` : 
                                                    '0 FIL'
                                            )}
                                        </span>
                                    </div>
                                    <div className="creator-actions">
                                        {!isOwner && (
                                            <button 
                                                className="action-btn tip-btn"
                                                onClick={handleTip}
                                                disabled={!isAuthenticated}
                                            >
                                                💰 Tip
                                            </button>
                                        )}
                                        {isOwner && (
                                            <button 
                                                className="action-btn mint-btn"
                                                onClick={handleMint}
                                            >
                                                🎨 Mint
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {content.description && (
                                <div className="description-section">
                                    <h3>Description</h3>
                                    <div className="description-content">
                                        <ReactMarkdown>{content.description}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="comments-section">
                            <h3>Comments ({comments.length})</h3>
                            
                            {isAuthenticated && (
                                <form className="comment-form" onSubmit={handleCommentSubmit}>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        disabled={isSubmittingComment}
                                        rows={3}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newComment.trim() || isSubmittingComment}
                                        className="submit-comment-btn"
                                    >
                                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            )}

                            <div className="comments-list">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-header">
                                            <span className="comment-author">
                                                {comment.public_key.slice(0, 6)}...{comment.public_key.slice(-4)}
                                            </span>
                                            <span className="comment-date">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="comment-content">
                                            {comment.comment}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentDetail; 