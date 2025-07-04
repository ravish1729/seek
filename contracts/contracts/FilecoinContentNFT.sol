// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/**
 * @title FilecoinContentNFT
 * @dev NFT contract for Filecoin content labeling with marketplace functionality
 * Ensures one NFT per unique data CID to prevent duplicate minting
 */
contract FilecoinContentNFT is ERC721, Ownable, ReentrancyGuard {
    
    uint256 private _currentTokenId;
    
    // Mapping from data CID to token ID (prevents duplicate minting)
    mapping(string => uint256) public cidToTokenId;
    
    // Mapping from data CID to existence check
    mapping(string => bool) public cidExists;
    
    // Mapping for marketplace listings
    mapping(uint256 => MarketItem) public marketItems;
    
    // Mapping from token ID to URI
    mapping(uint256 => string) private _tokenURIs;
    
    struct MarketItem {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isListed;
        uint256 listedAt;
    }
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    address public feeRecipient;
    
    // Events
    event ContentTagged(
        uint256 indexed tokenId,
        string indexed dataCid,
        address indexed tagger,
        string metadataUri
    );
    
    event MarketItemListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event MarketItemSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    
    event MarketItemDelisted(uint256 indexed tokenId, address indexed seller);
    
    constructor(
        string memory name,
        string memory symbol,
        address _feeRecipient
    ) ERC721(name, symbol) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Mint NFT for tagged content
     * @param dataCid The CID of the actual data being tagged
     * @param metadataUri URI pointing to the NFT metadata (JSON)
     */
    function mintContentNFT(
        string memory dataCid,
        string memory metadataUri
    ) public returns (uint256) {
        require(bytes(dataCid).length > 0, "Data CID cannot be empty");
        require(!cidExists[dataCid], "Content with this CID already minted");
        
        _currentTokenId++;
        uint256 tokenId = _currentTokenId;
        
        // Mark CID as used
        cidExists[dataCid] = true;
        cidToTokenId[dataCid] = tokenId;
        
        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = metadataUri;
        
        emit ContentTagged(tokenId, dataCid, msg.sender, metadataUri);
        
        return tokenId;
    }
    
    /**
     * @dev List NFT for sale in marketplace
     */
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can list");
        require(price > 0, "Price must be greater than 0");
        require(!marketItems[tokenId].isListed, "Item already listed");
        
        marketItems[tokenId] = MarketItem({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isListed: true,
            listedAt: block.timestamp
        });
        
        emit MarketItemListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Remove NFT from marketplace
     */
    function delistFromSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can delist");
        require(marketItems[tokenId].isListed, "Item not listed");
        
        delete marketItems[tokenId];
        
        emit MarketItemDelisted(tokenId, msg.sender);
    }
    
    /**
     * @dev Purchase NFT from marketplace
     */
    function purchaseNFT(uint256 tokenId) public payable nonReentrant {
        MarketItem memory item = marketItems[tokenId];
        require(item.isListed, "Item not for sale");
        require(msg.value >= item.price, "Insufficient payment");
        require(msg.sender != item.seller, "Cannot buy your own item");
        
        address seller = item.seller;
        uint256 price = item.price;
        
        // Remove from marketplace
        delete marketItems[tokenId];
        
        // Calculate fees and royalties
        uint256 platformFeeAmount = (price * platformFee) / 10000;
        
        uint256 sellerAmount = price - platformFeeAmount;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Distribute payments
        if (platformFeeAmount > 0) {
            payable(feeRecipient).transfer(platformFeeAmount);
        }
        
        payable(seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit MarketItemSold(tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Check if a data CID is already minted
     */
    function isCidMinted(string memory dataCid) public view returns (bool) {
        return cidExists[dataCid];
    }
    
    /**
     * @dev Get token ID by data CID
     */
    function getTokenIdByCid(string memory dataCid) public view returns (uint256) {
        require(cidExists[dataCid], "CID not minted");
        return cidToTokenId[dataCid];
    }
    
    /**
     * @dev Get all listed items (for marketplace frontend)
     */
    function getListedItems() public view returns (MarketItem[] memory) {
        uint256 totalItems = _currentTokenId;
        uint256 listedCount = 0;
        
        // Count listed items
        for (uint256 i = 1; i <= totalItems; i++) {
            if (marketItems[i].isListed) {
                listedCount++;
            }
        }
        
        MarketItem[] memory listedItems = new MarketItem[](listedCount);
        uint256 currentIndex = 0;
        
        // Populate listed items
        for (uint256 i = 1; i <= totalItems; i++) {
            if (marketItems[i].isListed) {
                listedItems[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        
        return listedItems;
    }
    
    /**
     * @dev Get current token supply
     */
    function totalSupply() public view returns (uint256) {
        return _currentTokenId;
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _platformFee) public onlyOwner {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _platformFee;
    }
    
    /**
     * @dev Update fee recipient (only owner)
     */
    function setFeeRecipient(address _feeRecipient) public onlyOwner {
        require(_feeRecipient != address(0), "Invalid address");
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Override functions required by Solidity
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        
        // If token is being burned (to == address(0)), clean up mappings
        if (to == address(0)) {
            delete marketItems[tokenId];
            delete _tokenURIs[tokenId];
        }
        
        return previousOwner;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(tokenId > 0 && tokenId <= _currentTokenId, "Token does not exist");
        return _tokenURIs[tokenId];
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
