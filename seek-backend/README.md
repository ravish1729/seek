# Seek Backend

A decentralized content discovery and curation platform backend built with Node.js, TypeScript, and Express. This backend provides APIs for content management, user authentication, search functionality, and blockchain integration.

## 🚀 Features

- **Content Management**: Add, edit, explore, and manage decentralized content
- **User Authentication**: Web3-based authentication using signature verification
- **Voting System**: Upvote and downvote content with blockchain integration
- **Comment System**: Post, retrieve, and manage comments on content
- **Search Functionality**: Advanced content search capabilities
- **Tag System**: Content categorization and tagging
- **IPFS Integration**: Decentralized storage for content metadata
- **Multi-Database Support**: SQLite, PostgreSQL, and Redis support
- **Blockchain Integration**: Solana and Ethereum wallet support

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Databases**: SQLite, PostgreSQL, Redis
- **Authentication**: JWT with Web3 signature verification
- **Blockchain**: Solana Web3.js, Ethers.js
- **Storage**: IPFS integration
- **Logging**: Winston with Loki support
- **Testing**: Jest
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (for development)
- PostgreSQL (for production)
- Redis (optional, for caching)
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd seek-backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

### 3. Database Setup

The application will automatically create SQLite tables on startup. For PostgreSQL:

```bash
# Create database
createdb seek_db

# Run migrations (if any)
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t seek-backend .

# Run the container
docker run -p 8000:8000 --env-file .env seek-backend
```

## 📚 API Documentation

### Authentication Endpoints

#### `GET /api/v1/auth/get_auth_message`
Get authentication message for signature verification.

**Query Parameters:**
- `publicKey` (string, required): User's public key

**Response:**
```json
{
  "message": "Sign this message to authenticate: ...",
  "timestamp": 1234567890
}
```

#### `GET /api/v1/auth/verify_signature`
Verify user signature and authenticate.

**Query Parameters:**
- `publicKey` (string, required): User's public key
- `signature` (string, required): Signed message
- `message` (string, required): Original message

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "publicKey": "user-public-key",
    "points": 100
  }
}
```

### Content Endpoints

#### `POST /api/v1/content/add_content`
Add new content to the platform.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Body:**
```json
{
  "title": "Content Title",
  "description": "Content description",
  "metadataCID": "ipfs-cid",
  "tags": ["tag1", "tag2"]
}
```

#### `GET /api/v1/content/get_content_information`
Get content information by metadata CID.

**Query Parameters:**
- `metadataCID` (string, required): IPFS CID of content metadata

#### `GET /api/v1/content/explore_content`
Explore content with filters.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `tags` (string, optional): Comma-separated tags
- `sortBy` (string, optional): Sort field (votes, date, etc.)

#### `POST /api/v1/content/post_comment`
Post a comment on content.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Body:**
```json
{
  "contentId": "content-id",
  "comment": "Comment text"
}
```

#### `GET /api/v1/content/upvote_content`
Upvote content.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `contentId` (string, required): Content ID

#### `GET /api/v1/content/downvote_content`
Downvote content.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `contentId` (string, required): Content ID

### Search Endpoints

#### `GET /api/v1/search/search_content`
Search for content.

**Query Parameters:**
- `query` (string, required): Search query
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

### User Endpoints

#### `GET /api/v1/user/get_profile`
Get user profile information.

**Headers:**
- `Authorization: Bearer <jwt-token>`

#### `GET /api/v1/user/get_tagged_content`
Get content tagged by user.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `tags` (string, required): Comma-separated tags

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📦 Build

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── index.ts              # Server entry point
├── config/               # Configuration files
├── controller/           # Route controllers
│   ├── authentication/   # Auth controllers
│   ├── content/         # Content controllers
│   ├── search/          # Search controllers
│   └── user/            # User controllers
├── db/                   # Database operations
│   ├── connect/         # Database connections
│   ├── content/         # Content DB operations
│   ├── search/          # Search DB operations
│   ├── sqlite/          # SQLite specific operations
│   ├── tag/             # Tag DB operations
│   └── user/            # User DB operations
├── middlewares/          # Express middlewares
│   ├── authenticator.ts # JWT authentication
│   ├── error/           # Error handling
│   ├── getNetwork.ts    # Network detection
│   ├── validate.ts      # Request validation
│   └── validators/      # Validation schemas
├── routes/              # API routes
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🔐 Security

- JWT-based authentication
- Web3 signature verification
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- Environment variable protection

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `8000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `SQLITE_DATABASE` | SQLite database file | `hashx.db` |
| `REDIS_URL` | Redis connection URL | - |
| `IPFS_API_URL` | IPFS API endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

