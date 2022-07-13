var scene, camera, renderer, cube, controls, light, light2;
var width = window.innerWidth,
    height = window.innerHeight;
var snakeBody = [];
var snakeWH = 25;
var cubes = [];
var dir = 37;
var running = false;
var interval;
var boardWidth = 1500,
    boardHeight = 1000,
    boardZ = 50;
var onMove = false;
var food;
var gameSpeed = 100;
var spotLight = new THREE.SpotLight( 0xffffff );
var purpleList = [
    "#E6E6FA",
    "#D8BFD8",
    "#DDA0DD",
    "#EE82EE",
    "#DA70D6",
    "#FF00FF",
    "#BA55D3",
    "#9370DB",
    "#8A2BE2",
    "#9400D3",
    "#8B008B",
    "#800080",
    "#4B0082"
]
function init() {

    initSnakeBody(5);

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 500, 10000);


    //camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 2000 );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableKeys = false;
    controls.update();

    light = new THREE.AmbientLight( 0xffffff, 1); // soft white light
    scene.add( light );
    light2 = new THREE.PointLight( 0xffffff, 15); // soft white light
    light2.position.set( 1500, 1000, 300 );
    //scene.add( light2 );

    var pointLightHelper = new THREE.PointLightHelper( light2, 10 );
    //scene.add( pointLightHelper );



    spotLight.position.set( 500, 500, 1000 );
    spotLight.angle = 0.20;
    spotLight.penumbra = 1;
    spotLight.intensity = 4;
    spotLight.distance = 2500;
    spotLight.castShadow = true;
    spotLight.castShadow = true;


    // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // scene.add( spotLightHelper );

    const geometry = new THREE.BoxGeometry( boardWidth, boardHeight, boardZ );
    const texture = new THREE.TextureLoader().load('images/grass.jpg');
    const material = new THREE.MeshLambertMaterial( {map: texture} );
    var metbrown = new THREE.MeshLambertMaterial( {color : 0xd99845 } );
    createBoard();
    cube2 = new THREE.Mesh(geometry, metbrown);
    cube2.position.z -= boardZ;
    //cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);
    scene.add(cube2);

    setCubes();
    addFood();

    spotLight.target = cubes[2];
    scene.add( spotLight );

    camera.position.x = 0;
    camera.position.y = -980;
    camera.position.z = 800;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    dropFoodAnimation();
    //rotateObjects();
    renderer.render(scene, camera);
}

function createBoard() {
    var geo = new THREE.BoxGeometry( snakeWH, snakeWH, snakeWH * 3 );
    var texture = new THREE.TextureLoader().load('images/grass.jpg');
    var material = new THREE.MeshLambertMaterial( {map: texture} );

    for(var i = (((boardWidth / 2) / snakeWH) * - 1) + 1; i < ((boardWidth / 2) / snakeWH); i++){
        for(var j = (((boardHeight / 2) / snakeWH) * -1) + 1; j < ((boardHeight / 2) / snakeWH); j++){
            var part = new THREE.Mesh(geo, material);
            part.position.x = i * snakeWH;
            part.position.y = j * snakeWH;
            part.position.z = 0;
            scene.add(part);
        }
    }
}

function rndCubes(count) {
    for(var i = 0; i < count; i++){
        var size = Math.round(Math.random() * 50) + 2;
        var geo = new THREE.BoxBufferGeometry( size, size, size );
        //var geo = new THREE.SphereBufferGeometry( size, 16, 16 );
        var rndPurple = Math.round(Math.random() * (purpleList.length - 1));
        var mat = new THREE.MeshLambertMaterial( {
            transparent : true,
            opacity : 1,
            color: purpleList[Math.round(Math.random() * (purpleList.length - 1))],
            emissive: purpleList[Math.round(Math.random() * (purpleList.length - 1))],
            emissiveIntensity: 1
        } );
        var cube = new THREE.Mesh(geo, mat);
        cube.position.x = Math.random() * 1000 - 500;
        cube.position.y = Math.random() * 1000 - 500;
        cube.position.z = Math.random() * 1000 - 500;
        scene.add(cube);
    }
}

function rotateObjects() {
    for(var i = 0; i < scene.children.length; i++){
        if(scene.children[i].type == "Mesh"){
            scene.children[i].rotation.x += Math.random() * 0.01;
            scene.children[i].rotation.y += Math.random() * 0.01;
            scene.children[i].rotation.z += Math.random() * 0.01;
        }
    }
}

function initSnakeBody(len) {
    for(var i = 0; i < len; i++){
        snakeBody.push({x : i, y : 0, z : boardZ});
    }
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

}

$(document).keyup(function (e) {
    e.preventDefault();
    if(dir == 37 && e.keyCode == 39) return;
    if(dir == 39 && e.keyCode == 37) return;
    if(dir == 38 && e.keyCode == 40) return;
    if(dir == 40 && e.keyCode == 38) return;
    if(onMove) return;
    switch (e.keyCode){
        case 37 : //left
            dir = e.keyCode;
            break;
        case 38: //up
            dir = e.keyCode;
            break;
        case 39: //right
            dir = e.keyCode;
            break;
        case 40: //down
            dir = e.keyCode;
            break;
    }
    onMove = true;
    running = true;

})

function dropFoodAnimation() {
    food.rotation.x += 0.01;
    //food.rotation.z += 0.1;
    food.rotation.y += 0.01;
    if(food.position.z > boardZ){
        food.position.z = food.position.z - 10;
    }
}

interval = setInterval(gameInterval, gameSpeed);

function gameInterval() {
    if(running){
        var tail = snakeBody.pop();
        tail.x = snakeBody[0].x;
        tail.y = snakeBody[0].y;
        tail.z = snakeBody[0].z;
        switch (dir){
            case 37 : //left
                tail.x--;
                break;
            case 38: //up
                tail.y++;
                break;
            case 39: //right
                tail.x++;
                break;
            case 40: //down
                tail.y--;
                break;
        }
        snakeBody.unshift(tail);
        if(snakeBody[0].x * snakeWH > (boardWidth / 2) - snakeWH || snakeBody[0].y * snakeWH > (boardHeight / 2) - snakeWH ||
            snakeBody[0].x * snakeWH < (boardWidth / 2 * -1) + snakeWH || snakeBody[0].y * snakeWH < (boardHeight / 2 * -1) + snakeWH ||
            checkCrashHead()){
            clearInterval(interval);
        }else{
            checkEat();
            updateSnake();
        }
    }
}

function checkCrashHead() {
    var head = snakeBody[0]
    for(var i = 1; i < snakeBody.length; i++){
        if(snakeBody[i].x == head.x && snakeBody[i].y == head.y){
            return true;
        }
    }
    return false;
}
function checkEat() {
    if(food.position.x == snakeBody[0].x * snakeWH && food.position.y == snakeBody[0].y * snakeWH){
        snakeBody.unshift({x : food.position.x / snakeWH, y : food.position.y / snakeWH, z : boardZ});
        const texture = new THREE.TextureLoader().load('images/snake.jpg');
        food.material = new THREE.MeshLambertMaterial( {map: texture} );
        food.geometry = new THREE.BoxGeometry( snakeWH, snakeWH, snakeWH );
        food.rotation.x = 0;
        food.rotation.y = 0;
        cubes.push(food);
        updateSnake();
        if(gameSpeed > 50){
            gameSpeed -= 10;
        }
        clearInterval(interval);
        interval = setInterval(gameInterval, gameSpeed);
        addFood();
    }
}
function addFood() {
    foodX = (Math.round(Math.random() * ((boardWidth / snakeWH) - 2))) - (((boardWidth / snakeWH) - 2) / 2);
    foodY = (Math.round(Math.random() * ((boardHeight / snakeWH) - 2))) - (((boardHeight / snakeWH) - 2) / 2);
    for(var i = 0; i < snakeBody.length; i++){
        if(snakeBody[i].x == foodX && snakeBody[i].y == foodY){
            addFood();
            return;
        }
    }
    //const geo = new THREE.BoxGeometry( snakeWH, snakeWH, snakeWH );
    const geo = new THREE.SphereBufferGeometry( snakeWH, 32, 32 );
    const texture = new THREE.TextureLoader().load('images/football.jpg');
    const mat = new THREE.MeshLambertMaterial( {map: texture} );
    //const mat = new THREE.MeshBasicMaterial({color : 0xff0000});
    food = new THREE.Mesh(geo, mat);
    food.position.x = foodX * snakeWH;
    food.position.y = foodY * snakeWH;
    food.position.z = boardZ * 5;
    scene.add(food);
}

function updateSnake() {
    for(var i = 0; i < snakeBody.length; i++){
        cubes[i].position.x = snakeBody[i].x * snakeWH;
        cubes[i].position.y = snakeBody[i].y * snakeWH;
        //cubes[i].position.z = snakeBody[i].z * snakeWH;
    }
    onMove = false;
}



function setCubes() {
    const geo = new THREE.BoxGeometry( snakeWH, snakeWH, snakeWH );
    //const mat = new THREE.MeshNormalMaterial({color : 0xff000});
    const texture = new THREE.TextureLoader().load('images/snake.jpg');
    const mat = new THREE.MeshLambertMaterial( {map: texture} );
    for(var i = 0; i < snakeBody.length; i++){
        var cube = new THREE.Mesh(geo, mat);
        cube.position.x = snakeBody[i].x * snakeWH;
        cube.position.y = snakeBody[i].y * snakeWH;
        cube.position.z = snakeBody[i].z;// * snakeWH;
        cubes.push(cube);
        scene.add(cube);
    }
}


window.addEventListener('resize', onWindowResize, false);

init();
animate();


