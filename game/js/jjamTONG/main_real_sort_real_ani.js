// Score보드에 맞게 주사위 정렬 + 올바르게 정렬


import * as CANNON from 'https://cdn.skypack.dev/cannon-es'; //물리법칙 및 중력을 설정 하기위해 CANNON.js 호출

import * as THREE from 'three'; // THREE.js 호출
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; // THREE.js의 도구 중 하나로, 여러 지오메트리를 병합하는 등의 작업을 돕는다

const canvasEl = document.querySelector('#canvas'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #canvas라는 요소 선택 및 객체지정
const scoreResult = document.querySelector('#score-result'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #score-result라는 요소 선택 및 객체지정 
const rollBtn = document.querySelector('#roll-btn'); // 실행되는 HTML문서(여기서는 index.html)에서 id가 #roll-btn'라는 요소 선택 및 객체지정 

let renderer, scene, camera, diceMesh, physicsWorld; // 추후 사용할 3D렌더링 및 물리법칙구현을 위해 미리 전역변수 정의

const params = {    // 주사위의 외형 설정
    numberOfDice: 5,    // 주사위의 수
    segments: 40,       // 주사위를 구성하는 기하학적 분할 수
    edgeRadius: .07,    // 주사위 모서리의 곡률
    notchRadius: .12,   // 주사위의 점 위치
    notchDepth: .1,     // 주사위의 점 깊이이
};

const diceArray = [];   // 해당객체에는 THREE.js의 3D 그래픽 요소와 CANNON.js의 물리적 요소를 저장할 예정

initPhysics(); // initPhysics함수호출(메서드는 아래에서 정의)
initScene(); // initScene함수호출(메서드는 아래에서 정의)




window.addEventListener('resize', updateSceneSize); // 'resize'이벤트 : 사용자가 브라우저 창 크기를 조정할 때 발생
                                                    // 브라우저 창 크기가 변경되면 Three.js의 카메라와 렌더러 크기를 업데이트하여 
                                                    // 화면 왜곡 없이 장면을 렌더링
                                                    // updateSceneSize 함수: 이 함수는 카메라와 렌더러를 새 창 크기에 맞게 조정(아래에 메서드 정의)

window.addEventListener('dblclick', throwDice);     //dblclick 이벤트: 사용자가 화면을 더블 클릭할 때 발생
                                                    // throwDice 함수 호출: 더블 클릭 이벤트가 발생하면 주사위를 던지는 동작을 실행(아래에 메서드 정의)
                                                   

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
                                                         // ->-> window.innerHeight 는 현재 브라우저 창의 세로크기(픽셀 단위위)

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


    diceMesh = createDiceMesh();                                // 주사위를 생성하기 위해 Mesh를 생성(즉 주사위의 외형 정의 함수이다)
                                                                // 주사위의 크기, 모서리 곡률, 표면 재질 을 이 함수에서 정의한다
                                                                //

    for (let i = 0; i < params.numberOfDice; i++) {             // for루프를 통해 주사위의 값을 알려주는 코드를 작성했다 해당 코드는 위에서 
                                                                  // 정의 한 diceArray배열에 추가되어 표기 될 예정이다

        diceArray.push(createDice());                           // createDice()는 주사위 생성함수 (메서드는 아래에 정의)
                                                                // 반환된 주사위 객체는 diceArray 배열에 추가

        addDiceEvents(diceArray[i]);                            //생성된 주사위에 이벤트를 추가하는 함수(메서드는 아래에 정의)
    }

    throwDice();                                                 // 초기상태에서 주사위를 던지는 함수(메서드는 아래에 정의)

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


// 주사위의 3D 모델(mesh) 생성 함수
function createDiceMesh() {             
    const boxMaterialOuter = new THREE.MeshStandardMaterial({       // 주사위의 외형(boxMaterialOuter객체로 설정) 지정
                                                                    // Three.js에서 표준 PBR(물리 기반 렌더링) 재질을 생성
        color: 0xff6666,                                            // 컬러는 밝은 빨간색
    })
    const boxMaterialInner = new THREE.MeshStandardMaterial({       // 주사위의 내부(boxMaterialInner객체로 설정) 지정(아래는 MeshStandardMateria의 속성)
        color: 0xffffff,                                            // 컬러는 흰색
        roughness: 1,                                               // 재질 표면의 거칠기를 정의(작을수록 표면이 반짝이고 매끄러우며 반사광이 강해진다)
        metalness: 0,                                               // 재질 표면의 금속성을 정의(클수록 반사광이 강하며 반사되는 색상이 표면의 색상보다 강해진다)
        side: THREE.DoubleSide                                      // 지오메트리의 앞면과 뒷면을 모두 렌더링
                                                                    // side: THREE.DoubleSide로 설정되어, 주사위의 내부 점이 양면에서 보이도록 구성됨
    })
   
    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);  // createInnerGeometry()를 호출하여 주사위의 점(숫자)즉 내부를 표현

    const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);    // createBoxGeometry()를 호출하여 주사위의 외형(큐브)즉 외부를 표현
    outerMesh.castShadow = true;                                                // 주사위를 던질때 외형(큐브)에 의하여 생기는 그림자를 허용
    diceMesh.add(innerMesh, outerMesh);                                         // diceMesh에 추가

    return diceMesh;                                                //생성된 diceMesh 객체를 반환하여 장면(scene)에 추가
}

function createDice() {
    const mesh = diceMesh.clone();                    // 주사위 매쉬를 복사 (이 메쉬는 Three.js로 화면에 렌더링되는 주사위이다)
    scene.add(mesh);                                  // 메쉬를 Three.js 장면에 추가

    const body = new CANNON.Body({
        mass: 1,                                      // 주사위의 질량(물체가 중력 또는 충돌에서 얼마나 영향을 받을지를 결정 / 질량이 0이면 움직이지 않는 객체가 된다.)
        shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)), // Box()                            => Box모양의(1,1,1) 큐브형태생성성
                                                            // new CANNON.Vec3(0.5, 0.5, 0.5)   => Vec3(0.5, 0.5, 0.5)는 큐브의 절반 크기를 나타냅니다
        sleepTimeLimit: .1                                  // 주사위가 정지 상태로 들어가는 데 필요한 최소 시간 해당 값이 작을 수록 주사위가 빠르게 멈춘다.
    });
    physicsWorld.addBody(body);                        //생성된 물리 바디를 물리 엔진의 시뮬레이션에 추가

    return {mesh, body};                               //createDice() 함수는 생성된 메쉬와 물리 바디를 객체 형태로 반환
                                                        // 반환된 mesh와 body는 diceArray배열에 넣어 주사위를 조작하거나 동기화하는데 사용예정임!
}



// 주사위 외형의 지오메트리를 생성하는 함수 정의
// 기본적으로는 THREE.BoxGeometry(완전 각진 정육면체)를 기반으로 하며, 주사위의 각 면과 모서리를 둥글게 변형할 예정

function createBoxGeometry() {          // 함수정의

    let boxGeometry = new THREE.BoxGeometry(1, 1, 1, params.segments, params.segments, params.segments); 
    //  BoxGeometry는 Three.js에서 제공하는 기본적인 큐브 지오메트리 
    // (1,1,1)은 주사위의 크기(기본값설정)
    // params.segments 는 각 면의 분할 수를 설정하여 더 정밀한 변형이 가능하게 설정 (params는 위에 정의해 놓음)


    const positionAttr = boxGeometry.attributes.position; // positionAttr는 지오메트리의 각 정점(vertex)를 담고있는 속성으로 객체를 지정
    const subCubeHalfSize = .5 - params.edgeRadius;       // 각 모서리에서 둥글게 처리될 부분을 계산하기 위해 사용(params는 위에 정의 됨)
                                                    // 서브 큐브의 반지름(중심에서 모서리까지의 거리)을 계산하는 코드이다
                                                    //  이는 큐브의 모서리를 둥글게 만들기 위한 계산의 기초이다
            //  0.5 는 큐브의 기본크기(1x1x1)에서 절반의 길이 즉 축(x,y,z)의 중심에서 모서리까지의 거리는 0.5이다
            //  params.edgeRadius 는 큐브의 모서리를 둥글게 처리하기 위해 설정한 반지름이다
            // 해당 값만크 모서리가 '잘려나가' 둥글게 보이도록 처리된다.




    for (let i = 0; i < positionAttr.count; i++) {         // positionAttr.count : 정점의 개수
                                                           //  정점의 개수만큼 반복문 실행행

        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);    //i번째  positionAttr(정점중 하나)의 X축, Y축, Z축의 좌표를 Vector3로 변환
                                                                                // 즉  position은 x,y,z축의 좌표를 vector3로 변환하여 3D공간상의 좌표가 된다.

        const subCube = new THREE.Vector3(Math.sign(position.x)                 // Math.sign()의 부호를 확인한다 양수면 1, 음수면 -1, 0이면 0을 출력한다다 
        , Math.sign(position.y)
        , Math.sign(position.z)).multiplyScalar(subCubeHalfSize);               // multiplyScalar는 서브 큐브 중심의 중심좌표에서 각 정점의 길이 이므로 해당 값
                                                                                // 에서 부호를 곱해 큐브 중심의 좌표를 나타낸다. => 그것을 subCube객체에 담음음


        const addition = new THREE.Vector3().subVectors(position, subCube);     // position - subCube로 정점과 서브 큐브 중심 사이의 차이 벡터를 계산
                                                                                // 이 벡터는 정점이 서브 큐브 중심에서 얼마나 멀리 떨어져 있는지와 방향을 나타냄
                                                                                // 이를 활용하여 모서리 근처의 정점을 기준 중심으로 조정,
                                                                                //   부드럽고 자연스러운 둥근 모서리 구현



        // 해당 코드 부분은 주사위의 모서리를 둥글게 만들기 위해 정점(position)을 조정
        // 결과적으로 주사위 모서리가 부드럽고 자연스러워집니다


        if (Math.abs(position.x) > subCubeHalfSize &&
         Math.abs(position.y) > subCubeHalfSize &&
          Math.abs(position.z) > subCubeHalfSize) {
            // Math.abs(position.x) > subCubeHalfSize은 정점의 x좌표가 서브큐브 중심에서 멀리 떨어져 있는지를 확인 
            // y와 z도 동일

            // 큐브의 꼭짓점 근처를 둥글게 처리하기 위해서 모서리 근처의 정점만 변형해야한다 이 조건은 꼭짓점 정점을 정확히 찾는 역할을 한다.


            
            addition.normalize().multiplyScalar(params.edgeRadius);
            // addition.normalize().multiplyScalar(params.edgeRadius)를 통해 둥글게 조정했다 addition은 정점과 서브 큐브 중심 간의 차이벡터이다
            // normalize() : 베거의 방향을 유지하면서 길이를 1로 만든다.
            // multiplyScalar(params.edgeRadius) 


            position = subCube.add(addition);
            // 중심 좌표(subCube)에 이동 벡터(addition)를 더해, 정점을 둥글게 조정한 최종 위치를 계산



        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) { 
            // 정점이 X축과 Y축 모두에서 서브 큐브 경계선 바깥쪽에 있는지 확인
            // -> 즉 정점이 XY모서리 근처에 있는지 확인

       
            addition.z = 0; // 두 축의 모서리(여기서는 x와 y)를 처리하기 위해 나머지 Z축의 값을 0으로 고정
            
            addition.normalize().multiplyScalar(params.edgeRadius);
            //addition 벡터를 normalize(정규화[길이는 1])한뒤 params.edgeRadius를 곱해 모서리를 둥글게 처리
            
            position.x = subCube.x + addition.x;    // 정점을 서브큐브 중심(subCube) 기준으로 이동
            position.y = subCube.y + addition.y;    // 둥글게 처리할 방향(addition)에 따라 새로운 위치를 설정

        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            // 정점이 X축과 Z축 모두에서 서브 큐브 경계선 바깥쪽에 있는 경우
            // 정점이 XZ모서리 근처에 있는지 확인
            addition.y = 0;
            // 두축의 모서리(여기서는 X와 Z)를 처리하기 위해 나머지 Y축의 값을 0으로 고정

            addition.normalize().multiplyScalar(params.edgeRadius);
            //addition 벡터를 normalize(정규화[길이는 1])한뒤 params.edgeRadius를 곱해 모서리를 둥글게 처리 

            position.x = subCube.x + addition.x;    // 정점을 서브큐브 중심(subCube) 기준으로 이동
            position.z = subCube.z + addition.z;    // 둥글게 처리할 방향(addition)에 따라 새로운 위치를 설정


        } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            // 정점이 Y축과 Z축 모두에서 서브 큐브 경계선 바깥쪽에 있는 경우
            // 이 조건은 정점이 YZ모서리 근처에 있음을 나타냄
            addition.x = 0;
            // 두 축의 모서리(Y와 Z의 모서리)를 처리하기 위해 나머지 X축의 값을 0으로 고정

            addition.normalize().multiplyScalar(params.edgeRadius);
            //addition 벡터를 normalize(정규화[길이는 1])한뒤 params.edgeRadius를 곱해 모서리를 둥글게 처리 

            position.y = subCube.y + addition.y;     // 정점을 서브큐브 중심(subCube) 기준으로 이동
            position.z = subCube.z + addition.z;     // 둥글게 처리할 방향(addition)에 따라 새로운 위치를 설정

        }



        // 단일 축에서 점의 움푹 들어가는 변형 효과를 계산
        const notchWave = (v) => {                       //  v 를 기반으로 음푹 들어가는 변형효과 계산  
            v = (1 / params.notchRadius) * v;               //params.notchRadius는 눈금의 크기를 조정하는 파라미터
                                                        

            v = Math.PI * Math.max(-1, Math.min(1, v));        // v 값이 -1~1을 초과하지 않도록 제한
            return params.notchDepth * (Math.cos(v) + 1.0);      //Math.cos(v)를 통해 -1~1로 코사인 값을 반환 하여 +1.0을 더한뒤 결과 값을 0~2로 변환
                                                                // float 타입을 유지하기위해 1.0으로 표기
        }

            // notchWave(v)
            // 단일 축에서 점의 움푹 들어가는 변형 효과를 계산
            // notchDepth와 notchRadius에 따라 변형의 깊이와 크기를 조절






        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]); //주사위 눈금의 움푹 들어가는 위치를 계산
            //notchWave(pos[0]): X축 방향 변형
            //notchWave(pos[1]): Y축 방향 변형


            // notch(pos)
            // X축과 Y축의 변형 효과를 조합해 2D 위치에서 움푹 들어가는 효과를 계산

        const offset = .23;
            // 주사위의 점 위치를 설정할 때 사용되는 상수
            // 점의 위치를 계산할 때 좌표 중심에서 0.23만큼 떨어진 위치에 배치


            // offset
            // 점이 표면에서 배치될 기본 위치를 설정




        // 주사위의 눈금을 움푹 들어가 보이도록 변형하는 작업을 수행    
        // 특정 면에 위치한 정점(position)을 다루며 눈금의 위치에 따라 저엄을 조정한다

        // 정점이 특정 면에 위치한지 확인
        // 1. 정점의 Y좌표가 0.5일때 주사위의 윗면에 위치한 정점

        if (position.y === .5) {        // 정점의 Y좌표가 0.5일때? ->  주사위의 윗면에 위치한 정점이다
            position.y -= notch([position.x, position.z]);      // 현재 정점의 XZ 평면 위치를 기준으로, 음푹 들어가는 정도를 계산
                                                                // notch() : 현재 정점의 XZ평면 위치를 기준으로 , 음푹 들어가는 정도를 계산
                                                                // position.y -= notch([position.x, position.z])를 통해 정점의 Y좌표를 음푹 들어가게 변형

        // 2. 정점이 X축 양쪽 면에 위치한 경우
        } else if (position.x === .5) {                         // 정점의 X좌표가 0.5일때 주사위의 오른쪽 면에 위치함 
            position.x -= notch([position.y + offset, position.z + offset]);    // 눈금의 첫 번째 위치(offset)를 기준으로 음푹 들어가는 정도를 계산
            position.x -= notch([position.y - offset, position.z - offset]);    // 눈금의 두 번째 위치(offset)를 기준으로 음푹 들어가는 정도를 계산


        // 3. 정점이 Z축 양쪽 명에 위치한 경우
        } else if (position.z === .5) {                         // 정점의 Z좌표가 0.5일때 앞면에 위치한 정점
            position.z -= notch([position.x - offset, position.y + offset]);    // 눈금의 첫 번째 위치(offset)를 기준으로 음푹 들어가는 정도를 계산
            position.z -= notch([position.x, position.y]);                      // 눈금의 두 번째 위치를 기준으로 음푹 들어가는 정도를 계산(중앙)
            position.z -= notch([position.x + offset, position.y - offset]);    // 눈금의 세 번째 위치(offset)를 기준으로 음푹 들어가는 정도를 계산
                                                                            // 즉 Z좌표를 변형하여 음푹 들어가는 효과를 구현

        } else if (position.z === -.5) {                        // 점점의 Z좌표가 -0.5일때 뒷면에 위치한 정점

            // 아래의 코드는 Z축 음의 방향에서는 음푹 들어가는 방향이 반대 이므로 +=로 조정한다
            position.z += notch([position.x + offset, position.y + offset]);    // 우상단 
            position.z += notch([position.x + offset, position.y - offset]);    // 우하단
            position.z += notch([position.x - offset, position.y + offset]);    // 좌상단
            position.z += notch([position.x - offset, position.y - offset]);    // 좌하단


        // 4. X축 음의 방향 면(왼쪽) -> X축 위치를 움푹 들어가게 조정하여 중앙의 눈금 변형을 적용
        } else if (position.x === -.5) {    // X좌표가 -0.5일때, 왼쪽 면에 위치한 정점

             // 아래의 코드에서 X축 음의 방향에서는 음푹 들어가는 방향이 반대 이므로 +=로조정
            position.x += notch([position.y + offset, position.z + offset]);    // 좌상단
            position.x += notch([position.y + offset, position.z - offset]);    // 좌하단
            position.x += notch([position.y, position.z]);                      // 중앙
            position.x += notch([position.y - offset, position.z + offset]);    // 우상단
            position.x += notch([position.y - offset, position.z - offset]);    // 우하단


        // 5. Y축 음의 방향 면 (아랫면)
        // Y좌표가 -0.5일 때, 아랫면에 위치한 정점 즉 아랫면읜 눈금 위치를 조정
        // Y축 음의 방향에서는 음푹 들어가는 방향이 반대이므로 += 로 조정
        } else if (position.y === -.5) {    // Y좌표가 -0.5일때, 아랫면에 위치한 정점

            position.y += notch([position.x + offset, position.z + offset]);    // 우상단
            position.y += notch([position.x + offset, position.z]);             // 중앙 위
            position.y += notch([position.x + offset, position.z - offset]);    // 우하단
            position.y += notch([position.x - offset, position.z + offset]);    // 좌상단
            position.y += notch([position.x - offset, position.z]);             // 중앙 아래
            position.y += notch([position.x - offset, position.z - offset]);    // 좌하단
        }


        // <마!지!막!> 
        positionAttr.setXYZ(i, position.x, position.y, position.z); // 변경된 정점위치(position.x, position.y, position.z)를 지오메트리의 
                                                                    // 버퍼 속성(positionAttr)에 저장한다.
    }


    boxGeometry.deleteAttribute('normal');  // 기존의 법선 벡터('normal')가 더이상 정확하지 않기 때문에 삭제 후 새로운 법선을 재계산 예정 
    boxGeometry.deleteAttribute('uv');      // 기존의 uv매핑좌표가 해당 코드에서는 필요없기때문에(해당 코드는 텍스쳐를 사용하지 않음) 불필요한 uv를 삭제해
                                            // 메모리 사용을 줄임 
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);   // 중복된 정점을 병합하여 최적화
                                    // 법선 벡터의 정확도 향상 및 중복된 정점을 병합하여 지오메트리 최적화

    boxGeometry.computeVertexNormals();     // 모든 정점의 법선 벡터를 다시 계산
                                            // 기존의 법선 벡터가 삭제 되었기때문에 조명효과를 제대로 구현하기 위해 새롭계 계산
                                            
    return boxGeometry;                     // 최적화 및 재계산이 완료된 boxGeometry를 반환하여, 이후 Three.js 장면에 렌더링할 준비를 함



    // 위의 코드로 법선을 재계산하여, 조명과 그림자 효과를 정확히 구현 및 GPU연산부담을 줄임
}



// 주사위 내부 면(즉 점이 있는 면)의 지오메트리를 생성하여 이를 우해 각 면에 해당하는 PlaneGeometry를 생성하여 위치와 방향을 조정한다 

function createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(1 - 2 * params.edgeRadius, 1 - 2 * params.edgeRadius);

    // PlaneGeometry(width, height) : 가로와 세로의 크기의 평면(2D)을 생성 
    // 1 - 2 * params.edgeRadius : 평면의 크기를 계산 
    // params.edgeRadius : 주사위 모서리의 둥근 정도를 나타내는 값 즉 모서리를 둥글개 만들었기 때문에 평면이 주사위 전체 면에 맞도록 크기를 조정

    const offset = .48;
        // 평면이 주사위의 중심에서 떨어진 거리(면과 중심 간의 거리).
        // 주사위의 크기가 1x1x1이므로, 중심에서 약 0.5만큼 떨어져야 한다.
        // 0.48로 설정한 이유: 둥근 모서리(params.edgeRadius)로 인해 0.5보다 약간 작은 거리로 설정 [만약 직각 모서리면 길이가 0.5이지만 둥그므로 조금 더 길이가 짧아 
        //                                                                                      그것을 반영한다.]


        // 여섯 면의 지오메트리 생성 및 변형

    return BufferGeometryUtils.mergeBufferGeometries([      // 여섯 면을 하나의 지로메트리로 병합

        // 각 면 생성 및 변형

        baseGeometry.clone().translate(0, 0, offset),       // 1.앞면(Z축 양의 방향) 평면을 Z축 양의 방향으로 이동

        baseGeometry.clone().translate(0, 0, -offset),      // 2.뒷면(Z축 음의 방향) 평면을 Z축 음의 방향으로 이동

        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),    // 3.아랫면(Y축 음의 방향) 평면을 X축을 기준으로 90도(0.5*Math.PI)회전
                                                                                // 평면을 Y축 음의 방향으로 이동

        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),     // 4.윗면(Y축 양의 방향) 평면을 X축을 기준으로 90도 회전
                                                                                // 평면을 Y축 양의 방향으로 이동

        baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),    // 5.왼쪽 면(X축 음의 방향) 평면을 Y축 기준으로 90도 회전
                                                                                // 평면을 X축 음의 방향으로 이동

        baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),     // 6. 오른쪽 면(X축 양의 방향) 평면을 Y축 기준으로 90도 회전
                                                                                // 평면을 양의 방향으로 이동 


    ], false);  // flase : 병합 과정에서 중복된 정점을 제거하지 않음(각 면은 독립적으로 유지).
}

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


        const eps = .1;                                     // 작은 오차 허용 => 물리엔진에는 부동소수점 연산으로 결과가 와넞ㄴ히 정수나 특정값으로 떨어지지 않을
                                                            //                   수 있게때문에 0.1이라는 오차 허용값을 설정(해당 오차는 아래의 람다함수에 이용)


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
    camera.aspect = window.innerWidth / window.innerHeight;                 // 카메라의 가로 세로 비율을 조정정
    camera.updateProjectionMatrix();                                        // aspect 값이 변경되었으므로, 이 메서드를 호출하여 새로운 비율에 맞게
    //                                                                           카메라의 설정을 갱신.
    renderer.setSize(window.innerWidth, window.innerHeight);                // 3D장면이 브라우저 창 전체를 채우도록 렌더링
}

function throwDice() {
    // 점수와 합계 초기화
    scoreResult.dataset.scores = ""; // 기존 점수 데이터 리셋
    scoreResult.innerHTML = "";      // 화면에 표시된 점수 초기화
    const sumElement = document.getElementById("score-sum");
    if (sumElement) {
        sumElement.textContent = ''; // Sum 초기화
    }

    diceArray.forEach((d, dIdx) => {                                                // diceArray배열에 정보가 등록되면 그 정보를 처리할 수 있는 콜백함수 정의
                                                                                    // 여기서 diceArray에 들어가는 정보는 createDice()에 정의 이때 d는 주사위의 
                                                                                    // mesh와 body가 됨

        d.body.velocity.setZero();                                                  //d(주사위)의 기존 속도를 제거
        d.body.angularVelocity.setZero();                                           //주사위의 기존 회전속도를 제거
                 //물리 엔진에서 주사위가 이미 움직이고 있을 수 있으므로, 모든 속도를 초기화하여 정지 상태에서 시작하도록 한다.

        d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);                        // 주사위의 초기위치 설정
        d.mesh.position.copy(d.body.position);                                      // 메쉬와 물리적 바디 위치 동기화
                // 이걸 함으로써 Three.js 메쉬(mesh)의 위치와 회전이 Cannon.js 바디(body)와 동기화를 할 수 있다
                // 이걸 하지않으면 물리적으로는 주사위가 A지점에 있지만 화면에는 B지점에 그려질 수 있기에 결과적으로 엉뚱한 위치에 엉뚱한 표시를 하는 
                // 주사위를 보게 될지도 모른다

                // ex) 동기화를 하지않으면 표기상으로 6인데 사실 물리엔진에서 계산된 것에는 3이라서 텍스트에 결과 표기가 잘못 될 수 도 있는것이다


        d.mesh.rotation.set(2 * Math.PI * Math.random()         // x축 무작위 회전
         , 0                                                    // y축은 회전하지 않음 (y축을 안건드려도 충분하다는 결과가 나옴)
        , 2 * Math.PI * Math.random())                          // z축 무작위 회전
        // Math.random() 을 사용하여 X축과 Z축의 회전을 무작위로 설정한다 (참고로 2 * Math.PI는 360도이다)
        
        d.body.quaternion.copy(d.mesh.quaternion);
        // 설정된 회전을 물리 엔진의 바디(body.quaternion)와 동기화

        const force = 3 + 5 * Math.random();             // 3에서 8 사이의 랜덤 힘 생성 <- 힘에따라 주사위가 튕겨나가는 거리가 달라짐
        d.body.applyImpulse(                            // body.applyImpulse(impulse, worldPoint) 첫번째 매개변수는 힘의 크기와 방향
                                                                    //                              두번째 매개변수는 힘이 작용하는 위치

            new CANNON.Vec3(-force, force, 0),           // x축으로 - 힘 적용 (왼쪽) , y축으로 위쪽으로 힘적용(튀어오르기 위함) z축으로 힘 적용 x
            new CANNON.Vec3(0, 0, .2)                   // 힘이 작용하는 위치를 z축으로 0.2위치에 적용하여 중심에서 살짝 비틀어진 위치에서 힘을 적용
                                                        // 시켜 자연스러운 회전을 유도도
        );

        d.body.allowSleep = true;                       // 주사위가 정지 상태가 되면 물리엔진이 해당 객체를 시뮬레이션에서 제외하도록 설정(성능 최적화를 위함함)
    });
}



// 01-21 추가 내용

//main_real.js의 addDiceEvents 함수에서 각 주사위에 이벤트 추가.
// moveDiceToCamera 함수는 throwDice 함수 이후 동작에 적합.


let allDiceStopped = false; // 모든 주사위가 멈췄는지 추적

function checkAllDiceStopped() {
    allDiceStopped = diceArray.every(dice => dice.body.sleepState === CANNON.Body.SLEEPING);
    if (allDiceStopped) {
        setTimeout(() => {
            moveDiceToCameraWithAnimation(); // 애니메이션 효과로 배열
        }, 1000); // 1초 후 실행
    }
}



// 변경 사항:
// spacing 변수를 도입하여 주사위 간격을 제어.
// spacing 값이 클수록 주사위가 더 멀리 떨어져 배열됩니다.
// index - Math.floor(diceArray.length / 2)를 사용하여 배열 중심이 항상 화면 중앙에 위치하도록 조정.
// 간격 조정:
// spacing = 2 → 기본 간격.
// 필요에 따라 값을 3, 4 등으로 변경해 배열 간격을 조정할 수 있습니다


function moveDiceToCameraWithAnimation() {
    const spacing = 2; // 주사위 간격
    const duration = 300; // 애니메이션 지속 시간 (밀리초)
    const startTime = performance.now();

    diceArray.forEach((dice, index) => {
        const xTarget = (index - Math.floor(diceArray.length / 2)) * spacing; // 목표 위치
        const yTarget = 3.8;
        const zTarget = 0;

        const startPosition = { x: dice.body.position.x, y: dice.body.position.y, z: dice.body.position.z }; // 시작 위치
        const targetPosition = { x: xTarget, y: yTarget, z: zTarget }; // 목표 위치

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
                // 애니메이션 완료 후 회전 정렬
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
            }
        };

        requestAnimationFrame(animate); // 애니메이션 시작
    });
}




// 01-22 수정사항

// 동작 흐름
// 주사위가 멈춤 감지:

// checkAllDiceStopped에서 모든 주사위가 SLEEPING 상태인지 확인.
// 확인되면 1초 후 moveDiceToCameraWithAnimation 호출.
// 위치 애니메이션:

// 주사위가 현재 위치에서 목표 위치(xTarget, yTarget, zTarget)로 부드럽게 이동.
// 애니메이션 종료 후 회전 정렬:

// 각 주사위의 결과 값에 따라 지정된 회전 값으로 설정.
// 조정 가능 부분
// 애니메이션 시간:

// const duration = 1000; 값을 변경하여 이동 속도를 조절합니다. (예: 500 → 더 빠르게, 2000 → 더 느리게)
// 간격 조정:

// const spacing = 2; 값을 조정하여 주사위 간격을 변경합니다.
// 지연 시간:

// setTimeout의 대기 시간을 변경하여 주사위가 멈춘 후 배열이 시작되는 시간을 조절합니다.






diceArray.forEach(dice => {
    dice.body.addEventListener('sleep', () => {
        checkAllDiceStopped();
    });
});

