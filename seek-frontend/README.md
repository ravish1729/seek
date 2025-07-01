# Seek Frontend

A decentralized content discovery and sharing platform built with React and Web3 technologies.

## Features

### Content Discovery
- Browse content in a responsive grid layout
- View content thumbnails, titles, and metadata
- Filter by network (IPFS, Arweave)
- Search functionality

### Content Detail Page
- **URL Structure**: `/metadata_cid` - Navigate to specific content using its metadata CID
- **Content Information Display**:
  - Thumbnail image
  - Title and description (with markdown support)
  - File type, category, size, and network
  - License information
  - Creator's public key
  - Upvotes and downvotes

### User Interaction
- **Voting System**: Upvote/downvote content (requires wallet connection)
- **Comments**: Add comments on content (requires wallet connection)
- **Creator Actions**:
  - **Tip Button**: Send tips to content creators (coming soon)
  - **Mint Button**: Only visible to content owners (coming soon)

### Authentication
- Web3 wallet integration (RainbowKit)
- Secure authentication flow with signature verification
- Persistent login state

### Content Creation
- Upload content with metadata
- AI thumbnail generation (coming soon)
- Support for various file types and categories
- Tag-based categorization

### Theme System
- **Light and Dark Mode**: Toggle between light and dark themes
- **System Preference**: Automatically detects user's system theme preference
- **Persistent Storage**: Remembers user's theme choice across sessions
- **Smooth Transitions**: Animated theme switching for better UX
- **Accessibility**: High contrast ratios and proper color schemes for both themes

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContentCard.jsx  # Content card component (clickable)
│   ├── ContentList.jsx  # Grid layout for content display
│   ├── Header.tsx       # Navigation header
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx        # Home page with content list
│   ├── ContentDetail.jsx # Content detail page
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useWallet.ts    # Wallet connection
│   └── ...
└── ...
```

## API Integration

### Content Detail Page
The content detail page fetches data from two endpoints:

1. **Content Data**: `GET /api/v1/content/{metadata_cid}`
   - Returns content metadata, creator info, and statistics
   - Currently using dummy data with TODO comments for API integration

2. **Comments**: `GET /api/v1/content/{metadata_cid}/comments`
   - Returns array of comments with user addresses
   - Currently using dummy data with TODO comments for API integration

### Comment Submission
- **Endpoint**: `POST /api/v1/content/{metadata_cid}/comments`
- **Authentication**: Requires Bearer token
- **Payload**: `{ comment: string }`

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small mobile (< 480px)

## Technologies Used

- **React 19** - UI framework
- **React Router** - Client-side routing
- **RainbowKit** - Web3 wallet integration
- **Wagmi** - React hooks for Ethereum
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Vite** - Build tool and dev server

## Future Enhancements

- [ ] AI thumbnail generation
- [ ] Tip functionality implementation
- [ ] Mint/NFT functionality
- [ ] Advanced search and filtering
- [ ] User profiles and reputation system
- [ ] Content recommendations
