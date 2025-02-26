import { createDice } from './normal_dice.js';

import { params } from './normal_dice.js';  // 🔹 params 가져오기
import * as CANNON from 'https://cdn.skypack.dev/cannon-es'; //물리법칙 및 중력을 설정 하기위해 CANNON.js 호출
import * as THREE from 'three'; // THREE.js 호출


const canvasEl = document.querySelector('#canvas'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #canvas라는 요소 선택 및 객체지정
const scoreResult = document.querySelector('#score-result'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #score-result라는 요소 선택 및 객체지정 
const rollBtn = document.querySelector('#roll-btn'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #roll-btn'라는 요소 선택 및 객체지정 

let renderer, scene, camera , physicsWorld; // 추후 사용할 3D렌더링 및 물리법칙구현을 위해 미리 전역변수 정의

let isInteractionEnabled = false;


const diceArray = [];   // 해당객체에는 THREE.js의 3D 그래픽 요소와 CANNON.js의 물리적 요소를 저장할 예정


export let savedScores = []; //  저장된 주사위 점수 리스트(해당 리스트는 score.js에서 호출)












import { getEquippedSkins } from '../dicestore copy.js';

// 🛑 기본 주사위 파일 설정
let diceFile = './normal_dice.js';

// 🛑 최신 equippedSkins 데이터 가져오기
window.onload = async () => {
    const equippedSkins = getEquippedSkins();  // ✅ 항상 최신 데이터 가져오기
    console.log("🎲 [디버깅] equippedSkins:", equippedSkins);

    if (equippedSkins.length > 0) {
        const skinName = equippedSkins[0].name;  // ✅ 올바른 경로로 변환
        diceFile = `./${skinName}.js`;  
    }

    console.log(`🎲 선택된 주사위 파일: ${diceFile}`);

    // 🛑 동적으로 주사위 스킨 파일 불러오기
    try {
        const module = await import(diceFile);
        console.log(`✅ Loaded Dice Skin: ${diceFile}`);
    } catch (err) {
        console.error("❌ 주사위 스킨 로드 실패:", err);
    }
};





















// 주사위 보관 위치 (copy7 추가)

const storagePositions = [
    { x: -5, y: 0, z: -4 }, // 첫 번째 주사위 보관 위치
    { x: -3, y: 0, z: -4 }, // 두 번째 주사위 보관 위치
    { x: -1, y: 0, z: -4 }, // 세 번째 주사위 보관 위치
    { x: 1, y: 0, z: -4 },  // 네 번째 주사위 보관 위치
    { x: 3, y: 0, z: -4 },  // 다섯 번째 주사위 보관 위치
];





initPhysics(); // initPhysics함수호출(메서드는 아래에서 정의)
initScene(); // initScene함수호출(메서드는 아래에서 정의)




window.addEventListener('resize', updateSceneSize); // 'resize'이벤트 : 사용자가 브라우저 창 크기를 조정할 때 발생
                                                    // 브라우저 창 크기가 변경되면 Three.js의 카메라와 렌더러 크기를 업데이트하여 
                                                    // 화면 왜곡 없이 장면을 렌더링
                                                    // updateSceneSize 함수: 이 함수는 카메라와 렌더러를 새 창 크기에 맞게 조정(아래에 메서드 정의)

// window.addEventListener('dblclick', throwDice);     //dblclick 이벤트: 사용자가 화면을 더블 클릭할 때 발생
//                                                     // throwDice 함수 호출: 더블 클릭 이벤트가 발생하면 주사위를 던지는 동작을 실행(아래에 메서드 정의)
                                                   

rollBtn.addEventListener('click', throwDice);   // rollBtn 은 HTML에 정의된 주사위 굴리기 버튼이다 여기서는 rollBtn을'click'하면 throwDice이벤트를 실행한다.


function initScene() {  // THREE.js에서 렌더러의 역활을 한다 3D 그래픽을 브라우저 화면에 렌더링 한다

    renderer = new THREE.WebGLRenderer({    //THREE.js의 렌더러를 생성한다
        alpha: true,            // 배경을 투명하게 설정한다(기본값 false)
        antialias: true,        // 그래픽 품질을 높이기 위해 설정하는데 가장자리의 계단현상을 줄여주는다
        canvas: canvasEl        // 위에 id가 #canvas의 기능을 canvasEL에 저장했는데 이를 다시 canvas에 넣어준다
    });
    renderer.shadowMap.enabled = true   //그림자 렌더링을 활성화
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //디스플레이의 픽셀 비율을 설정한다. 고해상도 화면에서 성능과 품질을 조정한다.

    scene = new THREE.Scene();  // THREE.js의 씬을 생성한다

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 300) //원근 투영 카메라 생성
                // 45                                       ->  수직 시야각 설정(기본값은 없으며 필수 입력사항)
                // window.innerWidth / window.innerHeight   ->  화면비율이다 (기본값은 없으며 필수 입력사항)
                                                         // ->-> window.innerWidth는 현재 브라우저 창의 가로크기(픽셀 단위)
                                                         // ->-> window.innerHeight 는 현재 브라우저 창의 세로크기(픽셀 단위)

                                                         // ex) 브라우저 창 크기가 1920x1080 (가로 1920, 세로 1080)이라면 
                                                         // window.innerWidth / window.innerHeight = 1920 / 1080 = 1.777... (16:9 비율)

                // 0.1                                      ->  카메라에서 가까운 가시거리를 설정한다(기본값은 없으며 필수 입력사항)
                // 300                                      ->  카메라에서 가장 먼 가시 거리를 설정한다(기본값은 없으며 필수입력사항이다)  

    camera.position.set(0, 2, 0).multiplyScalar(7);    
    
    // 카메라의 위치설정(기본적으로 원점(0,0,0)으로 시작하지만 여기서는 기본 세팅을 (0,0.5,4)로 설정[x축,y축,z축])
    // multiplyScalar(7)는 기본 세팅된 카메라 좌표에 7만큼 곱해준다는 소리 즉 해당코드만 볼때 최종 위치는 (0, 3.5, 28)이 된다

    // -> (0, 3.5, 28) 를바로 설정하지않고 multiplyScalar(7)를 하는 이유는 추후 카메라 위치 변동을 고려하여 기본세팅을 건드리지 않기 위해서 이다


    // 01.28 => 카메라 위치 수정 (0,2,0) 으로하여 위에서 바라보는 걸로 수정함
    camera.lookAt(0, 0, 0); // 카메라를 0,0,0으로 바라보게 하여 주사위를 렌더링 할 수 있게 수정
    
    updateSceneSize(); // 브라우저 창 크기에 맞게 카메라와 렌더러 크기를 조정(메서드는 아래에 정의)

    const ambientLight = new THREE.AmbientLight(0xffffff, .5); // scene 전체를 고르게 비쳐주는 주변광(0xffffff은 조명의 색상이며 0.5는 조명의 강도이다) 
    scene.add(ambientLight);                                   // scene에 ambientLight를 추가!

    // 주사위 낙하지점에 광원과 그림자를 추가
    const topLight = new THREE.PointLight(0xffffff, .5);        // 점광원으로, 특정 지점에서 빚이 퍼져나간다(0xffffff은 조명의 색상이며 0.5는 조명의 강도이다) 
    topLight.position.set(10, 15, 0);                           // 광원의 위치를 설정한다
    topLight.castShadow = true;                                 // 그림자 생성을 활성화한다(기본값 false)
    topLight.shadow.mapSize.width = 2048;                       // 그림자 맵의 해상도를 설정한다(기본값 512x512)
    topLight.shadow.mapSize.height = 2048;                      // 그림자 맵의 해상도를 설정한다(기본값 512x512)
    topLight.shadow.camera.near = 5;                            // 그림자를 생성할 최소 거리 (기본값은 0.5)
    topLight.shadow.camera.far = 400;                           // 그림자를 생성할 최대 거리 (기본값은 500)
    scene.add(topLight);                                        // 설정한 광원과 그림자를 scene에 추가
    
    createFloor();                                              // 물체가 떨어질 수 있는 바닥을 생성한다(메서드는 아래에 정의)



                                                                // 주사위의 크기, 모서리 곡률, 표면 재질 을 이 함수에서 정의한다
                                                                //

    for (let i = 0; i < params.numberOfDice; i++) {             // for루프를 통해 주사위의 값을 알려주는 코드를 작성했다 해당 코드는 위에서 
                                                                  // 정의 한 diceArray배열에 추가되어 표기 될 예정이다

    diceArray.push(createDice(scene, physicsWorld));                           // createDice()는 주사위 생성함수 (메서드는 아래에 정의)
                                                                // 반환된 주사위 객체는 diceArray 배열에 추가

        addDiceEvents(diceArray[i]);                            //생성된 주사위에 이벤트를 추가하는 함수(메서드는 아래에 정의)
    }



    render();                                                    // 실시간 렌더링함수(메서드는 아래에 정의)
}



function initPhysics() {
    physicsWorld = new CANNON.World({   //CANNON.World를 생성하여 physicWorld는 이제 물리 엔징 세계를 나타내는 객체가 되었다.
                                        // 즉 물체 간의 상호작용(중력이나 충돌)을 시뮬레이션한다.

        allowSleep: true,               // allowSleep이 true면 물체가 오랫동안 움직이지 않을때 시뮬레이션을 중지한다(기본값 0.1초)
        gravity: new CANNON.Vec3(0, -50, 0),    // 물리세계에 작용하는 중력벡터이다 여기서는 y축으로 -50의 중력이 설정 되어 있다
    })
    physicsWorld.defaultContactMaterial.restitution = .3; // defaultContactMaterial.restitution는 반발계수라고 하며 즉 충돌 후 얼마나 튀어오르는지 나타낸다
                                                            // 0이면 충돌후 전혀 튀지않고 1이면 엄청 크게 튕겨져 나간다
}


function createFloor() {                            // 3D바닥 설정 코드 (주사위가 굴러갈 수 있는 평평한 바닥을 화면에 렌더링)
    const floor = new THREE.Mesh(                   // THREE.mesh를 floor객체를 생성하여 담음
        new THREE.PlaneGeometry(1000, 1000),        // 가로와 세로가 각각 1000 단위인 2D 평면 Geometry를 생성
        new THREE.ShadowMaterial({                  // 그림자 재질 설정 
            opacity: .1                             // 투명도 0.1(0이면 안보인다)
        })
    )
    floor.receiveShadow = true;                     // 바닥이 그림자를 받을 수 있게 설정 
    floor.position.y = -7;                          // 바닥의 y축위치를 -7로 이동(바닥은 0,-7,0 에 위치함)

    floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);   //x축을 기준으로 90도 회전(rotaion과 비슷한 기능이나 복잡한 회전에는 quaternion이 더 좋다)


    //기본적으로 Three.js의 PlaneGeometry는 XY 평면에 생성된다 즉 바닥이 아닌 세로로 서있는 상태이기 때문에
    //X축을 기준으로 90도 회전하면 평면이 XZ 평면에 놓이게되어 주사위가 굴러갈수 있는 바닥이 된다
    // quaternion.setFromAxisAngle 는 단일회전 축과 단일회전 각도만으로 회전이 가능하다(x축, y축 동시 회전이 불가능능)


    scene.add(floor);                               // 씬에 추가

    const floorBody = new CANNON.Body({             // 물리엔진에서 사용하는 객체생성
        type: CANNON.Body.STATIC,                   // type은 물리 객체가 어떻게 움직이는지 정의한다 => 
                                                    // STATIC(고정된)을 사용하여 움직이지 않는 고정된 객체로 설정
                                                    // 바닥은 고정된 물체로, 위치가 변하지 않기 때문에 STATIC으로 설정

        shape: new CANNON.Plane(),                  // shape는 물리 객체의 충돌 형태를 정의
                                                    // new CANNON.Plane() => Cannon.js에서 제공하는 기본적인 평면 형태
    });
    floorBody.position.copy(floor.position);        // 위치 => 기본값은 (0, 0, 0)이고 Three.js의 floor.position과 동기화
    floorBody.quaternion.copy(floor.quaternion);    // 회전 => 기본값은 (0, 0, 0, 1)이고, Three.js의 floor.quaternion과 동기화
    physicsWorld.addBody(floorBody);                // 물리 세계(physicsWorld)에 바닥 추가
}


// 주사위 내부 면(즉 점이 있는 면)의 지오메트리를 생성하여 이를 우해 각 면에 해당하는 PlaneGeometry를 생성하여 위치와 방향을 조정한다 


function addDiceEvents(dice) {                              // 해당 함수는 주사위가 멈췄을 때 결과를 계산하고 필요한 동작을 수행하는 이벤트를 추가
    dice.body.addEventListener('sleep', (e) => {            // sleep 이벤트 => Cannon.js에서 제공하는 이벤트로, 물체가 충분히 느려져 완전히 멈춘 상태로 전환될 때 발생
                                                            //       e      => 이벤트 객체로 이벤트가 발생한 물체 e.target와 관련된 정보를 포함한다.
                                                            // 여기서는 멈춘 주사위의 회전 상태를 확인(즉 주사위가 굴러 멈췄을 때 호출되며, 콜백 함수가 실행)

                                                            
        dice.body.allowSleep = false;                       // allowSleep은 물체가 일정시간 동안 움직이지 않으면 수면 상태로 돌아가 시뮬레이션에서 제외시키는 함수
                                                            // 하지만 여기서는 falase로 설정하여 다시 활성화 => 이렇게 함으로써 주사위가 멈춰도 후속처리 가능


        const euler = new CANNON.Vec3();                    // 이벤트가 발생한 주사위의 현재 회전상태를 가져옴옴
        e.target.quaternion.toEuler(euler);                 // e.target.quaternion  : 이벤트가 발생한 주사위의 현재 회전 상태(Quaternion)를 가져옴
                                                            // .toEuler(euler)      : 가져온 회전상태를 오일러각도로 변환하여 각축(X,Y,Z)기준으로의 회전 계산 및
                                                                                        // euler.x, euler.y, euler.z에 X, Y, Z축의 회전 값이 저장


        const eps = .76;                                     // 작은 오차 허용 => 물리엔진에는 부동소수점 연산으로 결과가 와넞ㄴ히 정수나 특정값으로 떨어지지 않을
                                                            //                   수 있게때문에 0.1이라는 오차 허용값을 설정(해당 오차는 아래의 람다함수에 이용)
                                                            // 이것은 라디안 값이다(0.76은 약 44도 즉 완전히 수직으로 세워지지않는 이상 오류가 안난다)


        // 람다 함수 만들기                                                    
        let isZero = (angle) => Math.abs(angle) < eps;                      // 주어진 각도(angle)가 0에 가까운지 확인하는 람다함수 isZero 정의
        let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;     // 주어진 각도(angle)가 90도에 가까운지 확인하는 람다함수 isHalfPi 정의
        let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;// 주어진 각도(angle)가 -90도에 가까운지 확인하는 람다함수 isMinusHalfPi정의
        let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps); // 주어진 각도(angle)가 180도 or -180도에
                                                                                                            // 가까운지 확인하는 람다함수 isPiOrMinusPi정의 
        //위의 람다함수를 만들어서 angle값에 대한 기준축을 정하는것 angle이 수학처럼 30도 이렇게 나오는것이 아니므로 Math.PI(3.14...)를 이용하여 결과값이 몇도
        // 즈음에 속하는지에 대한 기준을 만들기 위해 위의 람다 함수 제작     
        
        // => 그래서 위의 람다함수와 각도를 알아내는게 왜 중요한데?
        // =>=> 위의 각도를 통해서 주사위의 윗면 숫자를 결정하기위한 코드를 작성할 예정이다.

                                                


        // 아래의 코드가 윗면 계산 로직이다
        if (isZero(euler.z)) {                  // z축의 오일러 각이 0에 가까울때(오차범위 +-0.1)
            if (isZero(euler.x)) {              // x축의 오일러 각이 0에 가까울때(오차범위 +-0.1)
                showRollResults(1);             // 주사위의 결과 값은 1이다


            } else if (isHalfPi(euler.x)) {     // x축의 오일러 각이 90도에 가까울때(z축의 오일러 각이0일때를 포함)
                showRollResults(4);             // 윗면은 4이다
            } else if (isMinusHalfPi(euler.x)) {// x축의 오일러 각이 -90도에 가까울때(z축의 오일러 각이0일때를 포함)
                showRollResults(3);             // 윗면은 3이다
            } else if (isPiOrMinusPi(euler.x)) {// x축의 오일러 각이 180도에 가까울때(z축의 오일러 각이 0일때를 포함)
                showRollResults(6);             //윗면이 6이다
            } else {
                // landed on edge => wait to fall on side and fire the event again
                dice.body.allowSleep = true;    // 수면 상태로 돌아가 시뮬레이션에서 제외(위에 allowSleep설명)
            }
        } else if (isHalfPi(euler.z)) {         // z축이 0이 아닌 90도에 가까울때
            showRollResults(2);                 // 윗면은 2이다
        } else if (isMinusHalfPi(euler.z)) {    // z축이 0이아닌 -90도에 가까울때
            showRollResults(5);                 // 윗면은 5이다 
        } else {
            //변수 제거 => 만약 주사위가 불안정하게 착지 될 수도있다(경사면에 기울어 지거나 등등 할때는 한 면에 멈추지 않았을 가능성이 있다)
            dice.body.allowSleep = true;     // 그럴때는 allowSleep = true로 바꿔 다시 움직이도록 한다

        }
     
    });
        
}





        // 주사위의 결과를 추가 및 합산을 표시하는 함수

function showRollResults(score) {
    const scoreList = scoreResult.dataset.scores ? scoreResult.dataset.scores.split(',') : [];
    scoreList.push(score); // 점수를 배열에 추가
    scoreResult.dataset.scores = scoreList.join(','); // 데이터 속성 업데이트

    // 각 주사위의 윗면 값을 userData에 저장
    diceArray.forEach((dice, index) => {
        dice.body.userData = dice.body.userData || {};
        dice.body.userData.result = scoreList[index]; // 주사위 값 저장
    });

    // 점수 목록 표시
    scoreResult.textContent = scoreList.join(',');

    // 합계 표시
    const sumElement = document.getElementById("score-sum");
    const sum = scoreList.reduce((total, num) => total + parseInt(num), 0); // 합계 계산
    sumElement.textContent = `Sum: ${sum}`;

    
}


function render() {                                                             // render 메서드 정의의
    physicsWorld.fixedStep();                                                   // physicsWorld.fixedStep()는 위치,속도,회전,중력,충돌같은 물리엔진 계산 해주는
                                                                                // 기능이 있다 (계산만 해준다 그래서 렌더링하는 작업은 따로 해줘야한다)
                                                                                //고정된 시간 간격으로 물리 엔진 상태를 업데이트 한다고 생각하면 된다

                                                                                

    // for (const dice of diceArray) {                                             // 해당방법 말고 그냥 콜백함수를 사용했다(아래거)
    //     dice.mesh.position.copy(dice.body.position)
    //     dice.mesh.quaternion.copy(dice.body.quaternion)
    //     dice.mesh.quatin.copy
    // }

    diceArray.forEach(dice => {                                              // diceArray 배열의 각 요소를 순회하며 콜백 함수(dice => {})를 실행
        dice.mesh.position.copy(dice.body.position);                         // 메쉬와 물리 바디의 위치를 동기화
        dice.mesh.quaternion.copy(dice.body.quaternion);                     // 메쉬와 물리 바디의 회전을 동기화
    });

    renderer.render(scene, camera);                                           // Three.js로 장면을 렌더링(즉 계산된 상태를 바탕으로 렌더링)

    requestAnimationFrame(render);                                            // // 다음 프레임 요청 physicsWorld.fixedStep()이 있기때문에 물리엔진의 
                                                                                // 계산과 함께 렌더링
                                                                                // 즉 즉 requestAnimationFrame(render)와physicsWorld.fixedStep()을 통해
                                                                                //  물리엔진과 렌더링이 동기화 된것
}


// 브라우저 창크기가 변경될때 Three.js의 카메라와 렌더러를 업데이트 하는 데 사용된다.
function updateSceneSize() {
    camera.aspect = window.innerWidth / window.innerHeight;                 // 카메라의 가로 세로 비율을 조정
    camera.updateProjectionMatrix();                                        // aspect 값이 변경되었으므로, 이 메서드를 호출하여 새로운 비율에 맞게
    //                                                                           카메라의 설정을 갱신.
    renderer.setSize(window.innerWidth, window.innerHeight);                // 3D장면이 브라우저 창 전체를 채우도록 렌더링
}

function throwDice() {
    const rollBtn = document.getElementById("roll-btn");

    // 🛑 Throw 버튼 비활성화 및 반투명 처리
    rollBtn.disabled = true;
    rollBtn.style.opacity = "0.5";
    rollBtn.style.cursor = "not-allowed";

    isInteractionEnabled = false; // 🛑 주사위를 굴리는 동안 hover 차단

    // 🛑 기존 hover 이벤트 제거
    diceArray.forEach((dice) => {
        window.removeEventListener('mousemove', dice.mesh.__hoverListener);
        window.removeEventListener('click', dice.mesh.__clickListener);
        window.removeEventListener('mouseleave', dice.mesh.__leaveListener);
    });

    // 🔹 기존 주사위 배열 정렬 (clickState === 1인 주사위를 앞으로 배치)
    const heldDice = diceArray.filter(dice => dice.body.userData.clickState === 1);
    const rollingDice = diceArray.filter(dice => dice.body.userData.clickState === 0);

    // 주사위 순서 업데이트
    diceArray.length = 0;
    diceArray.push(...heldDice, ...rollingDice);

    console.log("🔄 주사위 순서 재정렬:", diceArray.map((d, i) => `#${i + 1}`));

    // 기존 throwDice 로직 유지
    const prevScores = scoreResult.dataset.scores ? scoreResult.dataset.scores.split(',') : [];
    const prevClickCount = heldDice.length;  // 🔹 기존 고정된 주사위 개수

    let newScores = [...prevScores];
    let firstThrow = !prevScores.length;
    
    diceArray.forEach((d, dIdx) => {
        if (d.body.userData.clickState === 1) {
            // 🛑 고정된 주사위가 인덱스에 맞는 보관 위치로 이동
            const targetPos = storagePositions[dIdx] || { x: 0, y: 3.8, z: 0 };
            d.body.position.set(targetPos.x, targetPos.y, targetPos.z);
            d.body.velocity.set(0, 0, 0);
            d.body.angularVelocity.set(0, 0, 0);
            d.mesh.position.copy(d.body.position); // Three.js 메쉬 위치 동기화

            // 기존 점수 유지
            newScores[dIdx] = prevScores[dIdx] || d.body.userData.result || "?";
            return;
        }

        d.body.wakeUp(); // 🛑 주사위를 깨워야 움직일 수 있음!

        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();
        d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
        d.mesh.position.copy(d.body.position);

        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        d.body.quaternion.copy(d.mesh.quaternion);

        const force = 3 + 5 * Math.random();
        d.body.applyImpulse(new CANNON.Vec3(-force, force, 0), new CANNON.Vec3(0, 0, .2));
        d.body.allowSleep = true;
    });

    // 🛑 score 업데이트를 지연시켜 올바른 clickState 반영
    setTimeout(() => {
        diceArray.forEach(dice => {
            dice.body.userData.clickState = 0;
        });

        diceArray.slice(0, prevClickCount).forEach(dice => {
            dice.body.userData.clickState = 1; // 🔹 이전에 고정된 주사위만 다시 clickState === 1로 설정
        });

        // ✅ score 업데이트를 여기서 실행 (clickState가 올바르게 반영된 후)
        newScores = diceArray
            .filter(dice => dice.body.userData.clickState === 1) // clickState === 1인 주사위만 가져오기
            .map(dice => dice.body.userData.result || "?"); // 해당 주사위의 결과만 가져오기

        scoreResult.dataset.scores = newScores.join(',');
        scoreResult.textContent = newScores.join(',');

        const sumElement = document.getElementById("score-sum");
        const sum = newScores.reduce((total, num) => total + (parseInt(num) || 0), 0);
        sumElement.textContent = `Sum: ${sum}`;
        
    }, 500); // score 업데이트를 clickState가 적용된 후 실행
}



let allDiceStopped = false; // 모든 주사위가 멈췄는지 추적
// 여기가 최적의 타이밍인데...(copy10)
function checkAllDiceStopped() {
    allDiceStopped = diceArray.every(dice => dice.body.sleepState === CANNON.Body.SLEEPING);
    if (allDiceStopped) {
        setTimeout(() => {

            moveDiceToCameraWithAnimation(); // 애니메이션 효과로 배열
            addMouseInteractionToDice(); // 마우스 인터랙션 초기화
        }, 1000); // 1초 후 실행
    }
}



function moveDiceToCameraWithAnimation() {
    console.log("🔄 moveDiceToCameraWithAnimation() 실행됨"); // 테스트용
    const spacing = 2; // 주사위 간격
    const duration = 300; // 애니메이션 지속 시간 (밀리초)
    const startTime = performance.now();

    diceArray.forEach((dice, index) => {
        console.log(`🎲 주사위 ${index + 1}의 현재 위치: `, dice.body.position); // 테스트용

        const xTarget = (index - Math.floor(diceArray.length / 2)) * spacing; // 목표 위치
        const yTarget = 3.8;
        const zTarget = 0;

        const targetPosition = { x: xTarget, y: yTarget, z: zTarget }; // 목표 위치
        dice.body.userData.initialPosition = targetPosition; // 초기 위치 저장

        // 🛑 먼저 회전 정렬 수행
        const result = parseInt(dice.body.userData.result); // 주사위 결과 값
        switch (result) {
            case 1:
                dice.mesh.rotation.set(0, 0, 0);
                break;
            case 2:
                dice.mesh.rotation.set(0, 0, Math.PI / 2);
                break;
            case 3:
                dice.mesh.rotation.set(-Math.PI / 2, 0, 0);
                break;
            case 4:
                dice.mesh.rotation.set(Math.PI / 2, 0, 0);
                break;
            case 5:
                dice.mesh.rotation.set(0, 0, -Math.PI / 2);
                break;
            case 6:
                dice.mesh.rotation.set(Math.PI, 0, 0);
                break;
        }

        // 물리 바디와 동기화
        dice.body.quaternion.copy(dice.mesh.quaternion);

        // 🛑 clickState === 1이면 회전만 정렬하고 애니메이션 종료
        if (dice.body.userData.clickState === 1) {
            console.log(`🎯 주사위 ${index + 1}은 고정됨 (clickState: 1)`);
            return;
        }

        // 🟢 clickState === 0인 경우에만 애니메이션 실행
        const startPosition = { x: dice.body.position.x, y: dice.body.position.y, z: dice.body.position.z };

        const animate = () => {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;
            const t = Math.min(elapsedTime / duration, 1); // 0에서 1 사이의 보간 값

            // 위치 보간
            dice.body.position.x = startPosition.x + (targetPosition.x - startPosition.x) * t;
            dice.body.position.y = startPosition.y + (targetPosition.y - startPosition.y) * t;
            dice.body.position.z = startPosition.z + (targetPosition.z - startPosition.z) * t;

            // 위치 동기화
            dice.mesh.position.copy(dice.body.position);

            // 애니메이션 종료 조건
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                isInteractionEnabled = true; // 인터랙션 활성화
            }
        };
        requestAnimationFrame(animate); // 애니메이션 시작
    });
}




function addMouseInteractionToDice() {
    const rollBtn = document.getElementById("roll-btn");

    // 🟢 Throw! 버튼 다시 활성화
    rollBtn.disabled = false;
    rollBtn.style.opacity = "1";
    rollBtn.style.cursor = "pointer";

    diceArray.forEach((dice) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isHovered = false;

        // 기존 이벤트 리스너 제거
        dice.mesh.__hoverListener && window.removeEventListener('mousemove', dice.mesh.__hoverListener);
        dice.mesh.__clickListener && window.removeEventListener('click', dice.mesh.__clickListener);
        dice.mesh.__leaveListener && window.removeEventListener('mouseleave', dice.mesh.__leaveListener);

        // 🛑 Hover 이벤트: 보관된 주사위 (clickState === 1) 는 절대 hover 이벤트 추가 안 함!
        dice.mesh.__hoverListener = (event) => {
            if (!isInteractionEnabled) return;
            if (dice.body.userData.clickState === 1) return; // 🛑 보관된 주사위는 hover 무시

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(dice.mesh, true);

            if (intersects.length > 0) {
                if (!isHovered) {
                    isHovered = true;
                    animateDiceOnHover(dice, true);
                }
            } else if (isHovered) { 
                isHovered = false;
                animateDiceOnHover(dice, false);
            }
        };
        window.addEventListener('mousemove', dice.mesh.__hoverListener);

        // 🟢 Click 이벤트는 항상 추가 (보관된 주사위도 클릭 가능)
        dice.mesh.__clickListener = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(dice.mesh, true);

            if (intersects.length === 0) return;

            const index = diceArray.indexOf(dice);

            // 🟢 클릭한 주사위만 clickState 변경
            dice.body.userData.clickState = dice.body.userData.clickState === 1 ? 0 : 1;

            // 🟢 주사위 위치를 clickState에 따라 자동 변경
            const targetPosition = (dice.body.userData.clickState === 1) 
                ? storagePositions[index] // 보관 위치
                : dice.body.userData.initialPosition; // 초기 위치

            dice.body.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            dice.body.velocity.set(0, 0, 0);
            dice.body.angularVelocity.set(0, 0, 0);
            dice.mesh.position.copy(dice.body.position); // 위치 동기화

            updateButtonState(); // 버튼 상태 업데이트
        };
        window.addEventListener('click', dice.mesh.__clickListener);
    });
}






function animateDiceOnHover(dice, isHovered) {
    const hoverDistance = 1; // Y축으로 가까워지는 거리
    const baseYPosition = 3.8; // 기본 Y 위치

    const targetY = isHovered ? baseYPosition + hoverDistance : baseYPosition;

    const duration = 100; // 애니메이션 지속 시간
    const startTime = performance.now();
    const startY = dice.body.position.y;

    const animate = () => {

        if (!isInteractionEnabled) return; // 🛑 hover 애니메이션 도중에 주사위를 굴리면 즉시 종료

        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const t = Math.min(elapsedTime / duration, 1); // 0~1 사이의 보간 값

        dice.body.position.y = startY + (targetY - startY) * t;
        dice.mesh.position.copy(dice.body.position); // 위치 동기화

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}
localStorage.setItem("savedScores", JSON.stringify(savedScores));



function updateButtonState() {
    const allClicked = diceArray.every(dice => dice.body.userData.clickState === 1); // 모든 주사위가 클릭되었는지 확인
    const rollBtn = document.getElementById("roll-btn"); // 버튼 요소 가져오기

    if (allClicked) {
        rollBtn.textContent = "Save!"; // 버튼을 Save!로 변경
        rollBtn.style.backgroundColor = "#4CAF50"; // 초록색으로 변경 (선택 사항)
    } else {
        rollBtn.textContent = "Throw!"; // 다시 주사위를 굴릴 수 있도록 복원
        rollBtn.style.backgroundColor = "#ffffff"; // 원래 색으로 복원 (선택 사항)
    }
}

function saveScores() {
    const scoreResult = document.getElementById("score-result").dataset.scores; // 현재 점수 가져오기
    if (!scoreResult) return; // 값이 없으면 실행하지 않음

    const scoreArray = scoreResult.split(',').map(Number); // 문자열을 숫자 배열로 변환
    savedScores.push(scoreArray); // 리스트에 저장

    console.log("저장된 점수 목록:", savedScores); // 콘솔에 출력

    // 🟢 모든 주사위의 clickState를 0으로 초기화
    diceArray.forEach(dice => {
        dice.body.userData.clickState = 0;
    });

    updateButtonState(); // 버튼 상태 업데이트 (Throw!로 복원)
    throwDice(); // 🟢 다시 주사위를 굴리기
 }

// 🟢 버튼 클릭 이벤트 (Throw! 또는 Save! 동작 분기)
document.getElementById("roll-btn").addEventListener("click", () => {
    const rollBtn = document.getElementById("roll-btn");

    if (rollBtn.textContent === "Save!") {
        saveScores(); // 현재 점수를 저장하고 다시 주사위를 굴림
    } 
});









diceArray.forEach(dice => {
    dice.body.addEventListener('sleep', () => {
        checkAllDiceStopped();
    });
});

