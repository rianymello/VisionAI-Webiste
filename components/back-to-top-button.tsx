"use client"

import { useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

function CatModel({ isHovered, isClicked }: { isHovered: boolean; isClicked: boolean }) {
  // This is a simplified cat model using basic shapes
  const { viewport } = useThree()
  const scale = Math.min(1, viewport.width / 5)

  return (
    <group scale={[scale, scale, scale]} rotation={[0, isHovered ? 0.2 : 0, 0]} position={[0, isHovered ? 0.1 : 0, 0]}>
      {/* Cat head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={isClicked ? "#ff00ff" : "#9966ff"} wireframe />
      </mesh>

      {/* Cat ears */}
      <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.6, 32]} />
        <meshStandardMaterial color="#9966ff" wireframe />
      </mesh>
      <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.6, 32]} />
        <meshStandardMaterial color="#9966ff" wireframe />
      </mesh>

      {/* Cat eyes */}
      <mesh position={[-0.25, 0.1, 0.7]} scale={isClicked ? [1, 0.3, 1] : [1, 1, 1]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={isClicked ? "#ff00ff" : "#00ffff"} />
      </mesh>
      <mesh position={[0.25, 0.1, 0.7]} scale={isClicked ? [1, 0.3, 1] : [1, 1, 1]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={isClicked ? "#ff00ff" : "#00ffff"} />
      </mesh>

      {/* Cat nose */}
      <mesh position={[0, -0.1, 0.7]}>
        <coneGeometry args={[0.1, 0.1, 32]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>

      {/* Cat mouth */}
      <mesh position={[0, -0.3, 0.7]} scale={[0.3, isClicked ? 0.2 : 0.1, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
    </group>
  )
}

function CatScene({ isHovered, isClicked }: { isHovered: boolean; isClicked: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CatModel isHovered={isHovered} isClicked={isClicked} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  )
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    setIsClicked(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

    // Reset clicked state after animation
    setTimeout(() => {
      setIsClicked(false)
    }, 1000)
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110"
      aria-label="Back to top"
    >
      <div className="w-full h-full">
        <Canvas>
          <CatScene isHovered={isHovered} isClicked={isClicked} />
        </Canvas>
      </div>
    </button>
  )
}

