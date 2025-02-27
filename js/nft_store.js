// ✅ NFT 스마트 컨트랙트 정보
const NFT_CONTRACT_ADDRESS = "0xd62c0a871e83823f9cf532cc4111d427749efaa1"; 
const GTN_CONTRACT_ADDRESS = "0x5ab031d4438d07ca4376724c362ce06bd0c2c66c"; 
const GANACHE_RPC_URL = "http://127.0.0.1:8545"; 

// ✅ ethers.js 제공자 설정 (Ganache + MetaMask)
const ganacheProvider = new ethers.providers.JsonRpcProvider(GANACHE_RPC_URL);
let provider, signer, nftContract, gtnContract, currentAccount;
let isWalletConnected = false;

// ✅ NFT 및 GTN 컨트랙트 ABI
const ABI_NFT = [
    {
        "inputs": [{"internalType": "address", "name": "gtnTokenAddress", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "tokenURI", "type": "string"},
                   {"internalType": "uint256", "name": "price", "type": "uint256"}],
        "name": "mintNFT",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const ABI_GTN = [
    {
        "inputs": [{"internalType": "uint256", "name": "initialSupply", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{"internalType": "address", "name": "recipient", "type": "address"},
                   {"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// ✅ Ganache Provider로 읽기 전용 컨트랙트 연결
const nftContractReadOnly = new ethers.Contract(NFT_CONTRACT_ADDRESS, ABI_NFT, ganacheProvider);
const gtnContractReadOnly = new ethers.Contract(GTN_CONTRACT_ADDRESS, ABI_GTN, ganacheProvider);

// ✅ MetaMask 연결 함수
async function connectWallet() {
    if (isWalletConnected) {
        console.log("🔄 이미 MetaMask와 연결됨.");
        return;
    }

    if (!window.ethereum) {
        alert("🚨 MetaMask가 설치되지 않았습니다! 먼저 MetaMask를 설치하세요.");
        return;
    }

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();

        if (accounts.length === 0) {
            throw new Error("🚨 MetaMask에서 계정을 선택해야 합니다!");
        }

        currentAccount = accounts[0].toLowerCase();
        signer = provider.getSigner();
        nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, ABI_NFT, signer);
        gtnContract = new ethers.Contract(GTN_CONTRACT_ADDRESS, ABI_GTN, signer);

        console.log("✅ MetaMask 연결 완료:", currentAccount);
        isWalletConnected = true;

        await checkAdmin();
        await loadNFTs();
    } catch (error) {
        console.error("🚨 MetaMask 연결 실패:", error);
    }
}

// ✅ 네트워크 확인
async function checkNetwork() {
    if (!provider) {
        console.error("🚨 provider가 설정되지 않았습니다!");
        return;
    }

    try {
        const network = await provider.getNetwork();
        if (network.chainId !== 1337) {
            alert("🚨 MetaMask가 올바른 네트워크 (Ganache 1337)에 연결되지 않았습니다!");
        }
    } catch (error) {
        console.error("🚨 네트워크 감지 실패:", error);
    }
}

// ✅ 관리자 확인
async function checkAdmin() {
    try {
        const ownerAddress = await nftContractReadOnly.owner();
        if (currentAccount.toLowerCase() === ownerAddress.toLowerCase()) {
            document.getElementById("admin-panel").style.display = "block";
            document.getElementById("user-panel").style.display = "none";
        } else {
            document.getElementById("admin-panel").style.display = "none";
            document.getElementById("user-panel").style.display = "block";
        }
    } catch (error) {
        console.error("🚨 관리자 확인 실패:", error);
    }
}

// ✅ NFT 민팅
async function mintNFT() {
    if (!signer) return alert("먼저 MetaMask를 연결하세요!");

    const metadataURI = document.getElementById("metadataURI").value;
    const price = ethers.utils.parseUnits(document.getElementById("price").value, 18);

    try {
        const tx = await nftContract.mintNFT(metadataURI, price);
        await tx.wait();
        alert("✅ NFT 민팅 완료!");
        loadNFTs();
    } catch (error) {
        console.error("🚨 NFT 민팅 실패:", error);
        alert("NFT 민팅 실패: " + error.message);
    }
}

// ✅ NFT 구매
async function buyNFT(tokenId) {
    if (!signer) return alert("먼저 MetaMask를 연결하세요!");

    try {
        const price = await nftContractReadOnly.nftPrices(tokenId);
        const userBalance = await gtnContract.balanceOf(currentAccount);

        if (userBalance.lt(price)) {
            alert("잔액 부족! GTN을 충전하세요.");
            return;
        }

        const allowance = await gtnContract.allowance(currentAccount, NFT_CONTRACT_ADDRESS);
        if (allowance.lt(price)) {
            const approveTx = await gtnContract.approve(NFT_CONTRACT_ADDRESS, price);
            await approveTx.wait();
        }

        const tx = await nftContract.buyNFT(tokenId);
        await tx.wait();

        alert("✅ NFT 구매 완료!");
        loadNFTs();
    } catch (error) {
        console.error("🚨 NFT 구매 실패:", error);
        alert("NFT 구매 실패: " + error.message);
    }
}

// ✅ NFT 목록 불러오기
async function loadNFTs() {
    const nftList = document.getElementById("nftList");
    nftList.innerHTML = "";

    try {
        const tokenIds = await nftContractReadOnly.getOwnedNFTs();

        for (const tokenId of tokenIds) {
            const metadataURI = await nftContractReadOnly.tokenURI(tokenId);
            const price = await nftContractReadOnly.nftPrices(tokenId);

            const nftItem = document.createElement("div");
            nftItem.innerHTML = `
                <img src="${metadataURI}" width="200">
                <p>ID: ${tokenId}</p>
                <p>Price: ${ethers.utils.formatUnits(price, 18)} GTN</p>
                <button onclick="buyNFT(${tokenId})">구매하기</button>
            `;
            nftList.appendChild(nftItem);
        }
    } catch (error) {
        console.error("🚨 NFT 목록 불러오기 실패:", error);
    }
}

// ✅ MetaMask 계정 변경 감지
window.ethereum?.on("accountsChanged", async (accounts) => {
    if (accounts.length === 0) {
        alert("MetaMask 연결이 해제되었습니다. 다시 로그인하세요.");
        window.location.href = "login.html";
        return;
    }

    currentAccount = accounts[0].toLowerCase();
    await connectWallet();
});

// ✅ 페이지 로드 시 자동 실행
window.onload = async function () {
    await connectWallet();
    await checkNetwork();
    await loadNFTs();
};

window.mintNFT = mintNFT;
window.buyNFT = buyNFT;
window.loadNFTs = loadNFTs;
