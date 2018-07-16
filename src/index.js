import * as THREE from "three";
import OrbitControlsBootstrap from "three-orbit-controls";
import diamondSquare from "./diamondsquare";
import hillGenerator from "./hillgenerator";

let container, camera, scene, renderer, material, plane, ambLight;
let clock, controls;
let formCameraX, formCameraY, formCameraZ;
let field;
const minHeight = -1.0, maxHeight = 5.0;
const OrbitControls = OrbitControlsBootstrap(THREE);
const vertexShader = `varying float vColor;

void main()
{
	vec4 worldPosition = modelMatrix * vec4(position, 1.0);
	vColor = worldPosition.xyz[1] / ${(maxHeight - minHeight).toFixed(1)};
	gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
const fragmentShader = `precision mediump float;

varying float vColor;

void main()
{
	gl_FragColor = vec4(vColor, vColor, vColor, 1.0);
}`;

function init() {
	formCameraX = document.getElementById("camera-x");
	formCameraY = document.getElementById("camera-y");
	formCameraZ = document.getElementById("camera-z");

	clock = new THREE.Clock();

	container = document.getElementById( "viewport" );
	// container.style.marginLeft = "300px";
	// document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 90, (window.innerWidth - 300) / window.innerHeight, 1, 2000 );
	camera.position.set( 20, 20, 30 );
	controls = new OrbitControls( camera, container );
	controls.damping = 0.2;
	controls.addEventListener( "change", render );

	scene = new THREE.Scene();

	// Grid
	field = diamondSquare(100, 0.125);
	// field = hillGenerator(100, 0, 10, 3, 2);

	var hills = field.geometry(minHeight, maxHeight);// new THREE.Geometry();

	material = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	});

	plane = new THREE.Mesh( hills, material);
	scene.add( plane );


	// Lights
	ambLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );
	scene.add( ambLight );
	

	// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	// directionalLight.position.set( 70, 40, 0.25 );
	// scene.add( directionalLight );


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth - 300, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( "resize", onWindowResize, false );
}


function onWindowResize() {

	camera.aspect = (window.innerWidth - 300) / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth - 300, window.innerHeight );

	render();

}

function render() {
	renderer.render( scene, camera );
	formCameraX.textContent = camera.position.x;
	formCameraY.textContent = camera.position.y;
	formCameraZ.textContent = camera.position.z;
}

window.addEventListener("load", function(){
	init();
	render();
});