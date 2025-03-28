import { Download, ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import ThreeJsCanvas from "@/components/three-js-canvas"
import { GridBackground } from "@/components/grid-background"
import { TerminalWindow } from "@/components/terminal-window"
import { ScrollFadeSection } from "@/components/scroll-fade-section"
import { TechEcosystem } from "@/components/tech-ecosystem"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />

      {/* Hero Section with Three.js Canvas */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 z-10">
          <ThreeJsCanvas />
        </div>
        <div className="relative z-20 flex justify-center items-center h-full">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Texto do banner à esquerda */}
            <div className="text-center md:text-left md:col-span-3">
              <div className="backdrop-blur-sm p-6 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-white">VisionAI</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-800">
                    {" "}
                    - Inteligência Facial Avançada
                  </span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  A Explorar o Futuro do Reconhecimento Facial com Tecnologia de Ponta
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <a
                    href="https://drive.google.com/file/d/1swN32wgaW8GvGB9vOMpaPbPw5t2-mOo3/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-[0_0_10px_rgba(0,150,255,0.5)] animate-pulse-slow"
                    >
                      <Download className="mr-2 h-5 w-5" /> Transferir Demo
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Espaço para a câmera 3D à direita (renderizada pelo ThreeJsCanvas) */}
            <div className="hidden md:block md:col-span-2"></div>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-400"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Terminal Section */}
      <ScrollFadeSection delay={100}>
        <section className="relative py-20 px-4" id="terminal">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-10 text-center animate-metal">Sistema de Monitorização</h2>

            {/* Terminal no meio - com sombra mais suave e profissional */}
            <div className="mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-glow">
              <TerminalWindow />
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* Technology Ecosystem Section */}
      <ScrollFadeSection delay={150}>
        <section className="relative md:py-20 px-4 md:mb-0" id="technologies">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-10 text-center animate-metal">Ecossistema Tecnológico</h2>
            <p className="text-blue-100 text-center max-w-2xl mx-auto mb-16">
              O VisionAI integra tecnologias de ponta para oferecer uma solução completa de monitorização facial e
              gestão de presença.
            </p>

            {/* Wrap TechEcosystem in a div that acts as a single unit on mobile */}
            <div className="md:block">
              <TechEcosystem />
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* App Info Section - Imagem à direita e texto à esquerda - com sombra mais suave */}
      <ScrollFadeSection delay={200}>
        <section className="relative py-20 md:py-40 px-4" id="about">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center animate-metal">Gestão Escolar Reimaginada</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Texto à esquerda - sem borda */}
              <div className="bg-blue-900/30 p-8 rounded-lg backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-blue-300">Transformando a Gestão de Presença</h3>
                <p className="text-blue-100 mb-4">
                  O VisionAI revoluciona a forma como as instituições educativas monitorizam a presença dos alunos,
                  substituindo métodos tradicionais por um sistema inteligente baseado em reconhecimento facial.
                </p>
                <p className="text-blue-100 mb-4">
                  Com o nosso sistema, é possível identificar padrões de frequência, gerar relatórios detalhados e tomar
                  decisões baseadas em dados concretos para melhorar o desempenho académico.
                </p>
                <p className="text-blue-100">
                  A análise automática de dados permite identificar precocemente riscos de abandono escolar e
                  implementar medidas preventivas, contribuindo para um ambiente educativo mais eficiente e inclusivo.
                </p>
              </div>

              {/* Imagem à direita - com efeito de flutuação */}
              <div className="relative">
                <div className="animate-float relative bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 animate-glow">
                  <div className="aspect-square rounded-lg overflow-hidden border border-blue-500/30">
                    <img
                      src="/images/chart-image.png"
                      alt="Frequência de Saídas por Pessoa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* Creator Section - Modificado para layout horizontal e com a nova foto */}
      <ScrollFadeSection delay={400}>
        <section className="relative py-20 px-4 bg-gradient-to-b from-black to-blue-900/30" id="creator">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 animate-metal">Feito por</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-rotate opacity-30 bg-gradient-to-r from-blue-500 via-transparent to-cyan-500"></div>
                <img
                  src="/images/riany-profile.png"
                  alt="Riany Mello"
                  className="relative w-40 h-40 rounded-full border-2 border-blue-400 object-cover shadow-[0_0_15px_rgba(0,150,255,0.3)]"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4 text-blue-200">Riany Mello</h3>
                <p className="text-blue-100 max-w-2xl mb-6">
                  Estudante de Inteligência Artificial e desenvolvimento de software, focada em inovação e impacto
                  social.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <a href="https://github.com/rianymello" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-500 text-blue-300 hover:bg-blue-900/20 animate-pulse-slow"
                    >
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href="https://rianymello-mu.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-blue-500 text-blue-300 hover:bg-blue-900/20 animate-pulse-slow"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-blue-800/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white animate-metal">VISIONAI</h3>
          </div>
          <div className="text-blue-400 text-sm">
            © {new Date().getFullYear()} Riany Mello. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  )
}

