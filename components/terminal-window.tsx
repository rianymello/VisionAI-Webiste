"use client"

import { useEffect, useRef, useState } from "react"

export function TerminalWindow() {
  const [text, setText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  const studentLogs = [
    "A iniciar sistema de monitorização de alunos...",
    "A carregar registos de entrada e saída...",
    "A ligar à base de dados de alunos...",
    "Sistema inicializado com sucesso.",
    "---------------------------------------------",
    "REGISTO DE ENTRADA/SAÍDA DE ALUNOS:",
    "---------------------------------------------",
    "ID: 1024 | Nome: Ana Silva | Entrada: 07:45 | Saída: 12:15 | Tempo: 4h30min",
    "ID: 1532 | Nome: João Pereira | Entrada: 08:00 | Saída: 12:00 | Tempo: 4h00min",
    "ID: 1843 | Nome: Maria Santos | Entrada: 07:30 | Saída: 12:30 | Tempo: 5h00min",
    "ID: 2156 | Nome: Pedro Oliveira | Entrada: 08:15 | Saída: 11:45 | Tempo: 3h30min",
    "ID: 1765 | Nome: Carla Souza | Entrada: 07:50 | Saída: 12:20 | Tempo: 4h30min",
    "ID: 1987 | Nome: Lucas Ferreira | Entrada: 08:05 | Saída: 12:10 | Tempo: 4h05min",
    "ID: 2201 | Nome: Juliana Costa | Entrada: 07:40 | Saída: 12:25 | Tempo: 4h45min",
    "---------------------------------------------",
    "Tempo médio de permanência: 4h20min",
    "Total de alunos registados hoje: 7",
    "Sistema de monitorização ativo e a funcionar normalmente.",
  ]

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    // Typing effect
    let currentText = ""
    let messageIndex = 0
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (messageIndex >= studentLogs.length) {
        clearInterval(typeInterval)
        return
      }

      const currentMessage = studentLogs[messageIndex]

      if (charIndex < currentMessage.length) {
        currentText += currentMessage[charIndex]
        setText(currentText)
        charIndex++
      } else {
        currentText += "\n"
        setText(currentText)
        messageIndex++
        charIndex = 0

        // Auto-scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }
    }, 50)

    return () => {
      clearInterval(cursorInterval)
      clearInterval(typeInterval)
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative bg-black border border-blue-500/50 rounded-lg overflow-hidden">
        {/* Terminal header */}
        <div className="bg-blue-900/50 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-center flex-1 text-sm font-mono text-blue-200">Sistema de Monitorização de Alunos</div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="bg-black/80 p-4 h-80 overflow-y-auto font-mono text-sm text-cyan-400 whitespace-pre-wrap"
        >
          {text}
          {cursorVisible && <span className="bg-cyan-400 text-transparent">█</span>}
        </div>

        {/* Terminal input */}
        <div className="bg-black/90 border-t border-blue-500/30 p-2 flex items-center">
          <span className="text-blue-500 mr-2">$</span>
          <div className="flex-1 bg-transparent text-cyan-400 font-mono text-sm">monitor --relatorio --data=hoje</div>
        </div>
      </div>
    </div>
  )
}

