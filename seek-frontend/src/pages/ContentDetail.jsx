import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { Header } from '../components/Header';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { backendUrl } from '../lib/constants';
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

    useEffect(() => {
        fetchContent();
        fetchComments();
    }, [metadata_cid]);

    const fetchContent = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await axios.get(`${backendUrl}/api/v1/content/${metadata_cid}`);
            // setContent(response.data);
            
            // Dummy data for now
            const dummyContent = {
                id: 1,
                user_id: 101,
                hash: "QmX123456789abcdef",
                title: "Amazing Digital Art Collection - A Journey Through Abstract Realms",
                file_size: "2.5 MB",
                network: "IPFS",
                upvotes: 42,
                downvotes: 3,
                comment_count: 8,
                file_type: "image/png",
                file_category: "Art",
                thumbnail: "https://picsum.photos/400/300?random=1",
                metadata_cid: metadata_cid,
                created_at: "2024-01-15T10:30:00Z",
                updated_at: "2024-01-15T10:30:00Z",
                public_key: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
                description: "This is an **amazing** collection of digital art that explores the boundaries of *abstract expressionism*. The pieces showcase:\n\n- **Bold colors** and dynamic compositions\n- *Innovative techniques* using modern tools\n- [Link to artist portfolio](https://example.com)\n\nCreated using cutting-edge digital tools and stored securely on IPFS for permanent accessibility.",
                license: "Creative Commons Attribution 4.0"
            };
            
            setContent(dummyContent);
            setUpvotes(dummyContent.upvotes);
            setDownvotes(dummyContent.downvotes);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await axios.get(`${backendUrl}/api/v1/content/${metadata_cid}/comments`);
            // setComments(response.data);
            
            // Dummy comments data
            const dummyComments = [
                {
                    id: 1,
                    user_id: 102,
                    user_address: "0x1234567890abcdef1234567890abcdef12345678",
                    comment: "This is absolutely stunning! The use of colors is incredible.",
                    created_at: "2024-01-15T11:00:00Z"
                },
                {
                    id: 2,
                    user_id: 103,
                    user_address: "0xabcdef1234567890abcdef1234567890abcdef12",
                    comment: "I love the abstract nature of these pieces. Great work!",
                    created_at: "2024-01-15T12:30:00Z"
                },
                {
                    id: 3,
                    user_id: 104,
                    user_address: "0x9876543210fedcba9876543210fedcba98765432",
                    comment: "The composition is really well thought out. Each piece tells a story.",
                    created_at: "2024-01-15T14:15:00Z"
                }
            ];
            
            setComments(dummyComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            // TODO: Replace with actual API call
            // const response = await axios.post(`${backendUrl}/api/v1/content/${metadata_cid}/comments`, {
            //     comment: newComment
            // }, {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            //     }
            // });
            
            // Add comment to local state (dummy)
            const newCommentObj = {
                id: comments.length + 1,
                user_id: 999,
                user_address: address,
                comment: newComment,
                created_at: new Date().toISOString()
            };
            
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleUpvote = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to vote');
            return;
        }
        setUpvotes(prev => prev + 1);
    };

    const handleDownvote = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to vote');
            return;
        }
        setDownvotes(prev => prev + 1);
    };

    const handleTip = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to tip');
            return;
        }
        alert('Tip functionality coming soon!');
    };

    const handleMint = () => {
        if (!isAuthenticated) {
            alert('Please connect your wallet to mint');
            return;
        }
        alert('Mint functionality coming soon!');
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
            {/* <Header /> */}
            <div className="content-container">
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
                                    src={content.thumbnail} 
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
                        </div>
                    </div>

                    <div className="content-right">
                        <div className="content-info">
                            <div className="info-section">
                                <h3>Content Information</h3>
                                <div className="info-grid">
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
                                <h3>Creator</h3>
                                <div className="creator-info">
                                    <div className="public-key">
                                        <span className="label">Public Key:</span>
                                        <span className="value">{content.public_key}</span>
                                    </div>
                                    <div className="creator-actions">
                                        <button 
                                            className="action-btn tip-btn"
                                            onClick={handleTip}
                                            disabled={!isAuthenticated}
                                        >
                                            💰 Tip
                                        </button>
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
                                                {comment.user_address.slice(0, 6)}...{comment.user_address.slice(-4)}
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