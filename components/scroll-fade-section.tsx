"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollFadeSectionProps {
  children: ReactNode
  delay?: number
}

export function ScrollFadeSection({ children, delay = 0 }: ScrollFadeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100")
              entry.target.classList.remove("translate-y-10")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [delay])

  return (
    <div ref={sectionRef} className="opacity-0 translate-y-10 transition-all duration-700 ease-out">
      {children}
    </div>
  )
}

