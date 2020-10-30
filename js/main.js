
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import * as OBJLoader from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/OBJLoader.js';
import * as MTLLoader from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/MTLLoader.js';


var scene = new THREE.Scene()


var renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0xe0e0e0)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
)

camera.position.set(0, -15, 1)
//camera.position.set(-15,0,1)
camera.up.set(0,0, 1)
camera.lookAt(new THREE.Vector3(0,0,0))

var light = new THREE.DirectionalLight( new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
var light2 = new THREE.DirectionalLight( new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
var light3 = new THREE.DirectionalLight(0xffffff, 1.0)


light.position.set(-100,0,100)
light2.position.set(100,0,100)
light3.position.set(100,0,-100).normalize()

scene.add(light)
scene.add(light2)
scene.add(light3)

var video = document.getElementById('video')

var videoText = new THREE.VideoTexture(video)


var geo = new THREE.BoxGeometry(8, 5, 0)
var mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
    map: videoText
})

let broad = new THREE.Mesh(geo,mat)

broad.rotateX(-80)
broad.position.set(0,0,0)

scene.add(broad)

// var obj
var matlLoader = new MTLLoader.MTLLoader()
matlLoader.setPath('./3dOjbect/')

matlLoader.load('Cliff_Rock_Two_OBJ.mtl', function(materials){
    materials.preload()

    var objLoader = new OBJLoader.OBJLoader() 
    objLoader.setPath('./3dOjbect/')
    objLoader.load('Cliff_Rock_Two_OBJ.obj', function(object){
        console.log(object)
        object.material = materials
        object.scale.set(0.035,0.035,0.035)
        object.position.set(-1.9,0.05,-1.5)
        object.rotateZ(-(Math.PI / 2))

        scene.add(object)
    })
})


// flick
let tabTime = [14.8, 15, 23.5, 26.35, 26.8, 27, 28.4, 33, 36.3, 37, 40.2, 41.4, 42, 43.84, 44, 44.39, 46.5, 46.8, 47, 49, 49.5, 50,50.2, 50.5, 50.6, 50.9, 51.4, 51.79, 52, 53.3, 54, 54.5, 55, 55.2, 55.5, 56, 56.5, 57, 57.5, 58, 58.5, 59, 59.5, 60 ]
let index = 0
let flick = false

function flicker(){
    if(flick){
        //console.log(video.currentTime)
        let time = 0
        console.log(video.currentTime)
        time = video.currentTime

        if( index == tabTime.length){
            flickFun()
            if (video.ended){
                flick = false
                videoPlay = false
                setTimeout(function() {
                    renderer.setClearColor(0xe0e0e0)
                }, 1000)
                index = 0
            }
        }

        if( time > tabTime[index]){
            flickFun()
            index++
        }
    }
}

let flickColor = "Black"

function flickFun() {
    if (flickColor == "Black"){
        renderer.setClearColor("green")
        flickColor = "Green"
    }else {
        renderer.setClearColor("black")
        flickColor = "Black"
    }
}

//Render
function render(){
    renderer.render(scene, camera)
    flicker()
    
    requestAnimationFrame(render)
}

render()

// controls
const controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener('resize', () => {
 
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight   
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})

let videoPlay = false

window.addEventListener('click', ()=> {
    if(!videoPlay){
        video.play()
        video.volume = 0.2;
        videoPlay = true
        flick = true
    } 
    else{
        video.pause()
        videoPlay = false
        flick = false
    }
})

