import React, { useState } from 'react';
import { processImage, validateImageFile, ProcessedThumbnail } from '../utils/imageProcessor';
import { searchMimeTypes } from '../utils/mimeTypes';
import { searchCategories } from '../utils/categories';
import './css/CreateContentForm.css';
import { backendUrl } from '../lib/constants';
import axios from 'axios';

// Helper function to convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

interface CreateContentFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateContentForm({ isOpen, onClose }: CreateContentFormProps) {
    const [formData, setFormData] = useState({
        hash: '',
        title: '',
        fileType: '',
        fileCategory: '',
        description: '',
        fileSize: '',
        network: 'IPFS',
        thumbnail: null as ArrayBuffer | null,
        tags: ['', '', ''] as string[]
    });
    const [sizeUnit, setSizeUnit] = useState('KB');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [thumbnailError, setThumbnailError] = useState<string>('');
    const [typeSearchResults, setTypeSearchResults] = useState<string[]>([]);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [categorySearchResults, setCategorySearchResults] = useState<string[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.map((tag, i) => i === index ? value : tag)
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setThumbnailError('');
        
        if (!file) {
            setFormData(prev => ({ ...prev, thumbnail: null }));
            return;
        }
        
        // Validate file using utility function
        const validationError = validateImageFile(file);
        if (validationError) {
            setThumbnailError(validationError);
            return;
        }
        
        try {
            const processedThumbnail = await processImage(file);
            
            // Convert the processed image to ArrayBuffer for efficient storage
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                
                // Check if binary data is too large (4MB limit)
                if (arrayBuffer.byteLength > 4000000) {
                    setThumbnailError('Image is too large after processing. Please try a smaller image.');
                    return;
                }
                
                setFormData(prev => ({
                    ...prev,
                    thumbnail: arrayBuffer
                }));
            };
            reader.readAsArrayBuffer(processedThumbnail.file);
        } catch (error) {
            setThumbnailError('Failed to process image. Please try again.');
            console.error('Image processing error:', error);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, fileType: value }));
        
        const results = searchMimeTypes(value);
        setTypeSearchResults(results);
        setShowTypeDropdown(results.length > 0);
    };

    const selectMimeType = (mimeType: string) => {
        setFormData(prev => ({ ...prev, fileType: mimeType }));
        setShowTypeDropdown(false);
        setTypeSearchResults([]);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, fileCategory: value }));
        
        const results = searchCategories(value);
        setCategorySearchResults(results);
        setShowCategoryDropdown(results.length > 0);
    };

    const selectCategory = (category: string) => {
        setFormData(prev => ({ ...prev, fileCategory: category }));
        setShowCategoryDropdown(false);
        setCategorySearchResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate compulsory parameters
        if (!formData.hash.trim()) {
            alert('Please provide a CID or Hash');
            return;
        }
        
        if (!formData.title.trim()) {
            alert('Please provide a title');
            return;
        }
        
        if (!formData.tags.some(tag => tag.trim())) {
            alert('Please provide at least one tag');
            return;
        }
        
        if (!formData.network) {
            alert('Please select a network');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare data object with all form data including base64 thumbnail
            const requestData = {
                data: {
                    hash: formData.hash,
                    title: formData.title,
                    fileType: formData.fileType,
                    fileCategory: formData.fileCategory,
                    description: formData.description,
                    fileSize: formData.fileSize ? `${formData.fileSize} ${sizeUnit}` : '',
                    network: formData.network,
                    tags: formData.tags.filter(tag => tag.trim()),
                    thumbnail: formData.thumbnail ? arrayBufferToBase64(formData.thumbnail) : null
                }
            };
            
            // Send as JSON with base64 thumbnail included
            const response = await axios.post(`${backendUrl}/api/v1/content/add_content`, requestData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Content created successfully:', response.data);
            
            // Reset form and close modal
            setFormData({ 
                hash: '', 
                title: '', 
                fileType: '', 
                fileCategory: '',
                description: '', 
                fileSize: '', 
                network: 'IPFS', 
                thumbnail: null,
                tags: ['', '', '']
            });
            setSizeUnit('KB');
            setThumbnailError('');
            setTypeSearchResults([]);
            setShowTypeDropdown(false);
            setCategorySearchResults([]);
            setShowCategoryDropdown(false);
            onClose();
            
        } catch (error) {
            console.error('Error creating content:', error);
            alert('Failed to create content. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({ 
                hash: '', 
                title: '', 
                fileType: '', 
                fileCategory: '',
                description: '', 
                fileSize: '', 
                network: 'IPFS', 
                thumbnail: null,
                tags: ['', '', '']
            });
            setSizeUnit('KB');
            setThumbnailError('');
            setTypeSearchResults([]);
            setShowTypeDropdown(false);
            setCategorySearchResults([]);
            setShowCategoryDropdown(false);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Content</h2>
                    <button className="modal-close" onClick={handleClose} disabled={isSubmitting}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="content-form">
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="hash">CID or Hash *</label>
                            <input
                                type="text"
                                id="hash"
                                name="hash"
                                value={formData.hash}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter content hash"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter content title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fileType">File Type</label>
                            <div className="type-input-container">
                                <input
                                    type="text"
                                    id="fileType"
                                    name="fileType"
                                    value={formData.fileType}
                                    onChange={handleTypeChange}
                                    onFocus={() => {
                                        if (formData.fileType.trim()) {
                                            const results = searchMimeTypes(formData.fileType);
                                            setTypeSearchResults(results);
                                            setShowTypeDropdown(results.length > 0);
                                        }
                                    }}
                                    onBlur={() => {
                                        // Delay hiding dropdown to allow clicks
                                        setTimeout(() => setShowTypeDropdown(false), 200);
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Search for MIME type (e.g., image, zip, pdf)"
                                />
                                {showTypeDropdown && typeSearchResults.length > 0 && (
                                    <div className="type-dropdown">
                                        {typeSearchResults.map((mimeType, index) => (
                                            <div
                                                key={index}
                                                className="type-option"
                                                onClick={() => selectMimeType(mimeType)}
                                            >
                                                {mimeType}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <small className="form-hint">
                                Start typing to search for MIME types (e.g., "image" for image types, "zip" for archives)
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fileCategory">File Category</label>
                            <div className="type-input-container">
                                <input
                                    type="text"
                                    id="fileCategory"
                                    name="fileCategory"
                                    value={formData.fileCategory}
                                    onChange={handleCategoryChange}
                                    onFocus={() => {
                                        if (formData.fileCategory.trim()) {
                                            const results = searchCategories(formData.fileCategory);
                                            setCategorySearchResults(results);
                                            setShowCategoryDropdown(results.length > 0);
                                        }
                                    }}
                                    onBlur={() => {
                                        // Delay hiding dropdown to allow clicks
                                        setTimeout(() => setShowCategoryDropdown(false), 200);
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Search for category (e.g., website, dataset, image, video)"
                                />
                                {showCategoryDropdown && categorySearchResults.length > 0 && (
                                    <div className="type-dropdown">
                                        {categorySearchResults.map((category, index) => (
                                            <div
                                                key={index}
                                                className="type-option"
                                                onClick={() => selectCategory(category)}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <small className="form-hint">
                                Start typing to search for categories (e.g., "website", "dataset", "image", "video")
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Tags (up to 3) *</label>
                            <div className="tags-input-group">
                                {formData.tags.map((tag, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={tag}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        disabled={isSubmitting}
                                        placeholder={`Tag ${index + 1}`}
                                        className="tag-input"
                                    />
                                ))}
                            </div>
                            <small className="form-hint">
                                Add up to 3 tags to help categorize your content
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                placeholder="Enter info about data, storage provider details, retrieval details, etc."
                                rows={4}
                                className="description-textarea"
                            />
                            <small className="form-hint">
                                Supports markdown formatting (e.g., **bold**, *italic*, [links](url), etc.)
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="size">File Size</label>
                            <div className="size-input-group">
                                <input
                                    type="number"
                                    id="fileSize"
                                    name="fileSize"
                                    value={formData.fileSize}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    placeholder="Enter size"
                                    min="0"
                                    step="0.01"
                                />
                                <select
                                    name="sizeUnit"
                                    value={sizeUnit}
                                    onChange={(e) => setSizeUnit(e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="KB">KB</option>
                                    <option value="MB">MB</option>
                                    <option value="GB">GB</option>
                                    <option value="TB">TB</option>
                                    <option value="PB">PB</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="network">Network *</label>
                            <select
                                id="network"
                                name="network"
                                value={formData.network}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="IPFS">IPFS</option>
                                <option value="Filecoin">Filecoin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="thumbnail">Thumbnail</label>
                            
                            {/* AI Thumbnail Generation Section */}
                            <div className="ai-thumbnail-section">
                                <div className="ai-thumbnail-controls">
                                    <button
                                        type="button"
                                        disabled={true}
                                        className="generate-thumbnail-btn coming-soon"
                                    >
                                        🚧 Coming Soon
                                    </button>
                                </div>
                                <small className="form-hint">
                                    AI thumbnail generation will be available soon! For now, please upload your own image.
                                </small>
                            </div>
                            
                            <div className="thumbnail-upload-section">
                                <label htmlFor="thumbnail-upload" className="upload-label">
                                    Or upload your own image:
                                </label>
                                <input
                                    type="file"
                                    id="thumbnail"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    accept="image/*"
                                />
                                <small className="form-hint">
                                    Maximum file size: 2MB.
                                </small>
                            </div>
                            
                            {thumbnailError && (
                                <div className="error-message">
                                    {thumbnailError}
                                </div>
                            )}
                            {formData.thumbnail && (
                                <div className="thumbnail-preview">
                                    <img 
                                        src={URL.createObjectURL(new Blob([formData.thumbnail], { type: 'image/webp' }))} 
                                        alt="Thumbnail preview" 
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                    <p>Thumbnail converted to binary format</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="modal-button secondary" 
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="modal-button primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Content'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 