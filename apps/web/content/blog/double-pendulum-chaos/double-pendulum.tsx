"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Play, Pause, RotateCcw, RefreshCw } from "lucide-react"

interface Pendulum {
  id: number
  angle1: number
  angle2: number
  velocity1: number
  velocity2: number
  color: string
  trail: { x: number; y: number }[]
  initialEnergy?: number
}

interface PhaseSpaceData {
  pendulums: Array<{
    angle1: number
    angle2: number
  }>
}

interface DivergenceData {
  time: number
  divergence: number
  maxDivergence: number
  randomExpected: number
}

const DoublePendulumSimulation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [pendulums, setPendulums] = useState<Pendulum[]>([])
  const [pendulumCount, setPendulumCount] = useState(8)
  const [noiseLevel, setNoiseLevel] = useState(0.05)
  const [initialAngle1, setInitialAngle1] = useState(Math.PI / 2)
  const [initialAngle2, setInitialAngle2] = useState(Math.PI / 2)
  const [trailLength, setTrailLength] = useState(500)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [phaseSpaceHistory, setPhaseSpaceHistory] = useState<PhaseSpaceData[]>([])
  const [divergenceHistory, setDivergenceHistory] = useState<DivergenceData[]>([])
  const [lyapunovExponent, setLyapunovExponent] = useState<number | null>(null)
  const [fitCrossoverIndex, setFitCrossoverIndex] = useState<number | null>(null)
  const timeRef = useRef(0)
  const initialEnergyRef = useRef<number | null>(null)
  
  const L1 = 1 // Length of first pendulum arm (normalized)
  const L2 = 1 // Length of second pendulum arm (normalized)
  const m1 = 1 // Mass of first pendulum (normalized)
  const m2 = 1 // Mass of second pendulum (normalized)
  const g = 1 // Gravity (normalized)
  const baseDt = 0.06 // Base time step (tripled from original for faster base speed)
  const dt = baseDt * simulationSpeed // Adjusted time step
  
  const generateColor = (index: number, total: number) => {
    const hue = (index * 360) / total
    return `hsl(${hue}, 70%, 50%)`
  }
  
  const initializePendulums = useCallback(() => {
    const newPendulums: Pendulum[] = []
    for (let i = 0; i < pendulumCount; i++) {
      // First pendulum has no noise
      const noise1 = i === 0 ? 0 : (Math.random() - 0.5) * noiseLevel
      const noise2 = i === 0 ? 0 : (Math.random() - 0.5) * noiseLevel
      newPendulums.push({
        id: Date.now() + i,
        angle1: initialAngle1 + noise1,
        angle2: initialAngle2 + noise2,
        velocity1: 0,
        velocity2: 0,
        color: generateColor(i, pendulumCount),
        trail: []
      })
    }
    setPendulums(newPendulums)
    setPhaseSpaceHistory([])
    setDivergenceHistory([])
    setLyapunovExponent(null)
    setFitCrossoverIndex(null)
    timeRef.current = 0
    // Calculate initial energy for y-axis scaling
    if (newPendulums.length > 0) {
      const energies = newPendulums.map(p => {
        // Calculate energy for initial state (velocity = 0)
        const y1 = -L1 * Math.cos(p.angle1)
        const y2 = y1 - L2 * Math.cos(p.angle2)
        // PE with zero at lowest point
        return m1 * g * (y1 + L1 + L2) + m2 * g * (y2 + L1 + L2)
      })
      initialEnergyRef.current = energies.reduce((a, b) => a + b, 0) / energies.length
    }
  }, [noiseLevel, initialAngle1, initialAngle2, pendulumCount, L1, L2, m1, m2, g])
  
  const normalizeAngle = (angle: number): number => {
    // Keep angle between -2π and 2π to prevent overflow
    const twoPi = 2 * Math.PI
    if (angle > twoPi) return angle - twoPi
    if (angle < -twoPi) return angle + twoPi
    return angle
  }
  
  const updatePendulum = useCallback((pendulum: Pendulum, targetEnergy?: number): Pendulum => {
    const { angle1, angle2, velocity1, velocity2 } = pendulum
    
    // Double pendulum equations of motion
    const num1 = -g * (2 * m1 + m2) * Math.sin(angle1)
    const num2 = -m2 * g * Math.sin(angle1 - 2 * angle2)
    const num3 = -2 * Math.sin(angle1 - angle2) * m2
    const num4 = velocity2 * velocity2 * L2 + velocity1 * velocity1 * L1 * Math.cos(angle1 - angle2)
    const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * angle1 - 2 * angle2))
    let acceleration1 = (num1 + num2 + num3 * num4) / den
    
    const num5 = 2 * Math.sin(angle1 - angle2)
    const num6 = velocity1 * velocity1 * L1 * (m1 + m2)
    const num7 = g * (m1 + m2) * Math.cos(angle1)
    const num8 = velocity2 * velocity2 * L2 * m2 * Math.cos(angle1 - angle2)
    const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * angle1 - 2 * angle2))
    let acceleration2 = (num5 * (num6 + num7 + num8)) / den2
    
    // Check for NaN or infinite values and reset if needed
    if (!isFinite(acceleration1) || !isFinite(acceleration2)) {
      // Return current state without updating if we hit numerical instability
      return pendulum
    }
    
    // Clamp accelerations to prevent explosion
    const maxAccel = 1000
    acceleration1 = Math.max(-maxAccel, Math.min(maxAccel, acceleration1))
    acceleration2 = Math.max(-maxAccel, Math.min(maxAccel, acceleration2))
    
    let newVelocity1 = velocity1 + acceleration1 * dt
    let newVelocity2 = velocity2 + acceleration2 * dt
    
    let newAngle1 = normalizeAngle(angle1 + newVelocity1 * dt)
    let newAngle2 = normalizeAngle(angle2 + newVelocity2 * dt)
    
    // Energy conservation: rescale velocities to maintain constant energy
    if (targetEnergy !== undefined) {
      // Calculate current kinetic energy with new velocities
      const v1x = L1 * newVelocity1 * Math.cos(newAngle1)
      const v1y = -L1 * newVelocity1 * Math.sin(newAngle1)
      const v2x = v1x + L2 * newVelocity2 * Math.cos(newAngle2)
      const v2y = v1y - L2 * newVelocity2 * Math.sin(newAngle2)
      
      const KE = 0.5 * m1 * (v1x * v1x + v1y * v1y) + 0.5 * m2 * (v2x * v2x + v2y * v2y)
      
      // Calculate potential energy at new position
      const y1 = -L1 * Math.cos(newAngle1)
      const y2 = y1 - L2 * Math.cos(newAngle2)
      const PE = m1 * g * (y1 + L1 + L2) + m2 * g * (y2 + L1 + L2)
      
      const currentEnergy = KE + PE
      
      // If KE > 0, scale velocities to match target energy
      if (KE > 0.001) {
        const targetKE = targetEnergy - PE
        if (targetKE > 0) {
          const scaleFactor = Math.sqrt(targetKE / KE)
          newVelocity1 *= scaleFactor
          newVelocity2 *= scaleFactor
        }
      }
    }
    
    // Calculate position of second bob for trail (in scaled pixels)
    const scale = 100  // Match the rendering scale
    const x1 = scale * L1 * Math.sin(newAngle1)
    const y1 = scale * L1 * Math.cos(newAngle1)
    const x2 = x1 + scale * L2 * Math.sin(newAngle2)
    const y2 = y1 + scale * L2 * Math.cos(newAngle2)
    
    let newTrail = trailLength > 0 ? [...pendulum.trail, { x: x2, y: y2 }] : []
    while (newTrail.length > trailLength) {
      newTrail.shift()
    }
    
    return {
      ...pendulum,
      angle1: newAngle1,
      angle2: newAngle2,
      velocity1: newVelocity1,
      velocity2: newVelocity2,
      trail: newTrail
    }
  }, [dt, trailLength, L1, L2, m1, m2, g])
  
  const calculateEnergy = useCallback((pendulum: Pendulum): number => {
    // Calculate kinetic and potential energy
    const { angle1, angle2, velocity1, velocity2 } = pendulum
    
    // In the coordinate system:
    // - angle = 0 means pointing straight down
    // - cos(angle) > 0 means below pivot
    // - We define PE = 0 at the lowest point (both arms down)
    const y1 = -L1 * Math.cos(angle1)  // height relative to pivot (negative = below)
    const y2 = y1 - L2 * Math.cos(angle2)
    
    // Velocities of masses
    const v1x = L1 * velocity1 * Math.cos(angle1)
    const v1y = -L1 * velocity1 * Math.sin(angle1)
    const v2x = v1x + L2 * velocity2 * Math.cos(angle2)
    const v2y = v1y - L2 * velocity2 * Math.sin(angle2)
    
    // Kinetic energy
    const KE1 = 0.5 * m1 * (v1x * v1x + v1y * v1y)
    const KE2 = 0.5 * m2 * (v2x * v2x + v2y * v2y)
    
    // Potential energy: PE = mgh where h is height
    // Add (L1 + L2) to shift zero to lowest point
    const PE1 = m1 * g * (y1 + L1 + L2)
    const PE2 = m2 * g * (y2 + L1 + L2)
    
    return KE1 + KE2 + PE1 + PE2
  }, [L1, L2, m1, m2, g])
  
  const calculateDivergence = useCallback((pendulums: Pendulum[]): number => {
    if (pendulums.length < 2) return 0
    
    // Calculate RMS phase space distance
    // Phase space has 4 dimensions: angle1, angle2, velocity1, velocity2
    const ref = pendulums[0]
    
    let sumSquaredDist = 0
    
    for (let i = 1; i < pendulums.length; i++) {
      const p = pendulums[i]
      
      // Phase space distance components
      const dTheta1 = ref.angle1 - p.angle1
      const dTheta2 = ref.angle2 - p.angle2
      const dOmega1 = ref.velocity1 - p.velocity1
      const dOmega2 = ref.velocity2 - p.velocity2
      
      // Full phase space distance (4D)
      const dist = Math.sqrt(
        dTheta1 * dTheta1 + 
        dTheta2 * dTheta2 + 
        dOmega1 * dOmega1 + 
        dOmega2 * dOmega2
      )
      sumSquaredDist += dist * dist
    }
    
    return Math.sqrt(sumSquaredDist / (pendulums.length - 1))
  }, [])
  
  const calculateMaxDivergence = useCallback((energy: number): number => {
    // Calculate theoretical maximum phase space distance given energy constraint
    // Maximum angular separation: ~2π for each angle (opposite configurations)
    const maxAngularSep = 2 * Math.PI
    
    // Maximum velocity from energy: v_max = sqrt(2E/m_total)
    // Since all energy could theoretically be kinetic
    const maxVelocity = Math.sqrt(2 * energy / (m1 + m2))
    
    // Maximum phase space distance occurs when:
    // - Angles are maximally separated (2π each)
    // - Velocities are opposite and maximal
    const maxDist = Math.sqrt(
      (2 * maxAngularSep) * (2 * maxAngularSep) +  // max angle1 separation
      (2 * maxAngularSep) * (2 * maxAngularSep) +  // max angle2 separation
      (2 * maxVelocity) * (2 * maxVelocity) +      // max velocity1 separation
      (2 * maxVelocity) * (2 * maxVelocity)        // max velocity2 separation
    )
    
    return maxDist
  }, [m1, m2])
  
  // Exponential fitting function for Lyapunov exponent calculation
  const fitExponential = useCallback((data: { time: number; divergence: number }[]): number | null => {
    try {
      if (data.length < 5) return null // Need at least 5 points for meaningful fit
      
      // Filter out zero or negative divergences for log calculation
      const validData = data.filter(d => d.divergence > 1e-10)
      if (validData.length < 5) return null
      
      // Linear regression on log(divergence) vs time to find growth rate
      // log(y) = log(a) + λt where λ is the Lyapunov exponent
      const n = validData.length
      const sumT = validData.reduce((sum, d) => sum + d.time, 0)
      const sumLogY = validData.reduce((sum, d) => sum + Math.log(d.divergence), 0)
      const sumT2 = validData.reduce((sum, d) => sum + d.time * d.time, 0)
      const sumTLogY = validData.reduce((sum, d) => sum + d.time * Math.log(d.divergence), 0)
      
      // Calculate slope (Lyapunov exponent)
      const denominator = n * sumT2 - sumT * sumT
      if (Math.abs(denominator) < 1e-10) return null
      
      const lyapunov = (n * sumTLogY - sumT * sumLogY) / denominator
      
      // Sanity check: Lyapunov should be positive for chaotic systems
      if (lyapunov < 0 || lyapunov > 10) return null // Reasonable bounds
      
      return lyapunov
    } catch (error) {
      console.warn('Exponential fit failed:', error)
      return null
    }
  }, [])
  
  const calculateRandomExpected = useCallback((energy: number): number => {
    // Expected distance between two randomly placed pendulums in phase space
    // For uniform distribution in angles: RMS distance = π*sqrt(2/3) ≈ 2.56 per angle
    // For velocities with energy constraint: typical velocity ≈ sqrt(E/m_total)
    
    const typicalVelocity = Math.sqrt(energy / (m1 + m2))
    
    // Expected RMS distance for uniform angular distribution
    // Var(θ) = (2π)²/12 for uniform on [-π,π], so E[Δθ²] = 2*Var = π²/3
    const expectedAngularDist = Math.PI * Math.sqrt(2.0/3.0)
    
    // For velocities, assuming roughly Gaussian distribution with std ~ typicalVelocity
    // E[Δv²] ≈ 2*σ² = 2*typicalVelocity²
    const expectedVelocityDist = Math.sqrt(2) * typicalVelocity
    
    // Combined expected distance in 4D phase space
    const randomDist = Math.sqrt(
      2 * expectedAngularDist * expectedAngularDist +  // two angle dimensions
      2 * expectedVelocityDist * expectedVelocityDist   // two velocity dimensions
    )
    
    return randomDist
  }, [m1, m2])
  
  const animate = useCallback(() => {
    if (isPlaying) {
      setPendulums(current => {
        // Store initial energy per pendulum on first frame
        const pendulums = current.map(p => {
          if (p.initialEnergy === undefined) {
            return { ...p, initialEnergy: calculateEnergy(p) }
          }
          return p
        })
        
        // Store average initial energy for plot scaling
        if (initialEnergyRef.current === null && pendulums.length > 0) {
          const initialEnergies = pendulums.map(p => p.initialEnergy || calculateEnergy(p))
          initialEnergyRef.current = initialEnergies.reduce((a, b) => a + b, 0) / initialEnergies.length
        }
        
        // Update each pendulum, maintaining its own initial energy
        const updated = pendulums.map(p => updatePendulum(p, p.initialEnergy))
        
        // Update phase space history - respect trail length setting
        setPhaseSpaceHistory(prev => {
          const newPoint: PhaseSpaceData = {
            pendulums: updated.map(p => ({
              angle1: p.angle1,
              angle2: p.angle2
            }))
          }
          const newHistory = [...prev, newPoint]
          // Use trail length to limit history (or 0 for no trail)
          return trailLength > 0 ? newHistory.slice(-Math.ceil(trailLength / 5)) : []
        })
        
        // Calculate energies for divergence calculation
        const energies = updated.map(calculateEnergy)
        
        // Update divergence history (only if multiple pendulums)
        if (updated.length > 1) {
          const divergence = calculateDivergence(updated)
          // Use average energy for max divergence calculation
          const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length
          const maxDivergence = calculateMaxDivergence(avgEnergy)
          const randomExpected = calculateRandomExpected(avgEnergy)
          
          setDivergenceHistory(prev => {
            const newHistory = [...prev, { time: timeRef.current, divergence, maxDivergence, randomExpected }]
            
            // Check for crossover and calculate Lyapunov exponent (only once)
            // IMPORTANT: We only check if both lyapunovExponent and fitCrossoverIndex are null
            // Once either is set, this entire block is skipped forever (until reset)
            if (lyapunovExponent === null && fitCrossoverIndex === null) {
              const lastIdx = newHistory.length - 1
              
              // Only check crossover if we have enough data (constant time check)
              if (lastIdx >= 10) {
                const prevIdx = lastIdx - 1
                
                // Simple O(1) crossover check - just compare last two points
                if (newHistory[prevIdx].divergence < newHistory[prevIdx].randomExpected &&
                    newHistory[lastIdx].divergence >= newHistory[lastIdx].randomExpected) {
                  
                  // Crossover detected! Now do the O(n) operation ONLY ONCE
                  const dataForFit = newHistory.slice(0, lastIdx + 1).map(d => ({
                    time: d.time,
                    divergence: d.divergence
                  }))
                  
                  const lyapunov = fitExponential(dataForFit)
                  if (lyapunov !== null) {
                    setLyapunovExponent(lyapunov)
                    setFitCrossoverIndex(lastIdx)
                  } else {
                    // Even if fit fails, set crossoverIndex to prevent retrying
                    setFitCrossoverIndex(-1)
                  }
                }
              }
            }
            
            // Keep full history (no slicing)
            return newHistory
          })
        }
        
        timeRef.current += dt
        return updated
      })
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [isPlaying, updatePendulum, calculateEnergy, calculateDivergence, calculateMaxDivergence, calculateRandomExpected, fitExponential, dt, trailLength, lyapunovExponent, fitCrossoverIndex])
  
  // Trim trails when trail length changes
  useEffect(() => {
    setPendulums(current => current.map(pendulum => ({
      ...pendulum,
      trail: pendulum.trail.slice(-trailLength)
    })))
    // Also trim phase space history
    setPhaseSpaceHistory(current => 
      trailLength > 0 ? current.slice(-Math.ceil(trailLength / 5)) : []
    )
  }, [trailLength])
  
  const centerX = 250
  const centerY = 250
  
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, isPlaying])
  
  useEffect(() => {
    initializePendulums()
  }, [])
  
  // Auto-reset when initial conditions change
  useEffect(() => {
    if (!hasStarted) {
      initializePendulums()
    }
  }, [pendulumCount, noiseLevel, initialAngle1, initialAngle2, hasStarted, initializePendulums])
  
  
  const handleReset = () => {
    setIsPlaying(false)
    setHasStarted(false)
    initializePendulums()
  }
  
  const handleRestoreDefaults = () => {
    setIsPlaying(false)
    setHasStarted(false)
    setPendulumCount(8)
    setNoiseLevel(0.05)
    setInitialAngle1(Math.PI / 2)
    setInitialAngle2(Math.PI / 2)
    setTrailLength(500)
    setSimulationSpeed(1)
    // Initialize with default values
    setTimeout(() => {
      const newPendulums: Pendulum[] = []
      for (let i = 0; i < 8; i++) {
        // First pendulum has no noise
        const noise1 = i === 0 ? 0 : (Math.random() - 0.5) * 0.05
        const noise2 = i === 0 ? 0 : (Math.random() - 0.5) * 0.05
        newPendulums.push({
          id: Date.now() + i,
          angle1: Math.PI / 2 + noise1,
          angle2: Math.PI / 2 + noise2,
          velocity1: 0,
          velocity2: 0,
          color: generateColor(i, 8),
          trail: []
        })
      }
      setPendulums(newPendulums)
      setPhaseSpaceHistory([])
      setDivergenceHistory([])
      setLyapunovExponent(null)
      setFitCrossoverIndex(null)
      timeRef.current = 0
      // Calculate initial energy for y-axis scaling
      if (newPendulums.length > 0) {
        const energies = newPendulums.map(p => {
          // Calculate energy for initial state (velocity = 0)
          const y1 = L1 * Math.cos(p.angle1)
          const y2 = y1 + L2 * Math.cos(p.angle2)
          return -m1 * g * y1 - m2 * g * y2  // Just PE since KE=0 initially
        })
        initialEnergyRef.current = energies.reduce((a, b) => a + b, 0) / energies.length
      }
    }, 0)
  }
  
  return (
    <div className="w-full">
      <Card className="p-4 space-y-4">
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="border rounded-lg bg-gray-50 dark:bg-gray-900 w-full"
          style={{ aspectRatio: '1' }}
        >
            {/* Draw trails */}
            {pendulums.map(pendulum => (
              <polyline
                key={`trail-${pendulum.id}`}
                points={pendulum.trail.map(p => `${centerX + p.x},${centerY + p.y}`).join(' ')}
                fill="none"
                stroke={pendulum.color}
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Draw pendulums */}
            {pendulums.map(pendulum => {
              const scale = 100 // Scale factor to convert normalized units to pixels (reduced to fit)
              const x1 = centerX + scale * L1 * Math.sin(pendulum.angle1)
              const y1 = centerY + scale * L1 * Math.cos(pendulum.angle1)
              const x2 = x1 + scale * L2 * Math.sin(pendulum.angle2)
              const y2 = y1 + scale * L2 * Math.cos(pendulum.angle2)
              
              // Skip rendering if we have NaN values
              if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
                return null
              }
              
              return (
                <g key={`pendulum-${pendulum.id}`}>
                  {/* First arm */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x1}
                    y2={y1}
                    stroke={pendulum.color}
                    strokeWidth="2"
                  />
                  {/* Second arm */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={pendulum.color}
                    strokeWidth="2"
                  />
                  {/* First bob */}
                  <circle
                    cx={x1}
                    cy={y1}
                    r="8"
                    fill={pendulum.color}
                  />
                  {/* Second bob */}
                  <circle
                    cx={x2}
                    cy={y2}
                    r="8"
                    fill={pendulum.color}
                  />
                </g>
              )
            })}
            
            {/* Pivot point */}
            <circle
              cx={centerX}
              cy={centerY}
              r="5"
              fill="#666"
            />
        </svg>
        
        {/* Plots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase space plot */}
          <div className="border rounded-lg p-4 bg-background">
              <h3 className="text-sm font-semibold mb-2 -mt-1">Phase Space</h3>
              <svg width={350} height={150} className="w-full" viewBox="0 0 350 150">
                {/* Axes */}
                <line x1="175" y1="10" x2="175" y2="130" stroke="#666" strokeWidth="0.5" />
                <line x1="30" y1="70" x2="320" y2="70" stroke="#666" strokeWidth="0.5" />
                
                {/* Axis labels */}
                <text x="12" y="70" fill="#888" fontSize="10" transform="rotate(-90, 12, 70)" textAnchor="middle">θ₂</text>
                <text x="175" y="145" fill="#888" fontSize="10" textAnchor="middle">θ₁</text>
                
                {/* Axis ticks */}
                <text x="30" y="75" fill="#888" fontSize="8" textAnchor="middle">-π</text>
                <text x="320" y="75" fill="#888" fontSize="8" textAnchor="middle">π</text>
                <text x="175" y="15" fill="#888" fontSize="8" textAnchor="middle">π</text>
                <text x="175" y="135" fill="#888" fontSize="8" textAnchor="middle">-π</text>
                
                {/* Phase space trajectories */}
                {phaseSpaceHistory.length > 1 && pendulums.map((pendulum, pIndex) => {
                  // Build path with proper handling of angle wrapping
                  const pathSegments: string[] = []
                  let currentPath: string[] = []
                  let prevWrappedAngle1: number | null = null
                  let prevWrappedAngle2: number | null = null
                  
                  phaseSpaceHistory.forEach((d, i) => {
                    // Get raw angles
                    const rawAngle1 = d.pendulums[pIndex]?.angle1 || 0
                    const rawAngle2 = d.pendulums[pIndex]?.angle2 || 0
                    
                    // Wrap angles to [-π, π]
                    let angle1 = rawAngle1
                    let angle2 = rawAngle2
                    while (angle1 > Math.PI) angle1 -= 2 * Math.PI
                    while (angle1 < -Math.PI) angle1 += 2 * Math.PI
                    while (angle2 > Math.PI) angle2 -= 2 * Math.PI
                    while (angle2 < -Math.PI) angle2 += 2 * Math.PI
                    
                    // Map to plot coordinates
                    const x = 175 + angle1 * 145 / Math.PI
                    const y = 70 - angle2 * 60 / Math.PI
                    
                    // Check for wrapping discontinuity using wrapped angles
                    if (prevWrappedAngle1 !== null && prevWrappedAngle2 !== null) {
                      // If wrapped angles jump more than π/2, it's likely a wrap
                      const jump1 = Math.abs(angle1 - prevWrappedAngle1)
                      const jump2 = Math.abs(angle2 - prevWrappedAngle2)
                      
                      if (jump1 > 3.0 || jump2 > 3.0) {  // ~171 degrees - close to π
                        if (currentPath.length > 0) {
                          pathSegments.push(currentPath.join(' '))
                          currentPath = []
                        }
                      }
                    }
                    
                    currentPath.push(`${x},${y}`)
                    prevWrappedAngle1 = angle1
                    prevWrappedAngle2 = angle2
                  })
                  
                  if (currentPath.length > 0) {
                    pathSegments.push(currentPath.join(' '))
                  }
                  
                  // Render multiple polylines for disconnected segments
                  return pathSegments.map((points, segIndex) => (
                    <polyline
                      key={`phase-${pendulum.id}-${segIndex}`}
                      points={points}
                      fill="none"
                      stroke={pendulum.color}
                      strokeWidth="0.8"
                      opacity="0.6"
                    />
                  ))
                })}
                
                {/* Current position markers */}
                {phaseSpaceHistory.length > 0 && pendulums.map((pendulum, pIndex) => {
                  const lastPoint = phaseSpaceHistory[phaseSpaceHistory.length - 1]
                  let angle1 = lastPoint.pendulums[pIndex]?.angle1 || 0
                  let angle2 = lastPoint.pendulums[pIndex]?.angle2 || 0
                  
                  // Wrap to [-π, π]
                  while (angle1 > Math.PI) angle1 -= 2 * Math.PI
                  while (angle1 < -Math.PI) angle1 += 2 * Math.PI
                  while (angle2 > Math.PI) angle2 -= 2 * Math.PI
                  while (angle2 < -Math.PI) angle2 += 2 * Math.PI
                  
                  const x = 175 + angle1 * 145 / Math.PI
                  const y = 70 - angle2 * 60 / Math.PI
                  
                  return (
                    <circle
                      key={`phase-marker-${pendulum.id}`}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={pendulum.color}
                    />
                  )
                })}
              </svg>
          </div>
          
          {/* Divergence plot - only show if multiple pendulums */}
          {pendulums.length > 1 ? (
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="text-sm font-semibold mb-2 -mt-1">
                Phase Space Distance
                {lyapunovExponent !== null && (
                  <span className="text-xs font-normal ml-2">
                    (λ ≈ {lyapunovExponent.toFixed(2)})
                  </span>
                )}
              </h3>
              <svg width={350} height={150} className="w-full" viewBox="0 0 350 150">
                  {/* Axes */}
                  <line x1="30" y1="10" x2="30" y2="130" stroke="#666" strokeWidth="1" />
                  <line x1="30" y1="130" x2="330" y2="130" stroke="#666" strokeWidth="1" />
                  
                  {/* Axis ticks */}
                  <line x1="27" y1="10" x2="30" y2="10" stroke="#666" strokeWidth="1" />
                  <line x1="27" y1="130" x2="30" y2="130" stroke="#666" strokeWidth="1" />
                  <line x1="30" y1="130" x2="30" y2="133" stroke="#666" strokeWidth="1" />
                  <line x1="330" y1="130" x2="330" y2="133" stroke="#666" strokeWidth="1" />
                  
                  {/* Axis labels - always visible */}
                  <text x="8" y="70" fill="#888" fontSize="10" transform="rotate(-90, 8, 70)" textAnchor="middle">
                    <tspan x="8" dy="0">Phase space</tspan>
                    <tspan x="8" dy="12">distance</tspan>
                  </text>
                  <text x="180" y="145" fill="#888" fontSize="10" textAnchor="middle">Time</text>
                  <text x="30" y="143" fill="#888" fontSize="9">0</text>
                  
                  {divergenceHistory.length > 1 && (
                    <>
                      {(() => {
                        const maxD = Math.max(...divergenceHistory.map(d => Math.max(d.divergence, d.maxDivergence))) || 1
                        const minD = Math.min(...divergenceHistory.filter(d => d.divergence > 0).map(d => d.divergence)) || 0.001
                        const startTime = 0
                        const endTime = divergenceHistory[divergenceHistory.length - 1].time || 1
                        
                        // Log scale: map log(minD) to log(maxD) onto y-axis
                        const logMin = Math.log10(Math.max(minD, 0.001))
                        const logMax = Math.log10(Math.max(maxD, minD * 10))
                        const logRange = logMax - logMin || 1
                        
                        return (
                          <>
                            {/* Actual divergence line */}
                            <polyline
                              points={divergenceHistory.map((d) => {
                                const x = 30 + ((d.time - startTime) / endTime) * 300
                                // Use log scale for y
                                const logValue = Math.log10(Math.max(d.divergence, 0.001))
                                const y = 130 - ((logValue - logMin) / logRange) * 115
                                return `${x},${y}`
                              }).join(' ')}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2"
                            />
                            
                            {/* Fitted exponential curve (if Lyapunov calculated) */}
                            {lyapunovExponent !== null && fitCrossoverIndex !== null && fitCrossoverIndex >= 0 && (
                              <polyline
                                points={divergenceHistory.slice(0, fitCrossoverIndex + 1).map((d, i) => {
                                  const x = 30 + ((d.time - startTime) / endTime) * 300
                                  // Calculate fitted value: y = a * exp(λt)
                                  // Get initial divergence for scaling
                                  const initialDiv = divergenceHistory.find(h => h.divergence > 0.001)?.divergence || 0.01
                                  const fittedValue = initialDiv * Math.exp(lyapunovExponent * d.time)
                                  const logValue = Math.log10(Math.max(fittedValue, 0.001))
                                  const y = 130 - ((logValue - logMin) / logRange) * 115
                                  return `${x},${y}`
                                }).join(' ')}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="1.5"
                                strokeDasharray="4,2"
                                opacity="0.8"
                              />
                            )}
                            
                            {/* Random expected divergence (dashed line) */}
                            <polyline
                              points={divergenceHistory.map((d) => {
                                const x = 30 + ((d.time - startTime) / endTime) * 300
                                // Use log scale for y
                                const logValue = Math.log10(Math.max(d.randomExpected, 0.001))
                                const y = 130 - ((logValue - logMin) / logRange) * 115
                                return `${x},${y}`
                              }).join(' ')}
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="1.5"
                              strokeDasharray="8,4"
                              opacity="0.7"
                            />
                            
                            {/* Maximum possible divergence (dotted line) */}
                            <polyline
                              points={divergenceHistory.map((d) => {
                                const x = 30 + ((d.time - startTime) / endTime) * 300
                                // Use log scale for y
                                const logValue = Math.log10(Math.max(d.maxDivergence, 0.001))
                                const y = 130 - ((logValue - logMin) / logRange) * 115
                                return `${x},${y}`
                              }).join(' ')}
                              fill="none"
                              stroke="#888"
                              strokeWidth="1"
                              strokeDasharray="4,4"
                              opacity="0.6"
                            />
                            
                            {/* Y-axis labels for log scale */}
                            <text x="25" y="135" fill="#888" fontSize="9" textAnchor="end">{minD.toExponential(0)}</text>
                            <text x="25" y="15" fill="#888" fontSize="9" textAnchor="end">{maxD.toExponential(0)}</text>
                            
                            {/* Dynamic time label */}
                            <text x="330" y="143" fill="#888" fontSize="9" textAnchor="end">{endTime.toFixed(1)}</text>
                            
                            {/* Legend - 2x2 grid */}
                            <g transform={`translate(${lyapunovExponent !== null ? 240 : 250}, 105)`}>
                              {/* Top row */}
                              {/* Actual divergence */}
                              <line x1="0" y1="0" x2="12" y2="0" stroke="#f59e0b" strokeWidth="2" />
                              <text x="14" y="3" fill="#888" fontSize="8">Actual</text>
                              
                              {/* Random expected */}
                              <line x1="50" y1="0" x2="62" y2="0" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="8,4" />
                              <text x="64" y="3" fill="#888" fontSize="8">Random</text>
                              
                              {/* Bottom row */}
                              {lyapunovExponent !== null ? (
                                <>
                                  {/* Fitted curve */}
                                  <line x1="0" y1="12" x2="12" y2="12" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" />
                                  <text x="14" y="15" fill="#888" fontSize="8">Fit</text>
                                  
                                  {/* Maximum */}
                                  <line x1="50" y1="12" x2="62" y2="12" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                                  <text x="64" y="15" fill="#888" fontSize="8">Max</text>
                                </>
                              ) : (
                                <>
                                  {/* Maximum only (no fit) */}
                                  <line x1="0" y1="12" x2="12" y2="12" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                                  <text x="14" y="15" fill="#888" fontSize="8">Max</text>
                                </>
                              )}
                            </g>
                          </>
                        )
                      })()}
                    </>
                  )}
                </svg>
            </div>
          ) : (
            <div />
          )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!isPlaying) setHasStarted(true)
              setIsPlaying(!isPlaying)
            }}
            variant="default"
            size="sm"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
          
            <Button onClick={handleReset} variant="outline" size="sm" disabled={isPlaying}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          <Button onClick={handleRestoreDefaults} variant="ghost" size="sm" disabled={isPlaying}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restore Defaults
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Initial Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-100" style={{ opacity: hasStarted ? 0.5 : 1 }}>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Number of Pendulums: {pendulumCount}
                </label>
                <input
                  type="range"
                  value={pendulumCount}
                  onChange={(e) => setPendulumCount(parseInt(e.target.value))}
                  min={1}
                  max={16}
                  step={1}
                  className="w-full"
                  disabled={hasStarted}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Noise Level: {noiseLevel.toFixed(3)}
                </label>
                <input
                  type="range"
                  value={noiseLevel * 100}
                  onChange={(e) => setNoiseLevel(parseFloat(e.target.value) / 100)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                  disabled={hasStarted}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Initial Angle 1: {(initialAngle1 * 180 / Math.PI).toFixed(0)}°
                </label>
                <input
                  type="range"
                  value={initialAngle1 * 180 / Math.PI}
                  onChange={(e) => setInitialAngle1(parseFloat(e.target.value) * Math.PI / 180)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                  disabled={hasStarted}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Initial Angle 2: {(initialAngle2 * 180 / Math.PI).toFixed(0)}°
                </label>
                <input
                  type="range"
                  value={initialAngle2 * 180 / Math.PI}
                  onChange={(e) => setInitialAngle2(parseFloat(e.target.value) * Math.PI / 180)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                  disabled={hasStarted}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3">Runtime Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Simulation Speed: {simulationSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  value={simulationSpeed * 10}
                  onChange={(e) => setSimulationSpeed(parseFloat(e.target.value) / 10)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Trail Length: {trailLength}
                </label>
                <input
                  type="range"
                  value={trailLength}
                  onChange={(e) => setTrailLength(parseInt(e.target.value))}
                  min={0}
                  max={2000}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p>Adjust the starting angles and add noise to see how tiny differences lead to chaotic divergence.</p>
          <p>Each pendulum starts with slightly different initial conditions based on the noise level.</p>
        </div>
      </Card>
    </div>
  )
}

export default DoublePendulumSimulation