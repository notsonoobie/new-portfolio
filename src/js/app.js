import '../scss/app.scss';

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture Loader
const loader = new THREE.TextureLoader()
const crossLoader = loader.load('./cross.png')

// Objects
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

const particleGeometry = new THREE.BufferGeometry;
const particleCount = 8000;
const particlePositionArray = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
  particlePositionArray[i] = (Math.random() - .5) * (Math.random() * 5)
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositionArray, 3))

// Materials
const material = new THREE.PointsMaterial({
  size: 0.01
})
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.004,
  transparent: true,
  // map: crossLoader,
  color: 'grey',
  blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Points(geometry, material)
const particleMesh = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(sphere, particleMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Mouse Positions
 */

let mousexX = 0;
let mousexY = 0;
const handleMouseMove = (e) => {
  mousexX = e.clientX
  mousexY = e.clientY
}

document.addEventListener('mousemove', handleMouseMove, false)

/**
 * Animate
*/

const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = .0005 * elapsedTime * (mousexY || 0.2)
  sphere.rotation.x = .0005 * elapsedTime * (mousexX)
  particleMesh.rotation.x = -mousexY * elapsedTime * .00005
  particleMesh.rotation.y = -mousexX * elapsedTime * .00005

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()