let diceResultPlayer1 = [];  // 플레이어 1의 주사위 결과
let diceResultPlayer2 = [];  // 플레이어 2의 주사위 결과
let currentPlayer = 1;  // 1이면 플레이어 1, 2이면 플레이어 2

// savedScores는 외부에서 import 했다고 가정
import { savedScores } from './main_real_sort_real_ani_hover_click_state_copy_10.js';

// 주사위 던지기 함수

function rollDice() {
    let dice = [];
    for (let i = 0; i < 5; i++) {
        const nextScore = scoresIterator.next();
        if (nextScore.done) {
            console.error('savedScores 배열의 요소가 부족합니다.');
            break;
        }
        dice.push(nextScore.value);
    }
    return dice;
}

// 주사위 결과를 화면에 출력하는 함수
function displayDice() {
    let diceResultText;
    if (currentPlayer === 1) {
        diceResultText = diceResultPlayer1.join(", ");
    } else {
        diceResultText = diceResultPlayer2.join(", ");
    }
    document.getElementById("diceResult").textContent = `플레이어 ${currentPlayer}의 주사위 결과: ${diceResultText}`;
}

// 게임 시작 함수
function startGame() {
    // 게임 시작 시 주사위를 던지고 결과 저장
    if (currentPlayer === 1) {
        diceResultPlayer1 = rollDice();  // 플레이어 1의 주사위 결과 저장
    } else {
        diceResultPlayer2 = rollDice();  // 플레이어 2의 주사위 결과 저장
    }
    displayDice();  // 주사위 결과 출력
    enableCategoryButtons();  // 카테고리 버튼 활성화
}

function updateScoreBoard() {
    document.getElementById("scoreOnes").textContent = scoreBoard.ones || "-";
    document.getElementById("scoreTwos").textContent = scoreBoard.twos || "-";
    document.getElementById("scoreThrees").textContent = scoreBoard.threes || "-";
    document.getElementById("scoreFours").textContent = scoreBoard.fours || "-";
    document.getElementById("scoreFives").textContent = scoreBoard.fives || "-";
    document.getElementById("scoreSixes").textContent = scoreBoard.sixes || "-";
    document.getElementById("scoreThreeOfAKind").textContent = scoreBoard.threeOfAKind || "-";
    document.getElementById("scoreFourOfAKind").textContent = scoreBoard.fourOfAKind || "-";
    document.getElementById("scoreFullHouse").textContent = scoreBoard.fullHouse || "-";
    document.getElementById("scoreSmallStraight").textContent = scoreBoard.smallStraight || "-";
    document.getElementById("scoreLargeStraight").textContent = scoreBoard.largeStraight || "-";
    document.getElementById("scoreYahtzee").textContent = scoreBoard.yahtzee || "-";
    document.getElementById("scoreChance").textContent = scoreBoard.chance || "-";
}

// 점수 기록하기
function scoreCategory(category) {
    let dice = currentPlayer === 1 ? diceResultPlayer1 : diceResultPlayer2;
    let scoreBoard = currentPlayer === 1 ? scoreBoardPlayer1 : scoreBoardPlayer2;

    // 점수 계산
    if (category === "ones") {
        scoreBoard.ones = countNumbers(dice, 1);
    } else if (category === "twos") {
        scoreBoard.twos = countNumbers(dice, 2);
    } else if (category === "threes") {
        scoreBoard.threes = countNumbers(dice, 3);
    } else if (category === "fours") {
        scoreBoard.fours = countNumbers(dice, 4);
    } else if (category === "fives") {
        scoreBoard.fives = countNumbers(dice, 5);
    } else if (category === "sixes") {
        scoreBoard.sixes = countNumbers(dice, 6);
    }

    // 점수판 업데이트
    updateScoreBoard();

    // 선택한 카테고리 버튼 비활성화
    disableCategoryButton(category);

    // 플레이어 교대
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    // 게임 진행
    startGame();
}

function updateScoreBoard() {
    // 각 카테고리별 점수 업데이트
    document.getElementById("scoreOnes").textContent = scoreBoardPlayer1.ones || "-";
    document.getElementById("scoreTwos").textContent = scoreBoardPlayer1.twos || "-";
    document.getElementById("scoreThrees").textContent = scoreBoardPlayer1.threes || "-";
    document.getElementById("scoreFours").textContent = scoreBoardPlayer1.fours || "-";
    document.getElementById("scoreFives").textContent = scoreBoardPlayer1.fives || "-";
    document.getElementById("scoreSixes").textContent = scoreBoardPlayer1.sixes || "-";
    // 플레이어 1에 대해 모든 점수를 업데이트
    document.getElementById("scoreOnesPlayer2").textContent = scoreBoardPlayer2.ones || "-";
    document.getElementById("scoreTwosPlayer2").textContent = scoreBoardPlayer2.twos || "-";
    document.getElementById("scoreThreesPlayer2").textContent = scoreBoardPlayer2.threes || "-";
    // 플레이어 2에 대해 모든 점수 업데이트
}


// 주사위 결과에 해당하는 숫자의 개수를 계산
function countNumbers(dice, number) {
    return dice.filter(die => die === number).length * number;
}

// 카테고리 버튼을 활성화하는 함수
function enableCategoryButtons() {
    document.getElementById("onesButton").disabled = false;
    document.getElementById("twosButton").disabled = false;
    document.getElementById("threesButton").disabled = false;
    document.getElementById("foursButton").disabled = false;
    document.getElementById("fivesButton").disabled = false;
    document.getElementById("sixesButton").disabled = false;
    document.getElementById("threeOfAKindButton").disabled = false;
    document.getElementById("fourOfAKindButton").disabled = false;
    document.getElementById("fullHouseButton").disabled = false;
    document.getElementById("smallStraightButton").disabled = false;
    document.getElementById("largeStraightButton").disabled = false;
    document.getElementById("yahtzeeButton").disabled = false;
    document.getElementById("chanceButton").disabled = false;
}

// 카테고리 버튼 비활성화 함수
function disableCategoryButton(category) {
    document.getElementById(category + "Button").disabled = true;
}



