# Tip Functionality Setup Guide

This guide explains how to set up and use the tip functionality in the Seek frontend.

## Overview

The tip functionality allows users to send FIL tips to content creators through a smart contract. The system includes:

1. **TipModal Component** - A modal for entering tip amounts
2. **useTip Hook** - Custom hook using wagmi for smart contract interactions
3. **Smart Contract Integration** - Handles tip transactions and fee calculations

## Smart Contract Setup

### 1. Deploy the Tip Contract

Deploy the provided Tip contract to your desired network:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Tip {
    // ... (contract code provided by user)
}
```

### 2. Update Contract Address

After deployment, update the contract address in `src/lib/constants.ts`:

```typescript
export const TIP_CONTRACT_ADDRESS = '0x...'; // Your deployed contract address
```

### 3. Network Configuration

Configure your supported networks in `src/lib/constants.ts`:

```typescript
export const SUPPORTED_NETWORKS = {
    1: {
        name: 'Ethereum',
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
        blockExplorer: 'https://etherscan.io'
    },
    // Add other networks as needed
};
```

## Features

### Tip Modal
- **Amount Input**: Users can enter tip amounts in FIL
- **Fee Calculation**: Real-time calculation of platform fees (1%)
- **Transaction Confirmation**: Shows transaction hash and waits for confirmation
- **Error Handling**: Displays user-friendly error messages

### Smart Contract Functions
- `sendTip(address recipient)` - Send tip to recipient
- `calculateFee(uint256 amount)` - Calculate platform fee
- `getPlatformFeePercentage()` - Get platform fee percentage

## Usage

### For Users
1. Navigate to any content detail page
2. Click the "💰 Tip" button
3. Enter the tip amount in FIL in the modal
4. Review the fee breakdown
5. Click "Send Tip" to confirm the transaction

### For Developers
The tip functionality is integrated into the `ContentDetail` component using wagmi hooks:

```typescript
import { TipModal } from '../components/TipModal';
import { useTip } from '../hooks/useTip';

// In your component
const [isTipModalOpen, setIsTipModalOpen] = useState(false);

// Open modal
const handleTip = () => {
    if (!isAuthenticated) {
        alert('Please connect your wallet to tip');
        return;
    }
    setIsTipModalOpen(true);
};

// Render modal
<TipModal
    isOpen={isTipModalOpen}
    onClose={() => setIsTipModalOpen(false)}
    recipientAddress={content.public_key}
    recipientName={content.title}
/>
```

The `useTip` hook provides:
- `sendTip(recipient, amount)` - Send tip transaction
- `calculateFee(amount)` - Calculate platform fees
- `validateAmount(amount)` - Validate tip amount
- `validateAddress(address)` - Validate recipient address
- Transaction state management (loading, success, error)

## Dependencies

The tip functionality requires:
- `wagmi` - For smart contract interactions and wallet connection (already included)
- `@rainbow-me/rainbowkit` - For wallet UI (already included)
- `ethers` - For utility functions (parseEther, formatEther)

## Security Considerations

1. **Contract Address Validation**: Always verify the contract address before deployment
2. **Network Validation**: Ensure users are on the correct network
3. **Amount Validation**: Validate tip amounts on both frontend and smart contract
4. **Error Handling**: Provide clear error messages for failed transactions

## Testing

### Local Development
1. Deploy the contract to a local network (Hardhat, Ganache)
2. Update the contract address in constants
3. Test tip functionality with test accounts

### Production
1. Deploy to mainnet or desired network
2. Update contract address and network configuration
3. Test with small amounts first

## Troubleshooting

### Common Issues
1. **"Contract not initialized"** - Check if wallet is connected
2. **"Invalid recipient address"** - Verify the recipient address format
3. **"Transaction failed"** - Check user's FIL balance and gas fees
4. **"Failed to calculate fee"** - Verify contract deployment and ABI
5. **"Cannot use 'in' operator"** - This was fixed by using proper ABI format instead of string format

### Debug Steps
1. Check browser console for errors
2. Verify contract address in constants
3. Ensure wallet is connected to correct network
4. Check if contract functions are accessible

## Future Enhancements

Potential improvements:
- Support for multiple tokens (ERC-20)
- Tip history and analytics
- Batch tipping functionality
- Social features (public/private tips)
- Integration with content analytics 