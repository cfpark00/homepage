"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface FlyingImage {
  id: number
  src: string
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  scale: number
}

const publicationImages = [
  "/images/publications/debiasing_with_diffusion.png",
  "/images/publications/dustmap_correction.gif",
  "/images/publications/high_d_non_gaussianity.png",
  "/images/publications/membrain.png",
  "/images/publications/shadow_removal.png",
  "/images/publications/smartem.png",
  "/images/publications/targettrack.gif",
  "/images/publications/vdm4cdm_2d.gif",
  "/images/publications/vdm4cdm_3d.gif",
  "/images/publications/whole_brain_imaging.gif",
  "/images/publications/hidden_emergence.png",
  "/images/publications/iclr_gif.gif",
]

export function FlyingPublications() {
  const [images, setImages] = useState<FlyingImage[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    
    const initialImages: FlyingImage[] = publicationImages.map((src, index) => ({
      id: index,
      src,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: 0.4 + Math.random() * 0.3,
    }))
    
    setImages(initialImages)
    
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const interval = setInterval(() => {
      setImages(prevImages =>
        prevImages.map(img => {
          let newX = img.x + img.vx
          let newY = img.y + img.vy
          let newVx = img.vx
          let newVy = img.vy
          
          if (newX <= -100) {
            newX = dimensions.width + 100
          } else if (newX >= dimensions.width + 100) {
            newX = -100
          }
          
          if (newY <= -100) {
            newY = dimensions.height + 100
          } else if (newY >= dimensions.height + 100) {
            newY = -100
          }
          
          if (Math.random() < 0.01) {
            newVx = (Math.random() - 0.5) * 2
            newVy = (Math.random() - 0.5) * 2
          }
          
          return {
            ...img,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: img.rotation + img.rotationSpeed,
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [dimensions])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {images.map(img => (
        <div
          key={img.id}
          className="absolute w-24 h-24 opacity-10 transition-none"
          style={{
            transform: `translate(${img.x}px, ${img.y}px) rotate(${img.rotation}deg) scale(${img.scale})`,
            left: -48,
            top: -48,
          }}
        >
          <Image
            src={img.src}
            alt=""
            width={96}
            height={96}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}