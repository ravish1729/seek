# Seek 🔍

> An incentive-based file tagging application for the Filecoin/IPFS ecosystem

[![App Link](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://seek-six.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

Seek solves the critical problem of file discovery and search in the Filecoin/IPFS ecosystem. With petabytes of data flowing into the network, finding and accessing relevant content has become increasingly challenging. Seek bridges this gap by providing an intuitive platform for content discovery, tagging, and incentivization.

### Key Benefits

- **Enhanced Filecoin Adoption**: Makes Filecoin storage more accessible to users worldwide
- **Community Socialization**: Engage with content through likes and comments
- **Incentivized Content Creation**: Rewards contributors for valuable content
- **Efficient Discovery**: Advanced search capabilities for Filecoin/IPFS content

**App Link**: [https://seek-six.vercel.app/](https://seek-six.vercel.app/)

## Features

### 🏷️ Content Tagging & Description
- Upload and describe data/public goods stored on Filecoin
- Rich metadata management for better content organization
- Community-driven content categorization

### 💰 Incentive System
- **Tipping Mechanism**: Community can tip contributors with FIL tokens
- **Search Revenue**: Contributors earn revenue when their tagged content appears in searches
- **Smart Contract Integration**: Transparent and automated reward distribution

### ❤️ Likes and Comments
- Like and upvote valuable content to show appreciation
- Comment system for community discussions and feedback
- Community-driven content curation through interactions

## How It Works

### Architecture Overview

1. **Content Upload & Storage**
   - Metadata is converted to JSON format
   - Stored permanently on Lighthouse (Filecoin storage)
   - Local database maintains search indexes for efficiency

2. **Smart Contract Integration**
   - FVM (Filecoin Virtual Machine) for Tip contract deployment
   - RainbowKit for seamless wallet interactions

3. **Search & Discovery**
   - Real-time search across indexed content
   - Revenue generation for content contributors
   - Community-driven content curation

## Tech Stack

### Frontend
- **React** - Modern UI framework
- **RainbowKit** - Wallet connection and interaction
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - Server runtime
- **TypeScript** - Type-safe development
- **SQLite** - Database management
- **Redis** - Caching layer

### Blockchain
- **Filecoin** - Decentralized storage
- **FVM** - Smart contract execution
- **Lighthouse** - Permanent metadata storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Filecoin wallet (for tipping functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/seek.git
   cd seek
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd seek-frontend
   npm install

   # Backend
   cd ../seek-backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start the application**
   ```bash
   # Start backend
   cd seek-backend
   npm run dev

   # Start frontend (in new terminal)
   cd seek-frontend
   npm run dev
   ```

## Usage

### For Content Creators
1. Connect your wallet using RainbowKit
2. Upload your content to Filecoin/IPFS
3. Add descriptions and tags on Seek
4. Earn tips and search revenue from the community

### For Content Consumers
1. Search for relevant content using keywords or tags
2. Access and download content directly from Filecoin/IPFS
3. Tip creators for valuable contributions
4. Use content in your Web2/Web3 projects

## Roadmap

- [ ] Add data pools, for community to create their own dataset
- [ ] Convert your content into a data NFT
- [ ] Community governance features

---

**Built with ❤️ for the Filecoin ecosystem**
