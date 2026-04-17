import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import diamondSquare from './diamondsquare'

const minHeight = -1.0
const maxHeight = 5.0

function getCameraSpans(): [HTMLSpanElement, HTMLSpanElement, HTMLSpanElement] | null {
  const x = document.getElementById('camera-x')
  const y = document.getElementById('camera-y')
  const z = document.getElementById('camera-z')
  if (!(x instanceof HTMLSpanElement && y instanceof HTMLSpanElement && z instanceof HTMLSpanElement)) {
    return null
  }
  return [x, y, z]
}

function init(): void {
  const formCamera = getCameraSpans()
  if (!formCamera) return
  const [formCameraX, formCameraY, formCameraZ] = formCamera

  const container = document.getElementById('viewport')
  if (!(container instanceof HTMLElement)) return

  const sidebarWidth = 300

  const camera = new THREE.PerspectiveCamera(90, (window.innerWidth - sidebarWidth) / window.innerHeight, 1, 2000)
  camera.position.set(20, 20, 30)

  const controls = new OrbitControls(camera, container)
  controls.enableDamping = true
  controls.dampingFactor = 0.2

  const scene = new THREE.Scene()

  const field = diamondSquare(100, 0.125)
  // Alternative terrain: import hillGenerator from './hillgenerator' then
  // const field = hillGenerator(100, 0, 10, 3, 2)

  const hills = field.geometry(minHeight, maxHeight)

  const material = new THREE.MeshBasicMaterial({ vertexColors: true })

  const plane = new THREE.Mesh(hills, material)
  scene.add(plane)

  const ambLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambLight)

  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth - sidebarWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  function onWindowResize(): void {
    camera.aspect = (window.innerWidth - sidebarWidth) / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth - sidebarWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  function syncCameraLabels(): void {
    formCameraX.textContent = String(camera.position.x)
    formCameraY.textContent = String(camera.position.y)
    formCameraZ.textContent = String(camera.position.z)
  }

  function tick(): void {
    requestAnimationFrame(tick)
    controls.update()
    renderer.render(scene, camera)
    syncCameraLabels()
  }

  requestAnimationFrame(tick)
  syncCameraLabels()
}

window.addEventListener('load', init)
