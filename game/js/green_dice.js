// dice.js: 주사위 생성 전용 모듈
import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const params = {  // 🔹 export 추가!
    numberOfDice: 5,
    segments: 40,
    edgeRadius: 0.07,
    notchRadius: 0.12,
    notchDepth: 0.1,
};

export let diceArray = [];

export function createDiceMesh() {             
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: "green",
    });
    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);
    outerMesh.castShadow = true;
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;  
}

const diceMesh = createDiceMesh();  // ✅ 여기서 한 번만 생성 (import 제거)

export function createDice(scene, physicsWorld) {
    const mesh = diceMesh.clone();  // ✅ 이제 diceMesh를 안전하게 사용 가능
    scene.add(mesh);

    const body = new CANNON.Body({
        mass: 1, 
        shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)), 
        sleepTimeLimit: .1
    });

    body.velocity.setZero();
    body.angularVelocity.setZero();
    body.allowSleep = true;
    body.sleep();
    body.userData = { clickState: 0 };

    physicsWorld.addBody(body);

    return { mesh, body };
}


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