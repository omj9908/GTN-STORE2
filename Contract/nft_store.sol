// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";


contract NFTStore is ERC721URIStorage, ERC721Enumerable, Ownable {
    IERC20 public gtnToken;  // GTN 토큰 (ERC20)
    uint256 private _tokenIds;  // NFT ID 카운터
    mapping(uint256 => uint256) public nftPrices; // NFT 가격 (NFT ID => 가격)
    mapping(uint256 => bool) public isNFTForSale; // NFT 판매 여부 (NFT ID => bool)

    event NFTMinted(address indexed owner, uint256 tokenId, string metadataURI);
    event NFTPurchased(address indexed buyer, uint256 tokenId, uint256 price);

    constructor(address gtnTokenAddress) ERC721("GameNFT", "GNFT") {
        gtnToken = IERC20(gtnTokenAddress);
    }

    // ✅ NFT 민팅 (관리자 전용)
    function mintNFT(string memory metadataURI, uint256 price) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);
        nftPrices[newItemId] = price;
        isNFTForSale[newItemId] = true;

        emit NFTMinted(msg.sender, newItemId, metadataURI);
        return newItemId;
    }

    // ✅ NFT 구매 (GTN 사용)
    function buyNFT(uint256 tokenId) external {
        require(isNFTForSale[tokenId], "NFT is not for sale");
        require(nftPrices[tokenId] > 0, "NFT price not set");
        require(gtnToken.balanceOf(msg.sender) >= nftPrices[tokenId], "Insufficient GTN balance");

        // ✅ 구매자가 NFT를 구매하기 전에 반드시 approve()를 호출해야 함
        uint256 allowance = gtnToken.allowance(msg.sender, address(this));
        require(allowance >= nftPrices[tokenId], "GTNToken approval required");

        // ✅ GTN 토큰 전송 (사용자 → 계약 소유자)
        gtnToken.transferFrom(msg.sender, owner(), nftPrices[tokenId]);

        // ✅ NFT 전송 (계약 소유자 → 사용자)
        _transfer(owner(), msg.sender, tokenId);
        isNFTForSale[tokenId] = false;  // NFT 판매 완료 처리

        emit NFTPurchased(msg.sender, tokenId, nftPrices[tokenId]);
    }

    // ✅ 현재 판매 중인 NFT 목록 조회
    function getNFTsForSale() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (isNFTForSale[i]) {
                count++;
            }
        }

        uint256[] memory availableNFTs = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (isNFTForSale[i]) {
                availableNFTs[index] = i;
                index++;
            }
        }

        return availableNFTs;
    }

    // ✅ 사용자가 보유한 NFT 목록 조회
    function getOwnedNFTs(address user) external view returns (uint256[] memory) {
        uint256 count = balanceOf(user);
        uint256[] memory ownedNFTs = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            ownedNFTs[i] = tokenOfOwnerByIndex(user, i);
        }

        return ownedNFTs;
    }

    // ✅ 필수 오버라이딩 (ERC721Enumerable, ERC721URIStorage 충돌 방지)
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
