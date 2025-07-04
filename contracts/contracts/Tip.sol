// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Tip {
    // Platform fee percentage (1% = 100 basis points)
    uint256 public constant PLATFORM_FEE_BPS = 100;
    uint256 public constant BASIS_POINTS = 10000;
    
    // Platform owner address
    address public platformOwner;
    
    // Mapping to track total tips received by each address
    mapping(address => uint256) public totalTipsReceived;
    
    // Mapping to track total tips sent by each address
    mapping(address => uint256) public totalTipsSent;
    
    // Platform fees collected
    uint256 public totalPlatformFees;
    
    // Events
    event TipSent(
        address indexed from,
        address indexed to,
        uint256 tipAmount,
        uint256 platformFee,
        uint256 timestamp
    );
    
    event PlatformFeeWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    // Custom errors
    error InvalidTipAmount();
    error InvalidRecipient();
    error OnlyPlatformOwner();
    error InsufficientBalance();
    error TransferFailed();
    
    // Modifier to check if caller is platform owner
    modifier onlyPlatformOwner() {
        if (msg.sender != platformOwner) revert OnlyPlatformOwner();
        _;
    }
    
    constructor() {
        platformOwner = msg.sender;
    }
    
    /**
     * @dev Send a tip to another user
     * @param recipient The address to receive the tip
     */
    function sendTip(address recipient) external payable {
        if (msg.value == 0) revert InvalidTipAmount();
        if (recipient == address(0)) revert InvalidRecipient();
        if (recipient == msg.sender) revert InvalidRecipient();
        
        // Calculate platform fee
        uint256 platformFee = (msg.value * PLATFORM_FEE_BPS) / BASIS_POINTS;
        uint256 tipAmount = msg.value - platformFee;
        
        // Update tracking mappings
        totalTipsReceived[recipient] += tipAmount;
        totalTipsSent[msg.sender] += tipAmount;
        
        // Transfer tip to recipient
        (bool success, ) = recipient.call{value: tipAmount}("");
        if (!success) revert TransferFailed();
        
        emit TipSent(msg.sender, recipient, tipAmount, platformFee, block.timestamp);
    }
    
    /**
     * @dev Get total tips received by an address
     * @param user The address to query
     * @return Total tips received
     */
    function getTotalTipsReceived(address user) external view returns (uint256) {
        return totalTipsReceived[user];
    }
    
    /**
     * @dev Get total tips sent by an address
     * @param user The address to query
     * @return Total tips sent
     */
    function getTotalTipsSent(address user) external view returns (uint256) {
        return totalTipsSent[user];
    }
    
    /**
     * @dev Get user's complete tip statistics
     * @param user The address to query
     * @return received Total tips received
     * @return sent Total tips sent
     */
    function getUserTipStats(address user) external view returns (uint256 received, uint256 sent) {
        return (totalTipsReceived[user], totalTipsSent[user]);
    }
    
    /**
     * @dev Calculate platform fee for a given amount
     * @param amount The tip amount
     * @return fee The platform fee
     * @return netAmount The amount after fee deduction
     */
    function calculateFee(uint256 amount) external pure returns (uint256 fee, uint256 netAmount) {
        fee = (amount * PLATFORM_FEE_BPS) / BASIS_POINTS;
        netAmount = amount - fee;
        return (fee, netAmount);
    }
    
    /**
     * @dev Get platform fee percentage
     * @return fee percentage in basis points (100 = 1%)
     */
    function getPlatformFeePercentage() external pure returns (uint256) {
        return PLATFORM_FEE_BPS;
    }
    
    /**
     * @dev Get total platform fees collected
     * @return Total fees collected
     */
    function getTotalPlatformFees() external view returns (uint256) {
        return totalPlatformFees;
    }
    
    /**
     * @dev Withdraw platform fees (only platform owner)
     */
    function withdrawPlatformFees() external onlyPlatformOwner {
        uint256 amount = totalPlatformFees;
        if (amount == 0) revert InsufficientBalance();
        
        totalPlatformFees = 0;
        
        (bool success, ) = platformOwner.call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit PlatformFeeWithdrawn(platformOwner, amount, block.timestamp);
    }
    
    /**
     * @dev Transfer platform ownership
     * @param newOwner The new platform owner address
     */
    function transferPlatformOwnership(address newOwner) external onlyPlatformOwner {
        if (newOwner == address(0)) revert InvalidRecipient();
        platformOwner = newOwner;
    }
    
    /**
     * @dev Get contract balance
     * @return Contract's current balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Fallback function to reject direct ETH transfers
    receive() external payable {
        revert("Use sendTip function");
    }
}
