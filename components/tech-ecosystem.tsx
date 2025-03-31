"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Camera, Brain, Eye, LineChart, FileText, Shield, Server, Code } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface TechCardProps {
  icon: React.ReactNode
  name: string
  description: string
  delay: number
  index: number
  isMobile: boolean
}

const TechCard = ({ icon, name, description, delay, index, isMobile }: TechCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Posições para desktop
  let x = 0
  let y = 0

  if (!isMobile) {
    // Layout desktop: 4 à esquerda, 4 à direita
    if (index < 4) {
      // Lado esquerdo
      x = -280
      y = -160 + index * 100
    } else {
      // Lado direito
      x = 280
      y = -160 + (index - 4) * 100
    }
  } else {
    // No mobile, todos os cards ficam alinhados verticalmente abaixo da câmera
    x = 0
    y = 100 + index * 90 // Espaçamento vertical entre os cards
  }

  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: 1, x, y }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Connection line - apenas no desktop */}
      {!isMobile && (
        <div
          className="absolute top-1/2 h-[1px] bg-blue-500/30"
          style={{
            // Reduced line length by 25%
            width: (Math.abs(x) - 40) * 0.75,
            left: index < 4 ? "100%" : "auto",
            right: index >= 4 ? "100%" : "auto",
          }}
        />
      )}

      <motion.div
        className={`bg-blue-900/30 backdrop-blur-sm rounded-lg border border-blue-500/30 p-3 flex items-center gap-3 cursor-pointer ${isMobile ? "w-[280px]" : "w-44"} h-20`}
        whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 64, 175, 0.4)" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center text-blue-300">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-200">{name}</h4>
          {isHovered && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-blue-300 mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function TechEcosystem() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const technologies = [
    {
      icon: <Eye className="h-5 w-5" />,
      name: "Face API",
      description: "Reconhecimento facial avançado",
      delay: 0.1,
    },
    {
      icon: <Brain className="h-5 w-5" />,
      name: "TensorFlow",
      description: "Framework de aprendizagem profunda",
      delay: 0.2,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      name: "Relatórios Detalhados",
      description: "Análise completa de dados de presença",
      delay: 0.3,
    },
    {
      icon: <Shield className="h-5 w-5" />,
      name: "Controlo de Acesso",
      description: "Gestão segura de entradas e saídas",
      delay: 0.4,
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      name: "Monitorização",
      description: "Acompanhamento em tempo real",
      delay: 0.5,
    },
    {
      icon: <Camera className="h-5 w-5" />,
      name: "OpenCV",
      description: "Processamento de imagem e visão computacional",
      delay: 0.6,
    },
    {
      icon: <Server className="h-5 w-5" />,
      name: "Next.js",
      description: "Framework React para frontend e backend",
      delay: 0.7,
    },
    {
      icon: <Code className="h-5 w-5" />,
      name: "TypeScript",
      description: "Linguagem de programação tipada",
      delay: 0.8,
    },
  ]

  // Ajustar altura do container com base no dispositivo
  const containerHeight = isMobile ? 250 : 600

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{
        height: containerHeight,
        // On mobile, add margin-bottom
        marginBottom: isMobile ? "750px" : "0",
      }}
    >
      {/* Central circle - posicionamento fixo */}
      <div
        className="absolute z-10"
        style={{
          // Move the camera up on mobile devices
          marginTop: isMobile ? "-100px" : "0",
        }}
      >
        <motion.div
          className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,150,255,0.5)]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Camera className="h-12 w-12 text-white" />
        </motion.div>
      </div>

      {/* Technology cards */}
      {technologies.map((tech, index) => (
        <TechCard
          key={index}
          icon={tech.icon}
          name={tech.name}
          description={tech.description}
          index={index}
          delay={tech.delay}
          isMobile={isMobile}
        />
      ))}
    </div>
  )
}

