'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { ChevronDown, ChevronUp, MousePointer } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface OptimizerState {
  position: Point
  velocity?: Point
  m?: Point // First moment (Adam)
  v?: Point // Second moment (Adam)
  g?: Point // Gradient accumulator (RMSprop)
  H?: number[][] // Preconditioning matrix (Shampoo)
}

interface OptimizerConfig {
  name: string
  color: string
  lr: number
  momentum?: number
  beta1?: number
  beta2?: number
  epsilon?: number
}

interface OptimizerRun {
  optimizer: string
  startPoint: Point
  path: Point[]
  losses: number[]
  state: OptimizerState
  isActive: boolean
}

export default function OptimizerVisualization() {
  // Loss landscape parameters
  const [landscapeType, setLandscapeType] = useState<'convex' | 'rosenbrock' | 'beale' | 'rastrigin'>('convex')
  
  // Simulation state
  const [showSettings, setShowSettings] = useState(false)
  const [runs, setRuns] = useState<OptimizerRun[]>([])
  const [selectedOptimizers, setSelectedOptimizers] = useState<string[]>(['sgd', 'adam'])
  const [clickPoint, setClickPoint] = useState<Point | null>(null)
  
  // Hyperparameters
  const [speed, setSpeed] = useState(20)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [sharedLearningRate, setSharedLearningRate] = useState(0.003)
  
  // Individual optimizer hyperparameters with PyTorch defaults
  const [hyperparams, setHyperparams] = useState({
    sgd: {},
    sgdMomentum: {
      momentum: 0.9  // PyTorch default is 0, but 0.9 is more common
    },
    rmsprop: {
      alpha: 0.99,  // PyTorch default
      epsilon: 1e-8  // PyTorch default
    },
    adam: {
      beta1: 0.9,    // PyTorch default
      beta2: 0.999,  // PyTorch default
      epsilon: 1e-8  // PyTorch default
    },
    adamw: {
      beta1: 0.9,    // PyTorch default
      beta2: 0.999,  // PyTorch default
      epsilon: 1e-8, // PyTorch default
      weight_decay: 0.01  // Common default for AdamW
    },
    muon: {
      momentum: 0.95,  // Muon default
      nesterov: true,  // Muon default
      ns_steps: 5      // Muon default (Newton-Schulz iterations)
    },
    shampoo: {
      epsilon: 1e-4,  // Shampoo default
      update_freq: 1  // Frequency to update preconditioning matrix
    }
  })
  
  // Animation control
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Canvas dimensions and zoom
  const canvasSize = 600
  const [zoom, setZoom] = useState(1) // 1 = default (-2 to 2), 2 = max zoom out (-4 to 4)
  const xRange = { min: -2 * zoom, max: 2 * zoom }
  const yRange = { min: -2 * zoom, max: 2 * zoom }
  
  // Optimizer configurations
  const optimizerConfigs: Record<string, OptimizerConfig> = {
    sgd: { 
      name: 'SGD', 
      color: '#3b82f6',
      lr: sharedLearningRate 
    },
    sgdMomentum: { 
      name: 'SGD+Momentum', 
      color: '#10b981',
      lr: sharedLearningRate,
      momentum: hyperparams.sgdMomentum.momentum 
    },
    rmsprop: { 
      name: 'RMSprop', 
      color: '#8b5cf6',
      lr: sharedLearningRate,
      beta2: hyperparams.rmsprop.alpha,  // Note: PyTorch calls it alpha
      epsilon: hyperparams.rmsprop.epsilon 
    },
    adam: { 
      name: 'Adam', 
      color: '#f59e0b',
      lr: sharedLearningRate,
      beta1: hyperparams.adam.beta1,
      beta2: hyperparams.adam.beta2,
      epsilon: hyperparams.adam.epsilon 
    },
    adamw: { 
      name: 'AdamW', 
      color: '#ec4899',
      lr: sharedLearningRate,
      beta1: hyperparams.adamw.beta1,
      beta2: hyperparams.adamw.beta2,
      epsilon: hyperparams.adamw.epsilon 
    },
    muon: { 
      name: 'Muon', 
      color: '#ef4444',
      lr: sharedLearningRate,
      momentum: hyperparams.muon.momentum 
    },
    shampoo: { 
      name: 'Shampoo', 
      color: '#06b6d4',
      lr: sharedLearningRate,
      epsilon: hyperparams.shampoo.epsilon 
    }
  }
  
  // Loss functions (without noise for gradient calculation)
  const computeLossClean = (x: number, y: number): number => {
    let loss = 0
    switch (landscapeType) {
      case 'convex':
        // Simple convex quadratic
        loss = x * x + y * y
        break
      case 'rosenbrock':
        // Rosenbrock function with adjusted scale
        loss = Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
        break
      case 'beale':
        // Beale function: f(x,y) = (1.5 - x + xy)^2 + (2.25 - x + xy^2)^2 + (2.625 - x + xy^3)^2
        loss = Math.pow(1.5 - x + x * y, 2) + 
               Math.pow(2.25 - x + x * y * y, 2) + 
               Math.pow(2.625 - x + x * y * y * y, 2)
        break
      case 'rastrigin':
        // Rastrigin function: f(x,y) = 20 + x^2 + y^2 - 10(cos(2πx) + cos(2πy))
        // Scaled down for better visualization
        const A = 10
        const n = 2
        loss = A * n + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y))
        break
    }
    return loss
  }
  
  // Loss function with optional noise
  const computeLoss = (x: number, y: number): number => {
    const loss = computeLossClean(x, y)
    if (noiseLevel > 0) {
      return loss + (Math.random() - 0.5) * noiseLevel * 2
    }
    return loss
  }
  
  // Compute gradient
  const computeGradient = (x: number, y: number): Point => {
    const h = 0.0001
    // Use clean loss for gradient calculation to avoid noise inconsistency
    const fx = computeLossClean(x, y)
    const gradX = (computeLossClean(x + h, y) - fx) / h
    const gradY = (computeLossClean(x, y + h) - fx) / h
    
    // Add gradient noise if specified
    const noise = noiseLevel * 0.1
    return {
      x: gradX + (Math.random() - 0.5) * noise,
      y: gradY + (Math.random() - 0.5) * noise
    }
  }
  
  // Optimizer step functions
  const optimizerSteps: Record<string, (state: OptimizerState, grad: Point, config: OptimizerConfig, iteration: number) => OptimizerState> = {
    sgd: (state, grad, config) => {
      return {
        ...state,
        position: {
          x: state.position.x - config.lr * grad.x,
          y: state.position.y - config.lr * grad.y
        }
      }
    },
    
    sgdMomentum: (state, grad, config) => {
      const velocity = state.velocity || { x: 0, y: 0 }
      // Standard momentum: v = β*v + g, θ = θ - α*v
      const newVelocity = {
        x: config.momentum! * velocity.x + grad.x,
        y: config.momentum! * velocity.y + grad.y
      }
      return {
        ...state,
        velocity: newVelocity,
        position: {
          x: state.position.x - config.lr * newVelocity.x,
          y: state.position.y - config.lr * newVelocity.y
        }
      }
    },
    
    rmsprop: (state, grad, config) => {
      const g = state.g || { x: 0, y: 0 }
      
      const newG = {
        x: config.beta2! * g.x + (1 - config.beta2!) * grad.x * grad.x,
        y: config.beta2! * g.y + (1 - config.beta2!) * grad.y * grad.y
      }
      
      return {
        ...state,
        g: newG,
        position: {
          x: state.position.x - config.lr * grad.x / (Math.sqrt(newG.x) + config.epsilon!),
          y: state.position.y - config.lr * grad.y / (Math.sqrt(newG.y) + config.epsilon!)
        }
      }
    },
    
    adam: (state, grad, config, iteration) => {
      const m = state.m || { x: 0, y: 0 }
      const v = state.v || { x: 0, y: 0 }
      const t = iteration + 1
      
      const newM = {
        x: config.beta1! * m.x + (1 - config.beta1!) * grad.x,
        y: config.beta1! * m.y + (1 - config.beta1!) * grad.y
      }
      
      const newV = {
        x: config.beta2! * v.x + (1 - config.beta2!) * grad.x * grad.x,
        y: config.beta2! * v.y + (1 - config.beta2!) * grad.y * grad.y
      }
      
      const mHat = {
        x: newM.x / (1 - Math.pow(config.beta1!, t)),
        y: newM.y / (1 - Math.pow(config.beta1!, t))
      }
      const vHat = {
        x: newV.x / (1 - Math.pow(config.beta2!, t)),
        y: newV.y / (1 - Math.pow(config.beta2!, t))
      }
      
      return {
        ...state,
        m: newM,
        v: newV,
        position: {
          x: state.position.x - config.lr * mHat.x / (Math.sqrt(vHat.x) + config.epsilon!),
          y: state.position.y - config.lr * mHat.y / (Math.sqrt(vHat.y) + config.epsilon!)
        }
      }
    },
    
    adamw: (state, grad, config, iteration) => {
      // AdamW: Adam with decoupled weight decay
      const m = state.m || { x: 0, y: 0 }
      const v = state.v || { x: 0, y: 0 }
      const t = iteration + 1
      
      const newM = {
        x: config.beta1! * m.x + (1 - config.beta1!) * grad.x,
        y: config.beta1! * m.y + (1 - config.beta1!) * grad.y
      }
      
      const newV = {
        x: config.beta2! * v.x + (1 - config.beta2!) * grad.x * grad.x,
        y: config.beta2! * v.y + (1 - config.beta2!) * grad.y * grad.y
      }
      
      const mHat = {
        x: newM.x / (1 - Math.pow(config.beta1!, t)),
        y: newM.y / (1 - Math.pow(config.beta1!, t))
      }
      const vHat = {
        x: newV.x / (1 - Math.pow(config.beta2!, t)),
        y: newV.y / (1 - Math.pow(config.beta2!, t))
      }
      
      // Apply weight decay directly to parameters (decoupled)
      const weight_decay = hyperparams.adamw.weight_decay
      
      return {
        ...state,
        m: newM,
        v: newV,
        position: {
          x: state.position.x - config.lr * (mHat.x / (Math.sqrt(vHat.x) + config.epsilon!) + weight_decay * state.position.x),
          y: state.position.y - config.lr * (mHat.y / (Math.sqrt(vHat.y) + config.epsilon!) + weight_decay * state.position.y)
        }
      }
    },
    
    muon: (state, grad, config) => {
      const velocity = state.velocity || { x: 0, y: 0 }
      
      const momentumUpdate = {
        x: config.momentum! * velocity.x + grad.x,
        y: config.momentum! * velocity.y + grad.y
      }
      
      const norm = Math.sqrt(momentumUpdate.x * momentumUpdate.x + momentumUpdate.y * momentumUpdate.y)
      const normalized = {
        x: momentumUpdate.x / (norm + 1e-8),
        y: momentumUpdate.y / (norm + 1e-8)
      }
      
      const update = {
        x: normalized.x * config.lr * Math.sqrt(norm),
        y: normalized.y * config.lr * Math.sqrt(norm)
      }
      
      return {
        ...state,
        velocity: momentumUpdate,
        position: {
          x: state.position.x - update.x,
          y: state.position.y - update.y
        }
      }
    },
    
    shampoo: (state, grad, config, iteration) => {
      // Simplified Shampoo for 2D: diagonal preconditioning
      // In full Shampoo, this would use Kronecker-factored matrices
      const H = state.H || [[config.epsilon!, 0], [0, config.epsilon!]]
      
      // Update preconditioning matrix every update_freq iterations
      if (iteration % hyperparams.shampoo.update_freq === 0) {
        const alpha = 0.99  // Exponential moving average factor
        H[0][0] = alpha * H[0][0] + (1 - alpha) * grad.x * grad.x
        H[1][1] = alpha * H[1][1] + (1 - alpha) * grad.y * grad.y
      }
      
      // Apply preconditioned gradient descent
      // In full Shampoo, this would involve matrix factorization
      const preconditioned = {
        x: grad.x / Math.pow(H[0][0], 0.25),  // 4th root for better conditioning
        y: grad.y / Math.pow(H[1][1], 0.25)
      }
      
      return {
        ...state,
        H: H,
        position: {
          x: state.position.x - config.lr * preconditioned.x,
          y: state.position.y - config.lr * preconditioned.y
        }
      }
    }
  }
  
  // Handle scroll for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    
    // Zoom with scroll (no panning)
    const delta = e.deltaY > 0 ? 0.1 : -0.1
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta
      // Clamp between 1 (default -2 to 2) and 2 (zoomed out -4 to 4)
      return Math.max(1, Math.min(2, newZoom))
    })
  }
  
  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const scaleX = canvasSize / rect.width
    const scaleY = canvasSize / rect.height
    const canvasX = (e.clientX - rect.left) * scaleX
    const canvasY = (e.clientY - rect.top) * scaleY
    
    // Convert to coordinate space
    const x = (canvasX / canvasSize) * (xRange.max - xRange.min) + xRange.min
    const y = (1 - canvasY / canvasSize) * (yRange.max - yRange.min) + yRange.min
    
    const startPoint = { x, y }
    setClickPoint(startPoint)
    
    // Clear old runs and launch selected optimizers from this point
    const newRuns: OptimizerRun[] = selectedOptimizers.map(opt => ({
      optimizer: opt,
      startPoint,
      path: [startPoint],
      losses: [computeLoss(startPoint.x, startPoint.y)],
      state: { position: { ...startPoint } },
      isActive: true
    }))
    
    setRuns(newRuns)
  }
  
  // Reset all
  const reset = () => {
    setRuns([])
    setClickPoint(null)
  }
  
  // Update step
  const step = () => {
    setRuns(prevRuns => {
      return prevRuns.map(run => {
        if (!run.isActive) return run
        
        const grad = computeGradient(run.state.position.x, run.state.position.y)
        const config = optimizerConfigs[run.optimizer]
        const iteration = run.path.length
        
        // Stop if gradient is very small (converged)
        const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y)
        if (gradMagnitude < 0.001 && noiseLevel === 0) {
          return { ...run, isActive: false }
        }
        
        const newState = optimizerSteps[run.optimizer](run.state, grad, config, iteration)
        const newPosition = newState.position
        const newLoss = computeLoss(newPosition.x, newPosition.y)
        
        // Stop if converged or diverged
        if (newLoss < 0.0001 || newLoss > 1e6 || !isFinite(newLoss)) {
          // Debug: log where optimizers think they've converged for Rosenbrock
          if (landscapeType === 'rosenbrock' && newLoss < 0.0001) {
            console.log(`${optimizerConfigs[run.optimizer].name} converged at (${newPosition.x.toFixed(4)}, ${newPosition.y.toFixed(4)}) with loss ${newLoss.toExponential(2)}`)
          }
          return { ...run, isActive: false }
        }
        
        return {
          ...run,
          state: newState,
          path: [...run.path, newPosition],
          losses: [...run.losses, newLoss]
        }
      })
    })
  }
  
  // Animation loop - always run when there are active runs
  useEffect(() => {
    if (runs.some(r => r.isActive)) {
      intervalRef.current = setInterval(() => {
        step()
      }, 1000 / speed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [speed, runs, noiseLevel])
  
  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)
    
    // Draw smooth gradient background
    const imageData = ctx.createImageData(canvasSize, canvasSize)
    
    // Find min/max for normalization
    let minLoss = Infinity
    let maxLoss = -Infinity
    
    // First pass to find range
    for (let px = 0; px < canvasSize; px += 2) {
      for (let py = 0; py < canvasSize; py += 2) {
        const x = (px / canvasSize) * (xRange.max - xRange.min) + xRange.min
        const y = (1 - py / canvasSize) * (yRange.max - yRange.min) + yRange.min
        const loss = computeLoss(x, y)
        minLoss = Math.min(minLoss, loss)
        maxLoss = Math.min(Math.max(maxLoss, loss), 50) // Cap at 50 for better visualization
      }
    }
    
    // Second pass to draw
    for (let px = 0; px < canvasSize; px++) {
      for (let py = 0; py < canvasSize; py++) {
        const x = (px / canvasSize) * (xRange.max - xRange.min) + xRange.min
        const y = (1 - py / canvasSize) * (yRange.max - yRange.min) + yRange.min
        const loss = computeLoss(x, y)
        
        const idx = (py * canvasSize + px) * 4
        
        // Normalize and create smooth gradient
        const normalized = Math.min(Math.max((loss - minLoss) / (maxLoss - minLoss), 0), 1)
        
        // Color scheme: dark blue (low) -> cyan -> yellow -> red (high)
        let r, g, b
        if (normalized < 0.25) {
          // Dark blue to blue
          const t = normalized / 0.25
          r = 0
          g = 0
          b = 100 + t * 155
        } else if (normalized < 0.5) {
          // Blue to cyan
          const t = (normalized - 0.25) / 0.25
          r = 0
          g = t * 200
          b = 255
        } else if (normalized < 0.75) {
          // Cyan to yellow
          const t = (normalized - 0.5) / 0.25
          r = t * 255
          g = 200 + t * 55
          b = 255 * (1 - t)
        } else {
          // Yellow to red
          const t = (normalized - 0.75) / 0.25
          r = 255
          g = 255 * (1 - t * 0.5)
          b = 0
        }
        
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 255
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Draw optimal point
    let optimal = { x: 0, y: 0 }
    switch (landscapeType) {
      case 'convex':
        optimal = { x: 0, y: 0 }
        break
      case 'rosenbrock':
        optimal = { x: 1, y: 1 }
        break
      case 'beale':
        optimal = { x: 3, y: 0.5 }
        // Clamp if outside range
        if (optimal.x > xRange.max) optimal.x = xRange.max
        break
      case 'rastrigin':
        optimal = { x: 0, y: 0 } // Global minimum at origin
        break
    }
    
    const optimalPx = ((optimal.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
    const optimalPy = (1 - (optimal.y - yRange.min) / (yRange.max - yRange.min)) * canvasSize
    
    ctx.strokeStyle = '#16a34a'
    ctx.fillStyle = '#16a34a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(optimalPx, optimalPy, 8, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(optimalPx, optimalPy, 3, 0, 2 * Math.PI)
    ctx.fill()
    
    // Draw optimizer paths
    runs.forEach(run => {
      const config = optimizerConfigs[run.optimizer]
      ctx.strokeStyle = config.color
      ctx.lineWidth = 2
      
      ctx.beginPath()
      run.path.forEach((point, i) => {
        const px = ((point.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
        const py = (1 - (point.y - yRange.min) / (yRange.max - yRange.min)) * canvasSize
        
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      })
      ctx.stroke()
      
      // Draw current position dot (always visible)
      if (run.path.length > 0) {
        const lastPoint = run.path[run.path.length - 1]
        const px = ((lastPoint.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
        const py = (1 - (lastPoint.y - yRange.min) / (yRange.max - yRange.min)) * canvasSize
        
        ctx.fillStyle = config.color
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
      
      // Draw start point
      const startPx = ((run.startPoint.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
      const startPy = (1 - (run.startPoint.y - yRange.min) / (yRange.max - yRange.min)) * canvasSize
      
      ctx.fillStyle = 'white'
      ctx.strokeStyle = config.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(startPx, startPy, 3, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    })
    
    // Draw click indicator
    if (clickPoint) {
      const px = ((clickPoint.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
      const py = (1 - (clickPoint.y - yRange.min) / (yRange.max - yRange.min)) * canvasSize
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(px, py, 15, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }
    
  }, [runs, landscapeType, clickPoint, zoom])
  
  // Clear old inactive runs periodically
  useEffect(() => {
    const maxRuns = 20
    if (runs.length > maxRuns) {
      setRuns(prevRuns => {
        const activeRuns = prevRuns.filter(r => r.isActive)
        const inactiveRuns = prevRuns.filter(r => !r.isActive).slice(-(maxRuns - activeRuns.length))
        return [...inactiveRuns, ...activeRuns]
      })
    }
  }, [runs.length])
  
  // Get active run statistics
  const activeRuns = runs.filter(r => r.isActive)
  
  return (
    <>
    <style>{`
      @media print {
        .optimizer-demo-container {
          display: none !important;
        }
        .optimizer-print-placeholder {
          display: block !important;
          padding: 1rem;
          margin: 1rem 0;
          border: 1px solid #ccc;
          background: #f9f9f9;
          color: #666;
          font-family: monospace;
          font-size: 0.9rem;
          text-align: center;
        }
      }
      @media screen {
        .optimizer-print-placeholder {
          display: none !important;
        }
      }
    `}</style>
    
    <div className="optimizer-print-placeholder">
      [INTERACTIVE OPTIMIZER COMPARISON DEMO]
    </div>
    
    <div className="optimizer-demo-container">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Top controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Part 1: Landscape selector */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Loss Landscape</div>
              <div className="flex gap-2 flex-wrap">
                {(['convex', 'rosenbrock', 'beale', 'rastrigin'] as const).map(type => (
                  <Button
                    key={type}
                    onClick={() => {
                      setLandscapeType(type)
                      reset()
                    }}
                    variant={landscapeType === type ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Part 2: Optimizer toggles - organized in 2 rows */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Active Optimizers</div>
              <div className="space-y-2">
                {/* First row: SGD, SGD+Momentum, RMSprop */}
                <div className="flex gap-3 flex-wrap">
                  {['sgd', 'sgdMomentum', 'rmsprop'].map(key => (
                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                      <Checkbox
                        checked={selectedOptimizers.includes(key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptimizers([...selectedOptimizers, key])
                          } else {
                            setSelectedOptimizers(selectedOptimizers.filter(o => o !== key))
                          }
                        }}
                      />
                      <span className="text-sm" style={{ color: optimizerConfigs[key].color }}>
                        {optimizerConfigs[key].name}
                      </span>
                    </label>
                  ))}
                </div>
                {/* Second row: Adam, AdamW, Muon, Shampoo */}
                <div className="flex gap-3 flex-wrap">
                  {['adam', 'adamw', 'muon', 'shampoo'].map(key => (
                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                      <Checkbox
                        checked={selectedOptimizers.includes(key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptimizers([...selectedOptimizers, key])
                          } else {
                            setSelectedOptimizers(selectedOptimizers.filter(o => o !== key))
                          }
                        }}
                      />
                      <span className="text-sm" style={{ color: optimizerConfigs[key].color }}>
                        {optimizerConfigs[key].name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Click anywhere on the landscape to launch optimizers
            </div>
            <div className="flex items-center gap-2">
              <span>Scroll to zoom • Range: [{xRange.min.toFixed(0)}, {xRange.max.toFixed(0)}]</span>
            </div>
          </div>
          
          {/* Part 3: Main visualization */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="w-full max-w-[600px] mx-auto border rounded-lg cursor-crosshair"
              style={{ imageRendering: 'auto' }}
              onClick={handleCanvasClick}
              onWheel={handleWheel}
            />
            
            {/* Legend */}
            <div className="absolute top-2 right-2 bg-background/90 p-2 rounded border text-xs">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span>Optimal</span>
              </div>
              {selectedOptimizers.map(opt => (
                <div key={opt} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: optimizerConfigs[opt].color }}
                  />
                  <span>{optimizerConfigs[opt].name}</span>
                </div>
              ))}
            </div>
            
            {/* Runs info - show all recent runs, not just active */}
            {runs.length > 0 && (
              <div className="absolute bottom-2 left-2 bg-background/90 p-2 rounded border text-xs">
                <div className="font-medium mb-1">Steps Taken</div>
                {runs.slice(-selectedOptimizers.length).map((run, i) => {
                  const steps = run.path.length - 1
                  return (
                    <div key={i} style={{ color: optimizerConfigs[run.optimizer].color }}>
                      {optimizerConfigs[run.optimizer].name}: {steps}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Collapsible settings */}
          <div className="border rounded-lg">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-medium">Advanced Settings</span>
              {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showSettings && (
              <div className="p-4 border-t space-y-4">
                {/* Shared Learning Rate */}
                <div className="border-b pb-4">
                  <div className="text-sm font-medium mb-2">Shared Learning Rate: {sharedLearningRate.toFixed(3)}</div>
                  <input
                    type="range"
                    value={Math.log10(sharedLearningRate)}
                    onChange={(e) => setSharedLearningRate(Math.pow(10, parseFloat(e.target.value)))}
                    min={-4}
                    max={-0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                {/* Individual Optimizer Settings */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Optimizer-Specific Parameters</div>
                  
                  {/* SGD - no additional params */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.sgd.color }}>
                      SGD (no additional parameters)
                    </summary>
                  </details>
                  
                  {/* SGD + Momentum */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.sgdMomentum.color }}>
                      SGD + Momentum
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Momentum: {hyperparams.sgdMomentum.momentum.toFixed(2)}</label>
                        <input
                          type="range"
                          value={hyperparams.sgdMomentum.momentum * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            sgdMomentum: { ...prev.sgdMomentum, momentum: parseFloat(e.target.value) / 100 }
                          }))}
                          min={0}
                          max={99}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </details>
                  
                  {/* RMSprop */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.rmsprop.color }}>
                      RMSprop
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Alpha (α): {hyperparams.rmsprop.alpha.toFixed(3)}</label>
                        <input
                          type="range"
                          value={hyperparams.rmsprop.alpha * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            rmsprop: { ...prev.rmsprop, alpha: parseFloat(e.target.value) / 100 }
                          }))}
                          min={50}
                          max={99.9}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Epsilon (ε): {hyperparams.rmsprop.epsilon.toExponential(0)}</label>
                        <input
                          type="range"
                          value={Math.log10(hyperparams.rmsprop.epsilon)}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            rmsprop: { ...prev.rmsprop, epsilon: Math.pow(10, parseFloat(e.target.value)) }
                          }))}
                          min={-10}
                          max={-4}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </details>
                  
                  {/* Adam */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.adam.color }}>
                      Adam
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Beta1 (β₁): {hyperparams.adam.beta1.toFixed(3)}</label>
                        <input
                          type="range"
                          value={hyperparams.adam.beta1 * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adam: { ...prev.adam, beta1: parseFloat(e.target.value) / 100 }
                          }))}
                          min={50}
                          max={99}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Beta2 (β₂): {hyperparams.adam.beta2.toFixed(4)}</label>
                        <input
                          type="range"
                          value={hyperparams.adam.beta2 * 1000}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adam: { ...prev.adam, beta2: parseFloat(e.target.value) / 1000 }
                          }))}
                          min={900}
                          max={999}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Epsilon (ε): {hyperparams.adam.epsilon.toExponential(0)}</label>
                        <input
                          type="range"
                          value={Math.log10(hyperparams.adam.epsilon)}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adam: { ...prev.adam, epsilon: Math.pow(10, parseFloat(e.target.value)) }
                          }))}
                          min={-10}
                          max={-4}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </details>
                  
                  {/* AdamW */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.adamw.color }}>
                      AdamW
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Beta1 (β₁): {hyperparams.adamw.beta1.toFixed(3)}</label>
                        <input
                          type="range"
                          value={hyperparams.adamw.beta1 * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adamw: { ...prev.adamw, beta1: parseFloat(e.target.value) / 100 }
                          }))}
                          min={50}
                          max={99}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Beta2 (β₂): {hyperparams.adamw.beta2.toFixed(4)}</label>
                        <input
                          type="range"
                          value={hyperparams.adamw.beta2 * 1000}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adamw: { ...prev.adamw, beta2: parseFloat(e.target.value) / 1000 }
                          }))}
                          min={900}
                          max={999}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Weight Decay: {hyperparams.adamw.weight_decay.toFixed(3)}</label>
                        <input
                          type="range"
                          value={hyperparams.adamw.weight_decay * 1000}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adamw: { ...prev.adamw, weight_decay: parseFloat(e.target.value) / 1000 }
                          }))}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Epsilon (ε): {hyperparams.adamw.epsilon.toExponential(0)}</label>
                        <input
                          type="range"
                          value={Math.log10(hyperparams.adamw.epsilon)}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adamw: { ...prev.adamw, epsilon: Math.pow(10, parseFloat(e.target.value)) }
                          }))}
                          min={-10}
                          max={-4}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </details>
                  
                  {/* Muon */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.muon.color }}>
                      Muon
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Momentum: {hyperparams.muon.momentum.toFixed(2)}</label>
                        <input
                          type="range"
                          value={hyperparams.muon.momentum * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            muon: { ...prev.muon, momentum: parseFloat(e.target.value) / 100 }
                          }))}
                          min={80}
                          max={99}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Note: Nesterov=true, NS iterations=5 (fixed for 2D demo)
                      </div>
                    </div>
                  </details>
                  
                  {/* Shampoo */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm" style={{ color: optimizerConfigs.shampoo.color }}>
                      Shampoo
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Epsilon (ε): {hyperparams.shampoo.epsilon.toExponential(0)}</label>
                        <input
                          type="range"
                          value={Math.log10(hyperparams.shampoo.epsilon)}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            shampoo: { ...prev.shampoo, epsilon: Math.pow(10, parseFloat(e.target.value)) }
                          }))}
                          min={-6}
                          max={-2}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Update Frequency: {hyperparams.shampoo.update_freq}</label>
                        <input
                          type="range"
                          value={hyperparams.shampoo.update_freq}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            shampoo: { ...prev.shampoo, update_freq: parseInt(e.target.value) }
                          }))}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Note: Simplified diagonal preconditioning for 2D demo
                      </div>
                    </div>
                  </details>
                </div>
                
                {/* Other settings */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Simulation Speed: {speed} steps/s
                    </label>
                    <input
                      type="range"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      min={1}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Gradient Noise: {noiseLevel.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      value={noiseLevel}
                      onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
    </>
  )
}