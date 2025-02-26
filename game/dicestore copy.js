// 아이템 구매 내역 업데이트
// Tokrnmaker1.sol
// index.html
// 이렇게 사용할것

const CONTRACT_ADDRESS = "0xE0aa4668bA7a20aB13b08D5B09774689d674f398";
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
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			}
		],
		"name": "hasPurchasedItem",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
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
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
	}
];

let provider, signer, contract, currentAccount;

// 🔹 메타마스크 연결
async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // 메타마스크 계정 자동 요청 (승인 필요)
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length === 0) {
                alert("메타마스크 계정을 선택해야 합니다!");
                return;
            }

            let metaMaskAccount = accounts[0];
            signer = provider.getSigner(metaMaskAccount);
            contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            console.log(`🚀 자동 연결된 계정: ${metaMaskAccount}`);
            document.getElementById("account").innerText = `지갑 연결됨: ${metaMaskAccount}`;

            await checkAdmin();
            await checkBalance();
            await loadPurchaseHistory();
            await displayDices();
        } catch (error) {
            console.error("🚨 자동 연결 실패:", error);
        }
    } else {
        alert("메타마스크를 설치해주세요!");
    }
}

// 🔥 페이지 로드 시 자동 연결 실행
window.onload = async function() {
    await connectWallet();
};


// 🔹 아이템 구매
// 🔹 아이템 구매 함수 (GTN 토큰을 관리자에게 전송)
// 🔹 아이템 구매 함수 (GTN 토큰을 관리자에게 전송)
async function buyItem(itemId) {
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    try {
        console.log(`🛒 아이템(${itemId}) 구매 시도 중...`);
        
        // 🔹 스마트 컨트랙트의 buyItem 함수 실행
        const tx = await contract.buyItem(itemId);
        await tx.wait(); // 트랜잭션 완료 대기

        console.log(`✅ 아이템(${itemId}) 구매 완료!`);
        alert("✅ 주사위 구매 완료!");

        await checkBalance(); // 🔹 구매 후 잔액 업데이트
        await loadPurchaseHistory(); // 🔥 구매 후 자동으로 구매 내역 업데이트
        await displayDices(); // 🔥 구매 후 자동으로 아이템 목록 새로고침 추가
    } catch (error) {
        console.error("🚨 구매 실패:", error);
        alert("구매 실패: " + error.message);
    }
}


async function checkAdmin() {
    if (!contract) return;
    
    const currentAccount = await signer.getAddress();
    const ownerAddress = await contract.owner();

    console.log("🚀 현재 계정:", currentAccount);
    console.log("🚀 관리자 계정:", ownerAddress);

    const getGTNButton = document.getElementById("getGTN");

    if (currentAccount.toLowerCase() !== ownerAddress.toLowerCase()) {
        console.log("✅ 일반 유저 감지 → getGTN 버튼 활성화");
        getGTNButton.style.display = "block"; 
    } else {
        console.log("🔒 관리자 계정 감지 → getGTN 버튼 숨김");
        getGTNButton.style.display = "none";  // 🔹 관리자 계정이면 버튼 숨김
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

    let recipient = document.getElementById("customAccount").value.trim();
    const currentAccount = connectedAccounts[0];

    // 🔹 입력한 주소가 현재 MetaMask 계정과 다르면 오류 표시
    if (recipient.toLowerCase() !== currentAccount.toLowerCase()) {
        alert(`입력한 주소(${recipient})와 현재 MetaMask 계정(${currentAccount})이 다릅니다. MetaMask에서 해당 주소를 선택하세요.`);
        return;
    }

    try {
        console.log(`🚀 ${recipient}에게 100 GTN 전송 중...`);
        
        // 🔥 GTN 토큰 발행 및 전송
        const tx = await contract.mintGTN(recipient, ethers.utils.parseUnits("100", 18));
        await tx.wait();

        alert(`✅ ${recipient}에게 100 GTN 전송 완료!`);
        checkBalance(recipient);

        // 🔥 **MetaMask에 GTN 토큰 자동 추가**
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
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    const userAddress = await signer.getAddress();
    try {
        const balance = await contract.balanceOf(userAddress);
        document.getElementById("balance").innerText = `잔액: ${ethers.utils.formatUnits(balance, 18)} GTN`;
    } catch (error) {
        console.error("🚨 잔액 조회 실패:", error);
        alert("잔액 조회 실패: " + error.message);
    }
}

async function getItemName(itemId) {
    const items = await loadItems(); // items.json에서 데이터 가져오기
    const item = items.find(i => i.id === itemId); // itemId로 아이템 찾기
    return item ? item.title : "알 수 없는 주사위"; // 아이템이 없으면 기본값 반환
}








// 🛑 equippedSkins 변수를 함수로 변환하여 항상 최신 데이터 반환
export function getEquippedSkins() {
    let skins = JSON.parse(localStorage.getItem("equippedSkins")) || [];
    console.log("📦 getEquippedSkins() 반환값:", skins); // ✅ 추가 로그
    return skins;
}


// 🛑 equippedSkins 값을 업데이트하고 localStorage에 저장하는 함수 추가
export function setEquippedSkins(newSkins) {
    localStorage.setItem("equippedSkins", JSON.stringify(newSkins));
}

// 🛑 스킨 장착 함수 수정
export async function equipSkin(itemId) {
    if (getEquippedSkins().length > 0) {
        alert("이미 스킨을 장착하고 있습니다. 먼저 장착을 해제하세요.");
        return;
    }

    const itemName = await getItemName(itemId);
    const newSkin = [{ id: itemId, name: itemName }];

    setEquippedSkins(newSkin); // ✅ localStorage에 저장

    console.log("장착한 스킨 목록:", newSkin);

    document.querySelectorAll(".equip-btn").forEach(btn => {
        btn.innerText = "장착하기";
        btn.setAttribute("onclick", `equipSkin(${btn.dataset.id})`);
    });

    const button = document.getElementById(`skin-btn-${itemId}`);
    button.innerText = "장착 해제";
    button.setAttribute("onclick", `unSkin(${itemId})`);
}

// 🛑 스킨 장착 해제 함수 수정
export function unSkin(itemId) {
    setEquippedSkins([]); // ✅ localStorage에서 삭제

    console.log("장착 해제 후 스킨 목록:", getEquippedSkins());

    const button = document.getElementById(`skin-btn-${itemId}`);
    button.innerText = "장착하기";
    button.setAttribute("onclick", `equipSkin(${itemId})`);
}

window.equipSkin = equipSkin;
window.unSkin = unSkin;










export async function loadPurchasedSkins() {
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

    // 🔹 최신 장착 스킨 가져오기
    const equippedSkins = getEquippedSkins();  // ✅ 오류 수정

    for (const dice of items) {
        let price = "불러오는 중...";
        if (window.getItemPrice) {
            price = await window.getItemPrice(dice.id);
        }

        const card = document.createElement("div");
        card.className = "dice-card";

        // 🔹 이미 구매한 스킨인지 확인
        const isPurchased = purchasedSkins.includes(dice.id);
        const isEquipped = equippedSkins.some(skin => skin.id === dice.id); // ✅ 오류 수정
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


// 11:39 수정사항(추가)
async function listenForAccountChange() {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
            console.log("🚨 메타마스크 연결 해제됨");
            alert("메타마스크 연결이 해제되었습니다. 다시 연결해주세요.");
            return;
        }

        console.log("🔄 계정 변경됨:", accounts[0]);

        // ✅ 새 계정으로 Metamask 연결 다시 설정
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        const currentAccount = await signer.getAddress();
        console.log(`✅ 현재 선택된 계정: ${currentAccount}`);

        // 🔹 UI 및 데이터 업데이트
        document.getElementById("account").innerText = `지갑 연결됨: ${currentAccount}`;
        await checkAdmin();
        await checkBalance();
        await loadPurchaseHistory(); // 🔥 계정 변경 시 구매 내역 자동 업데이트
    });
}

listenForAccountChange();

async function loadPurchaseHistory() {
    if (!contract) return alert("먼저 메타마스크를 연결하세요!");

    try {
        const userAddress = await signer.getAddress();
        console.log(`🛍️ 구매 내역 불러오기 (사용자: ${userAddress})...`);

        // ✅ 스마트 컨트랙트에서 구매 내역 조회
        const purchasedItems = await contract.getPurchaseHistory(userAddress);

        if (!purchasedItems || purchasedItems.length === 0) {
            console.warn("🚨 구매한 스킨이 없음.");
            document.getElementById("purchaseList").innerHTML = "<li>구매 내역이 없습니다.</li>";
            return;
        }

        console.log("✅ 블록체인에서 구매 내역 불러오기:", purchasedItems);

        // ✅ 구매한 아이템 리스트 업데이트
        const list = document.getElementById("purchaseList");
        list.innerHTML = ""; // 기존 목록 초기화

        for (const itemId of purchasedItems) {
            const formattedItemId = Number(itemId);
            const priceText = await getItemPrice(formattedItemId);

            const listItem = document.createElement("li");
            listItem.textContent = `🎲 스킨 ID: ${formattedItemId} - ${priceText}`;
            list.appendChild(listItem);
        }

        console.log("✅ 구매 내역이 정상적으로 업데이트되었습니다.");
    } catch (error) {
        console.error("🚨 구매 내역 불러오기 실패:", error);
        alert("구매 내역을 불러오는 중 오류가 발생했습니다.");
    }
}

async function debugPurchaseHistory() {

    try {
        const userAddress = await signer.getAddress();
        const purchasedItems = await contract.getPurchaseHistory(userAddress);

        console.log("📊 [디버깅] 현재 블록체인에서 반환된 구매 내역:", purchasedItems);
    } catch (error) {
        console.error("🚨 [디버깅 실패] 구매 내역을 가져오는 중 오류 발생:", error);
    }
}

// ✅ 디버깅용 함수 실행
debugPurchaseHistory();

// 🔥 전역 객체에 등록하여 `index.html`에서도 호출 가능하도록 설정
window.loadPurchaseHistory = loadPurchaseHistory;

// 🔹 구매 내역을 자동으로 불러오기 (페이지 로드 시 실행)
window.onload = async function() {
    await connectWallet();
    await loadPurchaseHistory(); // 🔥 지갑 연결 후 자동으로 구매 내역 불러오기
};

window.getItemPrice = getItemPrice;


// 🔹 초기화
async function initialize() {
    await connectWallet();
    await checkAdmin();
}

// ✅ 전역 객체 등록 (index.html에서 호출 가능)
window.connectWallet = connectWallet;
window.onload = initialize;
window.buyItem = buyItem;
window.requestGTN = requestGTN;
window.checkAdmin = checkAdmin;
window.checkBalance = checkBalance;
window.rollDice = rollDice;
