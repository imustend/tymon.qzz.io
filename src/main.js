import './style.css'
import './sample.js'
import * as THREE from 'three';
import {waveShader} from "./shaders/waveShader.js";
import {landShader} from "./shaders/landShader.js";

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    }
}



let shaders = [landShader];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, 2, 2, 1000 );


const renderer = new THREE.WebGLRenderer( {
    antialias: true,
});
// renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("render").appendChild( renderer.domElement );

const material = shaders.sample();

const geometry = new THREE.PlaneGeometry(40,40,256,256);
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

let clock = new THREE.Clock();
camera.position.z = 35;
camera.position.y = 2;
camera.position.x = 0
mesh.rotation.x = Math.PI / -2;
let t = 0;

material.uniforms.useed.value = Math.random() * 10000;


function animate() {
    t += clock.getDelta();
    material.uniforms.time.value = t;
    // mesh.rotation.z += 0.0005;
    resizeCanvasToDisplaySize();
    renderer.render( scene, camera );

}
renderer.setAnimationLoop( animate );



