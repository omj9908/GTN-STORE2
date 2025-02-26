let isMetaMaskVerified = false; 
let isRequestPending = false; 

async function verifyMetaMaskAddress() {
    if (!window.ethereum) {
        return alert("MetaMask를 설치하세요!");
    }

    if (isRequestPending) {
        console.log("🔄 MetaMask 요청이 이미 진행 중입니다.");
        return alert("MetaMask 요청이 이미 진행 중입니다. MetaMask 창을 확인해주세요.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const verifyButton = document.getElementById("verifyMetaMaskBtn");
    verifyButton.disabled = true;
    verifyButton.textContent = "MetaMask 검증 중... ⏳";
    
    isRequestPending = true; 

    try {
        // 🔥 MetaMask 권한 요청 초기화 (강제 새 요청)
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        });

        // 🔥 MetaMask에 연결된 계정 가져오기
        const accounts = await provider.send("eth_accounts", []);
        let metaMaskAddress = accounts[0]?.toLowerCase(); 

        console.log("🔍 현재 MetaMask 계정:", metaMaskAddress); 

        const enteredWalletAddress = document.getElementById("walletAddress").value.trim().toLowerCase();
        console.log("🔍 입력한 주소:", enteredWalletAddress); 

        if (!enteredWalletAddress) {
            verifyButton.disabled = false;
            verifyButton.textContent = "🔍 입력한 지갑 주소 검증";
            isRequestPending = false; 
            return alert("먼저 MetaMask 지갑 주소를 입력하세요.");
        }

        if (metaMaskAddress !== enteredWalletAddress) {
            alert("❌ 현재 MetaMask 계정과 입력한 주소가 일치하지 않습니다. MetaMask에서 올바른 계정을 선택해주세요.");
            verifyButton.disabled = false;
            verifyButton.textContent = "🔍 입력한 지갑 주소 검증";
            isRequestPending = false; 
            return;
        }

        document.getElementById("verifyMetaMaskBtn").style.display = "none";
        document.getElementById("registerBtn").disabled = false;
        isMetaMaskVerified = true;
        alert("✅ MetaMask 주소 검증 완료! 이제 회원가입이 가능합니다.");

    } catch (error) {
        console.error("🚨 MetaMask 권한 요청 실패:", error);
        if (error.code === -32002) {
            alert("MetaMask 요청이 이미 진행 중입니다. MetaMask 창을 확인해주세요.");
        } else {
            alert("MetaMask 검증 중 오류가 발생했습니다.");
        }
    } finally {
        isRequestPending = false; 
        verifyButton.disabled = false;
        verifyButton.textContent = "🔍 입력한 지갑 주소 검증";
    }
}

// 🔥 회원가입 요청
async function registerUser() {
    if (!isMetaMaskVerified) {
        return alert("MetaMask 주소를 먼저 검증하세요!");
    }

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const walletAddress = document.getElementById("walletAddress").value.trim();

    if (!username || !password || !walletAddress) {
        return alert("아이디, 비밀번호, MetaMask 주소를 모두 입력하세요!");
    }

    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, walletAddress })
        });

        const data = await response.json();

        if (data.success) {
            alert("✅ 회원가입 성공! 이제 로그인하세요.");
            window.location.href = "login.html";
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("🚨 회원가입 실패:", error);
        alert("회원가입 요청 중 오류 발생");
    }
}

window.onload = () => {
    console.log("🚦 MetaMask 자동 연결 방지 설정 완료");
    isRequestPending = false; // 페이지 로드 시 대기 상태 초기화
};
