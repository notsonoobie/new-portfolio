import '../scss/app.scss';

import * as THREE from 'three'

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('root').style.display = 'block !important';
  }
};

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Root
const root = document.getElementById('root')

// Scene
const scene = new THREE.Scene()

// Texture Loader
const moonTexture = new THREE.TextureLoader().load('../images/content/moon.jpg')
const moonMap = new THREE.TextureLoader().load('../images/content/normal-map.jpeg')

// Objects
const moonGeometry = new THREE.SphereGeometry(1, 10, 10);

const particleGeometry = new THREE.BufferGeometry;
const particleCount = 2000;
const particlePositionArray = new Float32Array(particleCount * 3)
for (let i = 0; i < particleCount; i++) {
  particlePositionArray[i] = (Math.random() - .5) * (Math.random() * 7)
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositionArray, 3))


// Materials
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  normalMap: moonMap,
  blending: THREE.AdditiveBlending,
  roughness: 1000
})
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.009,
  transparent: true,
  color: 'white',
  blending: THREE.AdditiveBlending
})

// Mesh
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)

const particleMesh = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(particleMesh)
scene.add(moonMesh)

// Lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(-2, 2, 1)
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

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

// Moon Positions
let moonPostions = {
  x: 1.3,
  y: .3,
  z: .4,
}
const handleScroll = (e) => {
  moonPostions.x = (root.scrollTop / root.scrollHeight) + 1.3
  moonPostions.y = (root.scrollTop / root.scrollHeight) * -1.1 + .3
  moonPostions.z = (root.scrollTop / root.scrollHeight) + .4
}

root.addEventListener('scroll', handleScroll, false)

/**
 * Animate
*/
const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  moonMesh.rotation.y = .0005 * elapsedTime * (mousexY || 0.2)
  moonMesh.rotation.x = .0005 * elapsedTime * (mousexX)
  moonMesh.position.x = moonPostions.x
  moonMesh.position.y = moonPostions.y
  moonMesh.position.z = moonPostions.z

  particleMesh.rotation.x = (-mousexY) * elapsedTime * .00005
  particleMesh.rotation.y = (-mousexX) * elapsedTime * .00005

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
