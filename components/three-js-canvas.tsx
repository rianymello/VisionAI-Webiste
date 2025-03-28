"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useMobile } from "@/hooks/use-mobile"

// Galaxy component that appears when zoomed out
function Galaxy({ visible }: { visible: boolean }) {
  const galaxyRef = useRef<THREE.Points>(null)
  const galaxyMaterial = useRef<THREE.PointsMaterial>(null)

  useEffect(() => {
    // Create galaxy particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 5000

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorInside = new THREE.Color(0x00aaff) // Blue center
    const colorOutside = new THREE.Color(0x0044ff) // Darker blue outside

    for (let i = 0; i < particleCount; i++) {
      // Position
      const radius = Math.random() * 10 + 5
      const spinAngle = radius * 0.5
      const branchAngle = ((i % 3) * Math.PI * 2) / 3

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i * 3 + 1] = randomY
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / 15)

      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      alphaMap: createCircleTexture(),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0,
    })

    galaxyMaterial.current = particlesMaterial

    if (galaxyRef.current) {
      galaxyRef.current.geometry = particlesGeometry
      galaxyRef.current.material = particlesMaterial
    }

    return () => {
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [])

  // Create a circular texture for particles
  const createCircleTexture = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 32
    canvas.height = 32

    const context = canvas.getContext("2d")
    if (!context) return null

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = canvas.width / 3

    context.beginPath()
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    context.fillStyle = "white"
    context.fill()

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }

  // Animate galaxy
  useFrame((_, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.05
    }

    // Fade in/out based on visibility
    if (galaxyMaterial.current) {
      if (visible) {
        galaxyMaterial.current.opacity = Math.min(galaxyMaterial.current.opacity + delta * 0.5, 1)
      } else {
        galaxyMaterial.current.opacity = Math.max(galaxyMaterial.current.opacity - delta * 0.5, 0)
      }
    }
  })

  return <points ref={galaxyRef} />
}

// Blue planet component
function Planet({
  position,
  size,
  rotationSpeed,
  visible,
}: {
  position: [number, number, number]
  size: number
  rotationSpeed: number
  visible: boolean
}) {
  const planetRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0
    }
  }, [])

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed
    }

    // Fade in/out based on visibility
    if (materialRef.current) {
      if (visible) {
        materialRef.current.opacity = Math.min(materialRef.current.opacity + delta * 0.5, 0.8)
      } else {
        materialRef.current.opacity = Math.max(materialRef.current.opacity - delta * 0.5, 0)
      }
    }
  })

  return (
    <mesh ref={planetRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={new THREE.Color(0x00aaff)}
        emissive={new THREE.Color(0x0066ff)}
        emissiveIntensity={0.5}
        transparent={true}
        wireframe={true}
      />
    </mesh>
  )
}

export default function ThreeJsCanvas() {
  const isMobile = useMobile()
  const [isDragging, setIsDragging] = useState(false)

  function Scene() {
    const { camera, scene } = useThree()
    const controlsRef = useRef<any>()
    const cameraModelRef = useRef<THREE.Group>(new THREE.Group())
    const binaryParticlesRef = useRef<THREE.Points>()
    const [zoomedOut, setZoomedOut] = useState(false)
    const [cameraDistance, setCameraDistance] = useState(5)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [viewMode, setViewMode] = useState<"normal" | "galaxy">("normal")

    // Target positions for the camera
    const normalPosition = new THREE.Vector3(0, 0, 5)
    const galaxyPosition = new THREE.Vector3(0, 15, 0) // Position above to see galaxy and camera
    const galaxyTarget = new THREE.Vector3(0, 0, 0) // Look at center

    // Setup camera
    useEffect(() => {
      camera.position.set(0, 0, 5)
    }, [camera])

    // Function to smoothly transition camera to a new position
    const transitionCameraTo = (targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3, duration = 2) => {
      if (isTransitioning) return

      setIsTransitioning(true)

      const startPosition = camera.position.clone()
      const startRotation = camera.quaternion.clone()

      // Create a temporary camera to calculate the target rotation
      const tempCamera = camera.clone()
      tempCamera.position.copy(targetPosition)
      tempCamera.lookAt(targetLookAt)
      const targetRotation = tempCamera.quaternion.clone()

      const startTime = Date.now()

      const animate = () => {
        const now = Date.now()
        const elapsed = (now - startTime) / 1000 // seconds
        const progress = Math.min(elapsed / duration, 1)

        // Ease in-out function
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress

        // Update position
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress)

        // Update rotation (using quaternion slerp)
        camera.quaternion.slerpQuaternions(startRotation, targetRotation, easeProgress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsTransitioning(false)

          // Update controls target
          if (controlsRef.current) {
            controlsRef.current.target.copy(targetLookAt)
          }
        }
      }

      animate()
    }

    // Handle zoom threshold crossing
    useEffect(() => {
      if (zoomedOut && viewMode === "normal" && !isTransitioning) {
        setViewMode("galaxy")
        transitionCameraTo(galaxyPosition, galaxyTarget)
      } else if (!zoomedOut && viewMode === "galaxy" && !isTransitioning) {
        setViewMode("normal")
        transitionCameraTo(normalPosition, new THREE.Vector3(0, 0, 0))
      }
    }, [zoomedOut, viewMode, isTransitioning])

    // Modificar a criação da câmera 3D
    useEffect(() => {
      // Create a single material for the entire camera
      const cameraMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        wireframe: true,
      })

      // Create a group to hold our camera parts
      const cameraGroup = new THREE.Group()

      // Create the camera body using a box
      const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 0.8)
      const body = new THREE.Mesh(bodyGeometry, cameraMaterial.clone())
      body.material.color.set(0x0088ff)

      // Create the lens using a cylinder
      const lensGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 32)
      const lens = new THREE.Mesh(lensGeometry, cameraMaterial)
      // Position the lens to connect with the body
      lens.position.z = 0.7
      lens.rotation.x = Math.PI / 2

      // Create the lens glass
      const lensGlassGeometry = new THREE.CircleGeometry(0.35, 32)
      const lensGlassMaterial = cameraMaterial.clone()
      lensGlassMaterial.color.set(0x00ccff)
      const lensGlass = new THREE.Mesh(lensGlassGeometry, lensGlassMaterial)
      lensGlass.position.z = 1.05
      lensGlass.rotation.x = Math.PI / 2

      // Create the viewfinder
      const viewfinderGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const viewfinder = new THREE.Mesh(viewfinderGeometry, cameraMaterial)
      viewfinder.position.set(0, 0.7, 0)

      // Create the flash
      const flashGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1)
      const flashMaterial = cameraMaterial.clone()
      flashMaterial.color.set(0x00ccff)
      const flash = new THREE.Mesh(flashGeometry, flashMaterial)
      flash.position.set(0.6, 0.5, 0.4)

      // Add all parts to the group
      cameraGroup.add(body)
      cameraGroup.add(lens)
      cameraGroup.add(lensGlass)
      cameraGroup.add(viewfinder)
      cameraGroup.add(flash)

      // Add glow points
      const glowGeometry = new THREE.SphereGeometry(0.1, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.8,
      })

      const glowPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0.6, y: 0.5, z: 0.4 },
        { x: 0, y: 0.7, z: 0 },
      ]

      glowPoints.forEach((point) => {
        const glow = new THREE.Mesh(glowGeometry, glowMaterial)
        glow.position.set(point.x, point.y, point.z)
        cameraGroup.add(glow)
      })

      // Position and scale based on screen size
      if (isMobile) {
        // Center the camera on mobile
        cameraGroup.position.set(0, 0, 0)
        // Smaller scale for mobile
        cameraGroup.scale.set(0.8, 0.8, 0.8)
      } else {
        // Position to the right on desktop
        cameraGroup.position.set(3, 0, 0)
        // Larger scale for desktop
        cameraGroup.scale.set(1.2, 1.2, 1.2)
      }

      cameraModelRef.current = cameraGroup
      scene.add(cameraGroup)

      return () => {
        scene.remove(cameraGroup)
        // Dispose geometries and materials
        bodyGeometry.dispose()
        lensGeometry.dispose()
        lensGlassGeometry.dispose()
        viewfinderGeometry.dispose()
        flashGeometry.dispose()
        glowGeometry.dispose()
        body.material.dispose()
        lens.material.dispose()
        lensGlass.material.dispose()
        viewfinder.material.dispose()
        flash.material.dispose()
        glowPoints.forEach((_, i) => {
          cameraGroup.children[i + 5].material.dispose()
        })
      }
    }, [scene, isMobile])

    // Create binary particles - Tornando-as mais azuis
    useEffect(() => {
      const binaryParticlesGeometry = new THREE.BufferGeometry()
      const binaryParticlesMaterial = new THREE.PointsMaterial({
        color: 0x0088ff, // Azul mais intenso
        size: 0.2,
        transparent: true,
        opacity: 0.7,
      })

      const binaryParticlesVertices = []
      for (let i = 0; i < 200; i++) {
        const x = (Math.random() - 0.5) * 20
        const y = (Math.random() - 0.5) * 20
        const z = (Math.random() - 0.5) * 20
        binaryParticlesVertices.push(x, y, z)
      }

      binaryParticlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(binaryParticlesVertices, 3))
      const binaryParticles = new THREE.Points(binaryParticlesGeometry, binaryParticlesMaterial)
      binaryParticlesRef.current = binaryParticles
      scene.add(binaryParticles)

      return () => {
        scene.remove(binaryParticles)
        binaryParticlesGeometry.dispose()
        binaryParticlesMaterial.dispose()
      }
    }, [scene])

    // Add lights
    useEffect(() => {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)

      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      return () => {
        scene.remove(directionalLight)
        scene.remove(ambientLight)
      }
    }, [scene])

    // Animation loop - apenas rotação no próprio eixo quando não está interagindo
    useFrame(() => {
      if (cameraModelRef.current && !isDragging) {
        cameraModelRef.current.rotation.y += 0.01 // Gira no próprio eixo Y
      }

      if (binaryParticlesRef.current) {
        binaryParticlesRef.current.rotation.y += 0.001
        binaryParticlesRef.current.rotation.x += 0.0005
      }

      if (controlsRef.current) {
        controlsRef.current.update()

        // Check camera distance to determine if zoomed out
        const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
        setCameraDistance(distance)

        // Only update zoomedOut state if not transitioning
        if (!isTransitioning) {
          setZoomedOut(distance > 8) // Consider zoomed out if distance > 8
        }
      }
    })

    // Handle wheel event to trigger galaxy view
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !zoomedOut && !isTransitioning) {
        // Scrolling down/zooming out
        setZoomedOut(true)
      } else if (e.deltaY < 0 && zoomedOut && !isTransitioning) {
        // Scrolling up/zooming in
        setZoomedOut(false)
      }
    }

    useEffect(() => {
      window.addEventListener("wheel", handleWheel)
      return () => {
        window.removeEventListener("wheel", handleWheel)
      }
    }, [zoomedOut, isTransitioning])

    return (
      <>
        {/* Galaxy and planets that appear when zoomed out */}
        <Galaxy visible={zoomedOut} />
        <Planet position={[-12, 2, -5]} size={1.5} rotationSpeed={0.2} visible={zoomedOut} />
        <Planet position={[10, -3, -8]} size={1} rotationSpeed={0.3} visible={zoomedOut} />
        <Planet position={[8, 5, -10]} size={2} rotationSpeed={0.15} visible={zoomedOut} />
        <Planet position={[-7, -4, -12]} size={0.8} rotationSpeed={0.4} visible={zoomedOut} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          enableZoom={true}
          zoomSpeed={0.8}
          autoRotate={false}
          rotateSpeed={1.5}
          enablePan={false}
          minPolarAngle={Math.PI / 4} // Limita a rotação vertical
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 2} // Limita a rotação horizontal para a esquerda
          maxAzimuthAngle={Math.PI / 2} // Limita a rotação horizontal para a direita
          minDistance={3} // Minimum zoom distance
          maxDistance={20} // Maximum zoom distance - increased to allow galaxy view
          onStart={() => setIsDragging(true)}
          onEnd={() => setIsDragging(false)}
        />
      </>
    )
  }

  return (
    <div className="absolute inset-0">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}

