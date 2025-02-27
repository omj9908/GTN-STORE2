const CONTRACT_ADDRESS = "0x5ab031d4438d07ca4376724c362ce06bd0c2c66c";
const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			}
		],
		"name": "buyItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ItemBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ItemPriceSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mintGTN",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "setItemPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getPurchaseHistory",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "itemPrices",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "purchaseHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider, signer, contract, currentAccount;

let isWalletConnected = false;

if (window.location.pathname !== "/game.html") {
    connectWallet();  // 🔹 `await`을 제거 (top-level await 사용 불가 문제 해결)
}

export async function ensureContractInitialized() {  // ✅ export 추가
    if (!contract) {
        console.warn("🚨 contract가 초기화되지 않음. Metamask 연결을 시도합니다.");
        await connectWallet();
    }
}

export function getEquippedSkins() {
    let skins = JSON.parse(localStorage.getItem("equippedSkins")) || [];
    console.log("📦 getEquippedSkins() 반환값:", skins);

    // ✅ items.json에서 해당 스킨의 title을 추가
    const items = [
		{ "id": 100, "title": "desert", "cost": 30, "src": "https://example.com/desert.jpg" },
		{ "id": 101, "title": "snowy_mountain", "cost": 30, "src": "https://example.com/snowy_mountai.jpg" },
		{ "id": 102, "title": "forest_map", "cost": 25, "src": "https://example.com/forest_map.jpg" },
		{ "id": 103, "title": "volcano", "cost": 40, "src": "https://example.com/volcano.jpg" }
		
    ];

    // 🛑 equippedSkins 값이 비어있으면 기본값 설정
    if (skins.length === 0) {
        console.warn("⚠️ equippedSkins 데이터가 없습니다! 기본값(normal_dice) 사용");
        skins = [{ id: 0, title: "normal_dice" }];
        localStorage.setItem("equippedSkins", JSON.stringify(skins));
    }

    return skins.map(skin => {
        let matchingItem = items.find(item => item.id === skin.id);
        return { ...skin, title: matchingItem ? matchingItem.title : "unknown_dice" };
    });
}


async function initializeSolPage() {
    console.log("🔄 sol.html 초기화 중...");

    if (typeof ensureContractInitialized !== "undefined") {
        await ensureContractInitialized();
        console.log("✅ contract가 초기화됨.");
    } else {
        console.warn("⚠️ ensureContractInitialized가 정의되지 않았습니다. connectWallet을 실행합니다.");
        await connectWallet();
    }
}

async function connectWallet() {
    if (isWalletConnected) {
        console.log("🔄 이미 MetaMask와 연결됨.");
        return;
    }

    if (!window.ethereum) {
        alert("MetaMask가 설치되어 있지 않습니다!");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length === 0) {
        alert("메타마스크 계정을 선택해야 합니다!");
        return;
    }

    const storedAccount = localStorage.getItem("userAccount");
    const metaMaskAccount = accounts[0].toLowerCase();

    if (!storedAccount) {
        alert("로그인이 필요합니다!");
        window.location.href = "login.html";
        return;
    }

    if (storedAccount.toLowerCase() !== metaMaskAccount) {
        alert(`⚠️ 로그인한 계정(${storedAccount})과 MetaMask 계정(${metaMaskAccount})이 다릅니다.`);
        return;
    }

    signer = provider.getSigner(metaMaskAccount);
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    console.log(`✅ MetaMask 연결 완료: ${metaMaskAccount}`);
    isWalletConnected = true; 

    await checkBalance();
    await checkAdmin();
    await loadPurchaseHistory();
}

async function checkLogin() {
    const storedAccount = localStorage.getItem("userAccount");

    if (!storedAccount) {
        window.location.href = "login.html";
    } else {
        await connectWallet(); 
    }
}

function logout() {
    localStorage.removeItem("userAccount");
    alert("로그아웃 되었습니다.");
    window.location.href = "login.html";
}

async function buyItem(itemId) {
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    try {
        console.log(`🛒 아이템(${itemId}) 구매 시도 중...`);

        const tx = await contract.buyItem(itemId);
        await tx.wait();

        console.log(`✅ 아이템(${itemId}) 구매 완료!`);
        alert("✅ 주사위 구매 완료!");

        const walletAddress = await signer.getAddress();

        const response = await fetch("http://localhost:3000/api/buy-skin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress, itemId }),
        });

        const data = await response.json();
        console.log("🔍 서버 응답:", data);

        if (data.success) {
            await loadPurchaseHistory();
            await displayDices();
        } else {
            console.error("🚨 서버 오류:", data.message);
        }
    } catch (error) {
        console.error("🚨 구매 실패:", error);
        alert("구매 실패: " + error.message);
    }
}


if (typeof window.displayDices === "undefined") {
    window.displayDices = async function () {
        console.log("displayDices() 실행됨");

        const items = await loadItems();
        if (!items || items.length === 0) {
            console.warn("아이템 데이터가 없습니다. JSON 파일을 확인하세요.");
            return;
        }

        const purchasedSkins = await loadPurchasedSkins();  // 🔥 최신 구매 내역 반영
        console.log("최신 구매한 스킨 목록:", purchasedSkins);

        const container = document.getElementById("diceList");
        if (!container) {
            console.error("diceList' 요소를 찾을 수 없음. HTML을 확인하세요.");
            return;
        }

        container.innerHTML = "";

        for (const dice of items) {
            let price = "불러오는 중...";
            if (window.getItemPrice) {
                price = await window.getItemPrice(dice.id);
            }

            const isPurchased = purchasedSkins.includes(dice.id);
            const isEquipped = equippedSkins.includes(dice.id);
            const buttonLabel = isEquipped ? "장착 해제" : isPurchased ? "장착하기" : "구매하기";
            const buttonAction = isEquipped ? `unSkin(${dice.id})` : isPurchased ? `equipSkin(${dice.id})` : `buyItem(${dice.id})`;

            const card = document.createElement("div");
            card.className = "dice-card";
            card.innerHTML = `
                <img src="${dice.src}" alt="${dice.title}">
                <h3>${dice.title}</h3>
                <p>가격: ${price}</p>
                <button id="skin-btn-${dice.id}" onclick="${buttonAction}">${buttonLabel}</button>
            `;
            container.appendChild(card);
        }

        console.log("주사위 리스트 최신화 완료");
    };
}

let isAdminChecked = false;

async function checkAdmin() {
    if (isAdminChecked) {
        return; 
    }

    if (!contract || !signer) {
        console.warn("🚨 contract 또는 signer가 설정되지 않음. MetaMask 연결을 먼저 수행합니다.");
        await connectWallet();
    }

    try {
        const currentAccount = await signer.getAddress();
        const ownerAddress = await contract.owner();

        const getGTNButton = document.getElementById("getGTN");

        if (currentAccount.toLowerCase() !== ownerAddress.toLowerCase()) {
            getGTNButton.style.display = "block"; 
        } else {
            getGTNButton.style.display = "none";
        }

        isAdminChecked = true; 
    } catch (error) {
        console.error("🚨 관리자 확인 실패:", error);
    }
}


// 🔹 GTN 지급 (mintGTN 호출)
async function requestGTN() {
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    const connectedAccounts = await provider.send("eth_requestAccounts", []);
    if (connectedAccounts.length === 0) {
        alert("메타마스크 계정을 선택해야 합니다!");
        return;
    }

    let recipientInput = document.getElementById("customAccount"); 
    let recipient = recipientInput ? recipientInput.value.trim() : null;
    const currentAccount = connectedAccounts[0];

    if (!recipient) {
        recipient = currentAccount;  // 입력한 값이 없으면 현재 MetaMask 계정 사용
    }

    try {
        console.log(`🚀 ${recipient}에게 100 GTN 전송 중...`);
        
        const tx = await contract.mintGTN(recipient, ethers.utils.parseUnits("100", 18));
        await tx.wait();

        alert(`✅ ${recipient}에게 100 GTN 전송 완료!`);
        checkBalance(recipient);
        await addGTNToMetaMask();
    } catch (error) {
        console.error("🚨 GTN 전송 실패:", error);
        alert("GTN 전송 실패: " + error.message);
    }
}


// 🔹 MetaMask에 GTN 토큰 자동 추가
async function addGTNToMetaMask() {
    if (!window.ethereum) {
        alert("MetaMask가 필요합니다!");
        return;
    }

    try {
        const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: CONTRACT_ADDRESS,
                    symbol: "GTN",
                    decimals: 18,
                    image: "https://gateway.pinata.cloud/ipfs/QmSr7KSnGs25KJpDWksGPqGjsBMGABCTkBUVKozyoCnaMY" 
                }
            }
        });

        if (wasAdded) {
            console.log("✅ MetaMask에 GTN 토큰이 추가되었습니다!");
            alert("✅ MetaMask에 GTN 토큰이 추가되었습니다!");
        } else {
            console.log("❌ MetaMask에서 GTN 토큰 추가가 거부되었습니다.");
        }
    } catch (error) {
        console.error("🚨 MetaMask에 GTN 토큰 추가 실패:", error);
        alert("MetaMask에 GTN 토큰 추가 실패: " + error.message);
    }
}

// 🔹 GTN 잔액 조회
async function checkBalance() {
    if (!contract || !signer) {
        console.warn("🚨 contract 또는 signer가 설정되지 않음. MetaMask 연결을 먼저 수행합니다.");
        await connectWallet();
    }

    try {
        const userAddress = await signer.getAddress();
        const balance = await contract.balanceOf(userAddress);
        document.getElementById("balance").innerText = `잔액: ${ethers.utils.formatUnits(balance, 18)} GTN`;
    } catch (error) {
        console.error("🚨 잔액 조회 실패:", error);
        alert("잔액 조회 실패: " + error.message);
    }
}

async function loadItems() {
    try {
        const response = await fetch("items2.json");
        if (!response.ok) throw new Error("아이템 데이터를 불러오는데 실패했습니다.");

        const data = await response.json();
        console.log("✅ items2.json 데이터 로드 성공:", data);
        return data;
    } catch (error) {
        console.error("🚨 items2.json 데이터 로드 실패:", error);
        return [];
    }
}


let equippedSkin = null;

function loadEquippedSkin() {
    const storedSkin = localStorage.getItem("equippedSkin");
    equippedSkin = storedSkin ? JSON.parse(storedSkin) : null;

    if (equippedSkin) {
        equippedSkins = [equippedSkin];
    }
}

async function updateSkinButtons() {
    console.log("🔄 스킨 버튼 업데이트 시작");

    let walletAddress;
    try {
        walletAddress = (await signer.getAddress()).toLowerCase();
    } catch (error) {
        console.error("🚨 walletAddress 가져오기 실패:", error);
        return;
    }

    // ✅ API 경로 확인 (존재하는 경로로 변경해야 함)
    let apiUrl = "http://localhost:3000/api/get-purchased-skins"; // 서버에서 확인 필요
    let purchasedSkins = [];

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress }),
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const purchasedData = await response.json();
        console.log("📦 구매한 스킨 데이터:", purchasedData);

        if (!purchasedData.success) {
            console.error("🚨 구매한 스킨을 가져오지 못했습니다:", purchasedData.message);
            return;
        }

        purchasedSkins = purchasedData.purchasedSkins || [];
    } catch (error) {
        console.error(`🚨 구매한 스킨 API 호출 실패: ${error.message}`);
        return;
    }

    // ✅ 현재 장착된 스킨 불러오기
    const equippedSkins = JSON.parse(localStorage.getItem("equippedSkins")) || [];
    console.log("🎭 현재 장착된 스킨:", equippedSkins);

    // ✅ 모든 스킨 버튼을 업데이트
    document.querySelectorAll("[id^='skin-btn-']").forEach(button => {
        const skinId = parseInt(button.getAttribute("data-skin-id"));

        if (isNaN(skinId)) {
            console.error(`🚨 버튼에 연결된 잘못된 skinId: ${skinId}`);
            return;
        }

        // ✅ 구매한 스킨인지 확인
        if (purchasedSkins.includes(skinId)) {
            // 현재 장착된 스킨이면 "장착 해제", 아니면 "장착하기" 버튼 표시
            if (equippedSkins.length > 0 && equippedSkins[0].id === skinId) {
                button.innerText = "장착 해제";
                button.setAttribute("onclick", `unSkin(${skinId})`);
            } else {
                button.innerText = "장착하기";
                button.setAttribute("onclick", `equipSkin(${skinId})`);
            }
        } else {
            // ✅ 구매하지 않은 스킨은 "구매 필요" 버튼 표시
            button.innerText = "구매 필요";
            button.setAttribute("onclick", `alert('🚨 이 스킨을 구매해야 사용할 수 있습니다!')`);
        }
    });

    console.log("✅ 스킨 버튼 업데이트 완료!");
}


// 장착하기 리스트
let equippedSkins = []; 

async function equipSkin(skinId) {
    const items = await loadItems();
    const selectedSkin = items.find(item => item.id === skinId);

    if (!selectedSkin) {
        console.error(`🚨 스킨 ID ${skinId}에 해당하는 아이템을 찾을 수 없습니다.`);
        alert("스킨 정보를 찾을 수 없습니다.");
        return;
    }

    const skinTitle = selectedSkin.title || "기본 스킨"; // ✅ title이 없을 경우 기본값 설정
    console.log(`🎭 스킨 장착: ID ${skinId}, Title ${skinTitle}`);

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
        alert("지갑이 연결되지 않았습니다!");
        return;
    }

    const walletAddress = accounts[0].toLowerCase();

    try {
        // ✅ 기존 장착된 스킨 확인 후 해제
        const checkResponse = await fetch("http://localhost:3000/api/get-skins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress }),
        });

        const checkData = await checkResponse.json();
        console.log(`🔍 현재 장착된 스킨 확인:`, checkData);

        if (checkData.success && checkData.equippedSkin && checkData.equippedSkin.id !== null) {
            if (checkData.equippedSkin.id === skinId) {
                alert(`이미 '${skinTitle}' 스킨이 장착되어 있습니다.`);
                return;
            }

            const confirmUnEquip = confirm(
                `이미 '${checkData.equippedSkin.title}' 스킨이 장착되어 있습니다.\n` +
                `새로운 스킨을 장착하려면 기존 스킨을 해제해야 합니다. 계속하시겠습니까?`
            );

            if (!confirmUnEquip) return;

            // ✅ 기존 스킨 해제 요청
            await unSkin();
        }

        // ✅ 새로운 스킨 장착
        const response = await fetch("http://localhost:3000/api/equip-skin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress, skinId, skinTitle })
        });

        const result = await response.json();
        console.log(`✅ 서버 응답 데이터:`, result);

        if (result.success) {
            alert(result.message);

            // ✅ localStorage 업데이트
            localStorage.setItem("equippedSkins", JSON.stringify([{ id: skinId, title: skinTitle }]));

            // ✅ storage 이벤트 트리거
            window.dispatchEvent(new Event("storage"));

            // ✅ 버튼 상태 즉시 업데이트
            updateSkinButtons();

            // ✅ 버튼 직접 수정 (즉시 반영)
            const button = document.getElementById(`skin-btn-${skinId}`);
            if (button) {
                button.innerText = "장착 해제";
                button.setAttribute("onclick", `unSkin(${skinId})`);
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("🚨 스킨 장착 실패:", error);
        alert("스킨 장착 중 오류가 발생했습니다.");
    }
}

async function unSkin() {
    console.log("🎭 스킨 장착 해제 시도 중...");

    if (!signer) {
        console.error("🚨 MetaMask가 연결되지 않음!");
        alert("MetaMask를 연결해주세요.");
        return;
    }

    let walletAddress = await signer.getAddress();
    walletAddress = walletAddress.toLowerCase();

    console.log(`🔍 장착 해제 요청 - walletAddress: ${walletAddress}`);

    const response = await fetch("http://localhost:3000/api/un-equip-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
    });

    const data = await response.json();
    console.log("🔍 서버 응답 코드:", response.status);
    console.log("✅ 서버 응답 데이터:", data);

    if (data.success) {
        localStorage.removeItem("equippedSkins");

        // ✅ storage 이벤트 트리거
        window.dispatchEvent(new Event("storage"));

        // ✅ 버튼 상태 즉시 업데이트
        updateSkinButtons();

        // ✅ 버튼 직접 수정 (즉시 반영)
        document.querySelectorAll("[id^='skin-btn-']").forEach(button => {
            if (button.innerText === "장착 해제") {
                button.innerText = "장착하기";
                button.setAttribute("onclick", `equipSkin(${button.getAttribute("data-skin-id")})`);
            }
        });

        alert("✅ 스킨 장착 해제 성공!");
    } else {
        alert("🚨 스킨 장착 해제 실패: " + data.message);
    }
}


window.equipSkin = equipSkin;
window.unSkin = unSkin;

async function loadPurchasedSkins() {
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    const userAddress = await signer.getAddress();
    console.log(`🛍️ 사용자(${userAddress})의 구매한 스킨 불러오기...`);

    try {
        const purchasedItems = await contract.getPurchaseHistory(userAddress);

        console.log("✅ 구매한 스킨 목록:", purchasedItems);
        return purchasedItems.map(item => Number(item));
    } catch (error) {
        console.error("🚨 구매한 스킨 불러오기 실패:", error);
        return [];
    }
}

async function displayDices() {
    const items = await loadItems();
    const purchasedSkins = await loadPurchasedSkins();
    const container = document.getElementById("diceList");
    container.innerHTML = "";

    for (const dice of items) {
        let price = "불러오는 중...";
        if (window.getItemPrice) {
            price = await window.getItemPrice(dice.id);
        }

        const card = document.createElement("div");
        card.className = "dice-card";

        // 🔹 이미 구매한 스킨인지 확인
        const isPurchased = purchasedSkins.includes(dice.id);
        const isEquipped = equippedSkins.includes(dice.id);
        const buttonLabel = isEquipped ? "장착 해제" : isPurchased ? "장착하기" : "구매하기";
        const buttonAction = isEquipped ? `unSkin(${dice.id})` : isPurchased ? `equipSkin(${dice.id})` : `buyItem(${dice.id})`;

        card.innerHTML = `
            <img src="${dice.src}" alt="${dice.title}">
            <h3>${dice.title}</h3>
            <p>가격: ${price}</p>
            <button id="skin-btn-${dice.id}" onclick="${buttonAction}">${buttonLabel}</button>
        `;
        container.appendChild(card);
    }
}


// 🔹 주사위 굴리기
async function rollDice() {
    if (!window.loadItems) return alert("아이템 데이터를 불러올 수 없습니다!");
    
    const items = await loadItems();
    const diceResult = Math.floor(Math.random() * items.length);
    document.getElementById("result").innerText = `🎲 주사위 결과: ${items[diceResult].title} 선택됨!`;
}

// 🔹 아이템 가격을 스마트 컨트랙트에서 가져오는 함수 추가
async function getItemPrice(itemId) {
    if (!contract) {
        console.warn("🚨 스마트 컨트랙트가 연결되지 않았습니다! Metamask를 먼저 연결하세요.");
        return "가격 확인 불가";
    }

    try {
        const priceBN = await contract.itemPrices(itemId);
        if (priceBN.eq(0)) {
            console.warn(`🚨 경고: ID ${itemId}에 대한 가격이 0입니다.`);
            return "가격 없음";
        }

        const formattedPrice = ethers.utils.formatUnits(priceBN, 18) + " GTN";
        console.log(`🔍 컨트랙트에서 가져온 가격 (ID: ${itemId}):`, formattedPrice);
        return formattedPrice;
    } catch (error) {
        console.error(`🚨 아이템 가격 조회 실패 (ID: ${itemId}):`, error);
        return "가격 확인 불가";
    }
}

let isAccountListenerAdded = false;

async function listenForAccountChange() {
    if (!window.ethereum || isAccountListenerAdded) {
        return;
    }

    window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
            alert("MetaMask 연결이 해제되었습니다. 다시 로그인하세요.");
            localStorage.removeItem("userAccount");
            window.location.href = "login.html";
            return;
        }

        const newMetaMaskAccount = accounts[0].toLowerCase();
        const storedAccount = localStorage.getItem("userAccount");

        if (storedAccount.toLowerCase() !== newMetaMaskAccount) {
            alert(`⚠️ 로그인한 계정(${storedAccount})과 MetaMask 계정(${newMetaMaskAccount})이 다릅니다.`);
            return;
        }

        await connectWallet(); 
    });

    isAccountListenerAdded = true;
}

listenForAccountChange();

let isPurchaseHistoryLoaded = false;

async function loadPurchaseHistory() {
    if (isPurchaseHistoryLoaded) {
        return; // 🔄 이미 구매 내역을 불러왔습니다.
    }

    if (!contract) {
        console.warn("🚨 contract가 설정되지 않음. MetaMask 연결을 먼저 수행합니다.");
        await connectWallet();
    }

    try {
        const userAddress = await signer.getAddress();
        const purchasedItems = await contract.getPurchaseHistory(userAddress);

        if (!purchasedItems || purchasedItems.length === 0) {
            console.warn("🚨 구매 내역 없음."); // ✅ 한 번만 출력
            document.getElementById("purchaseList").innerHTML = "<li>구매 내역이 없습니다.</li>";
        } else {
            const list = document.getElementById("purchaseList");
            list.innerHTML = "";
            for (const itemId of purchasedItems) {
                const listItem = document.createElement("li");
                listItem.textContent = `🎲 스킨 ID: ${itemId}`;
                list.appendChild(listItem);
            }
        }

        isPurchaseHistoryLoaded = true; // ✅ 구매 내역 확인 완료 플래그
    } catch (error) {
        console.error("🚨 구매 내역 불러오기 실패:", error);
    }
}

async function debugPurchaseHistory() {
    if (!signer) {
        console.warn("signer가 설정되지 않음. MetaMask 연결을 먼저 수행합니다.");
        await connectWallet();
    }

    try {
        const userAddress = await signer.getAddress();
        const purchasedItems = await contract.getPurchaseHistory(userAddress);

        console.log("[디버깅] 현재 블록체인에서 반환된 구매 내역:", purchasedItems);
    } catch (error) {
        console.error("[디버깅 실패] 구매 내역을 가져오는 중 오류 발생:", error);
    }
}

debugPurchaseHistory();

window.loadPurchaseHistory = loadPurchaseHistory;

window.onload = async function() {
    if (window.location.pathname === "/sol.html") {
        await initializeSolPage();  // sol.html에서만 실행
    } else {
        await connectWallet(); // 다른 페이지에서 실행
    }

    await loadPurchaseHistory();
    await displayDices();
    
    loadEquippedSkin();  // 🔹 장착한 스킨 불러오기

    if (equippedSkin) {
        console.log("저장된 장착 정보 복원:", equippedSkin);
        const button = document.getElementById(`skin-btn-${equippedSkin.id}`);
        if (button) {
            button.innerText = "장착 해제";
            button.setAttribute("onclick", `unSkin(${equippedSkin.id})`);
        }
    }
};

window.getItemPrice = getItemPrice;


let isInitialized = false;

async function initialize() {
    if (isInitialized) {
        return;
    }

    console.log("🟢 초기화 시작");

    await connectWallet();

    const storedAccount = localStorage.getItem("userAccount");
    if (!storedAccount) {
        alert("로그인이 필요합니다!");
        window.location.href = "login.html";
        return;
    }

    listenForAccountChange();

    await checkAdmin();
    await checkBalance();
    await loadPurchaseHistory();

    isInitialized = true;
}

window.connectWallet = connectWallet;
window.checkBalance = checkBalance;
window.buyItem = buyItem;
window.requestGTN = requestGTN;
window.checkAdmin = checkAdmin;
window.rollDice = rollDice;
window.displayDices = displayDices;