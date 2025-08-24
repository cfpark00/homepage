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
  diverged?: boolean
}

export default function OptimizerVisualizationHybrid() {
  // Loss landscape parameters
  const [landscapeType, setLandscapeType] = useState<'convex' | 'rosenbrock' | 'beale' | 'rastrigin'>('convex')
  
  // Simulation state
  const [showSettings, setShowSettings] = useState(false)
  const [runs, setRuns] = useState<OptimizerRun[]>([])
  const [selectedOptimizers, setSelectedOptimizers] = useState<string[]>(['sgd', 'sgdMomentum', 'rmsprop', 'adam', 'adamw', 'muon', 'shampoo'])
  const [clickPoint, setClickPoint] = useState<Point | null>(null)
  
  // Hyperparameters
  const [speed, setSpeed] = useState(20)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [sharedLearningRate, setSharedLearningRate] = useState(0.003)
  
  // Canvas and SVG refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // View dimensions
  const xRange = { min: -2, max: 2 }
  const yRange = { min: -2, max: 2 }
  const canvasSize = 600
  
  // Animation control
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Individual optimizer hyperparameters with PyTorch defaults
  const [hyperparams, setHyperparams] = useState({
    sgd: {},
    sgdMomentum: {
      momentum: 0.9
    },
    rmsprop: {
      alpha: 0.99,
      epsilon: 1e-8
    },
    adam: {
      beta1: 0.9,
      beta2: 0.999,
      epsilon: 1e-8
    },
    adamw: {
      beta1: 0.9,
      beta2: 0.999,
      epsilon: 1e-8,
      weight_decay: 0.01
    },
    muon: {
      momentum: 0.95,
      nesterov: true,
      ns_steps: 5
    },
    shampoo: {
      epsilon: 1e-4,
      update_freq: 1
    }
  })
  
  // Optimizer configurations - must be reactive to hyperparams changes
  const optimizerConfigs: Record<string, OptimizerConfig> = useMemo(() => ({
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
      beta2: hyperparams.rmsprop.alpha,
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
  }), [sharedLearningRate, hyperparams])
  
  // Loss functions
  const computeLossClean = (x: number, y: number): number => {
    let loss = 0
    switch (landscapeType) {
      case 'convex':
        // Rotated elliptical convex - diagonal orientation with 4:1 ratio
        const xRot = (x + y) / Math.sqrt(2)  // 45 degree rotation
        const yRot = (x - y) / Math.sqrt(2)
        loss = 5 * (4 * xRot * xRot + yRot * yRot)  // Scale up for better color range
        break
      case 'rosenbrock':
        loss = Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
        break
      case 'beale':
        // Transform coordinates: x_beale = 3*x, y unchanged
        // This maps (1, 0.5) in display space to (3, 0.5) in Beale space (the minimum)
        // And keeps (0, 0) fixed at (0, 0)
        const xBeale = 3 * x
        loss = Math.pow(1.5 - xBeale + xBeale * y, 2) + 
               Math.pow(2.25 - xBeale + xBeale * y * y, 2) + 
               Math.pow(2.625 - xBeale + xBeale * y * y * y, 2)
        break
      case 'rastrigin':
        const A = 0.5  // Very subtle local minima
        const n = 2
        loss = A * n + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y))
        break
    }
    return loss
  }
  
  const computeLoss = (x: number, y: number): number => {
    return computeLossClean(x, y)
  }
  
  // Compute gradient
  const computeGradient = (x: number, y: number): Point => {
    const h = 0.0001
    const fx = computeLossClean(x, y)
    const gradX = (computeLossClean(x + h, y) - fx) / h
    const gradY = (computeLossClean(x, y + h) - fx) / h
    
    const noise = noiseLevel * 0.1
    return {
      x: gradX + (Math.random() - 0.5) * noise,
      y: gradY + (Math.random() - 0.5) * noise
    }
  }
  
  // Optimizer step functions (same as before)
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
      const H = state.H || [[config.epsilon!, 0], [0, config.epsilon!]]
      
      if (iteration % hyperparams.shampoo.update_freq === 0) {
        const alpha = 0.99
        H[0][0] = alpha * H[0][0] + (1 - alpha) * grad.x * grad.x
        H[1][1] = alpha * H[1][1] + (1 - alpha) * grad.y * grad.y
      }
      
      const preconditioned = {
        x: grad.x / Math.pow(H[0][0], 0.25),
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
  
  // Convert coordinates to SVG space
  const toSVGCoords = (point: Point): Point => {
    const svgX = ((point.x - xRange.min) / (xRange.max - xRange.min)) * canvasSize
    const svgY = ((1 - (point.y - yRange.min) / (yRange.max - yRange.min))) * canvasSize
    return { x: svgX, y: svgY }
  }
  
  // Convert SVG space to coordinates
  const fromSVGCoords = (svgPoint: Point): Point => {
    const x = (svgPoint.x / canvasSize) * (xRange.max - xRange.min) + xRange.min
    const y = (1 - svgPoint.y / canvasSize) * (yRange.max - yRange.min) + yRange.min
    return { x, y }
  }
  
  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const scaleX = canvasSize / rect.width
    const scaleY = canvasSize / rect.height
    const svgX = (e.clientX - rect.left) * scaleX
    const svgY = (e.clientY - rect.top) * scaleY
    
    const startPoint = fromSVGCoords({ x: svgX, y: svgY })
    setClickPoint(startPoint)
    
    // Launch selected optimizers from this point
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
  
  
  // Reset
  const reset = () => {
    setRuns([])
    setClickPoint(null)
  }
  
  // Update step
  const step = () => {
    // Get optimal point for current landscape
    let optimal = { x: 0, y: 0 }
    switch (landscapeType) {
      case 'convex':
        optimal = { x: 0, y: 0 }
        break
      case 'rosenbrock':
        optimal = { x: 1, y: 1 }
        break
      case 'beale':
        optimal = { x: 1, y: 0.5 }
        break
      case 'rastrigin':
        optimal = { x: 0, y: 0 }
        break
    }
    
    setRuns(prevRuns => {
      return prevRuns.map(run => {
        if (!run.isActive) return run
        
        const grad = computeGradient(run.state.position.x, run.state.position.y)
        const config = optimizerConfigs[run.optimizer]
        const iteration = run.path.length
        
        const newState = optimizerSteps[run.optimizer](run.state, grad, config, iteration)
        const newPosition = newState.position
        const newLoss = computeLoss(newPosition.x, newPosition.y)
        
        // Stop if converged (within 0.05 distance of optimal) or diverged
        const distance = Math.sqrt(
          Math.pow(newPosition.x - optimal.x, 2) + 
          Math.pow(newPosition.y - optimal.y, 2)
        )
        
        if (distance < 0.05 || newLoss > 1e6 || !isFinite(newLoss)) {
          if (distance < 0.05) {
            console.log(`${optimizerConfigs[run.optimizer].name} converged at (${newPosition.x.toFixed(4)}, ${newPosition.y.toFixed(4)}) with distance ${distance.toFixed(4)} from optimal`)
          }
          const diverged = newLoss > 1e6 || !isFinite(newLoss)
          return { 
            ...run, 
            state: newState,
            path: [...run.path, newPosition],
            losses: [...run.losses, newLoss],
            isActive: false, 
            diverged 
          }
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
  
  // Animation loop
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
  
  // Draw canvas heatmap
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas internal size
    canvas.width = canvasSize
    canvas.height = canvasSize
    
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
        const coord = fromSVGCoords({ x: px, y: py })
        const loss = computeLossClean(coord.x, coord.y)
        minLoss = Math.min(minLoss, loss)
        maxLoss = Math.min(Math.max(maxLoss, loss), 50) // Cap at 50 for better visualization
      }
    }
    
    // Second pass to draw
    for (let px = 0; px < canvasSize; px++) {
      for (let py = 0; py < canvasSize; py++) {
        const coord = fromSVGCoords({ x: px, y: py })
        const loss = computeLossClean(coord.x, coord.y)
        
        const idx = (py * canvasSize + px) * 4
        
        // Normalize and create smooth gradient
        const normalized = Math.min(Math.max((loss - minLoss) / (maxLoss - minLoss), 0), 1)
        
        // Color scheme: dark blue (low) -> cyan -> yellow -> red (high)
        let r, g, b
        if (normalized < 0.25) {
          const t = normalized / 0.25
          r = 0
          g = 0
          b = 100 + t * 155
        } else if (normalized < 0.5) {
          const t = (normalized - 0.25) / 0.25
          r = 0
          g = t * 200
          b = 255
        } else if (normalized < 0.75) {
          const t = (normalized - 0.5) / 0.25
          r = t * 255
          g = 200 + t * 55
          b = 255 * (1 - t)
        } else {
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
  }, [landscapeType])
  
  // Get optimal point
  let optimal = { x: 0, y: 0 }
  switch (landscapeType) {
    case 'convex':
      optimal = { x: 0, y: 0 }
      break
    case 'rosenbrock':
      optimal = { x: 1, y: 1 }
      break
    case 'beale':
      optimal = { x: 1, y: 0.5 }  // After transformation, minimum is at (1, 0.5)
      break
    case 'rastrigin':
      optimal = { x: 0, y: 0 }
      break
  }
  
  const optimalSVG = toSVGCoords(optimal)
  
  return (
    <>
    <style>{`
      @media print {
        .optimizer-demo-container {
          display: none !important;
        }
      }
    `}</style>
    
    <div className="optimizer-demo-container">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Top controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Landscape selector */}
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
            
            {/* Optimizer toggles */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Active Optimizers</div>
              <div className="space-y-2">
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
          
          {/* Settings - moved above instructions */}
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
                <div className="text-sm font-medium">Shared Learning Rate: {sharedLearningRate.toFixed(3)}</div>
                <input
                  type="range"
                  value={Math.log10(sharedLearningRate)}
                  onChange={(e) => setSharedLearningRate(Math.pow(10, parseFloat(e.target.value)))}
                  min={-4}
                  max={-0.5}
                  step={0.1}
                  className="w-full"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Speed: {speed} steps/s</label>
                    <input
                      type="range"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      min={1}
                      max={60}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Noise: {noiseLevel.toFixed(1)}</label>
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

                {/* Individual Optimizer Parameters */}
                <div className="space-y-3 border-t pt-4">
                  <div className="text-sm font-medium">Individual Optimizer Parameters</div>
                  
                  {/* SGD+Momentum */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.sgdMomentum.color }}>
                      SGD+Momentum
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
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>

                  {/* RMSprop */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.rmsprop.color }}>
                      RMSprop
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs">Alpha (α): {hyperparams.rmsprop.alpha.toFixed(2)}</label>
                        <input
                          type="range"
                          value={hyperparams.rmsprop.alpha * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            rmsprop: { ...prev.rmsprop, alpha: parseFloat(e.target.value) / 100 }
                          }))}
                          min={50}
                          max={99}
                          className="w-full h-1"
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
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Adam */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.adam.color }}>
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
                          className="w-full h-1"
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
                          className="w-full h-1"
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
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>

                  {/* AdamW */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.adamw.color }}>
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
                          className="w-full h-1"
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
                          className="w-full h-1"
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
                          className="w-full h-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Weight Decay: {hyperparams.adamw.weight_decay.toFixed(3)}</label>
                        <input
                          type="range"
                          value={hyperparams.adamw.weight_decay * 100}
                          onChange={(e) => setHyperparams(prev => ({
                            ...prev,
                            adamw: { ...prev.adamw, weight_decay: parseFloat(e.target.value) / 100 }
                          }))}
                          min={0}
                          max={10}
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Muon */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.muon.color }}>
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
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Shampoo */}
                  <details className="border rounded p-2">
                    <summary className="cursor-pointer text-sm font-medium" style={{ color: optimizerConfigs.shampoo.color }}>
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
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MousePointer className="h-4 w-4" />
            Click anywhere on the landscape to launch optimizers
          </div>
          
          {/* Main hybrid visualization */}
          <div 
            ref={containerRef}
            className="relative w-full max-w-[600px] mx-auto border rounded-lg"
            onClick={handleClick}
            style={{ cursor: 'crosshair', aspectRatio: '1/1' }}
          >
            {/* Canvas for heatmap */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ imageRendering: 'auto' }}
            />
            
            {/* SVG overlay for paths and points */}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${canvasSize} ${canvasSize}`}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            >
              {/* Optimal point */}
              <g>
                <circle cx={optimalSVG.x} cy={optimalSVG.y} r="8" fill="none" stroke="#16a34a" strokeWidth="2" />
                <circle cx={optimalSVG.x} cy={optimalSVG.y} r="3" fill="#16a34a" />
              </g>
              
              {/* Optimizer paths */}
              {runs.map((run, runIdx) => {
                const config = optimizerConfigs[run.optimizer]
                const pathData = run.path
                  .map((p, i) => {
                    const svgP = toSVGCoords(p)
                    return `${i === 0 ? 'M' : 'L'} ${svgP.x},${svgP.y}`
                  })
                  .join(' ')
                
                return (
                  <g key={runIdx}>
                    {/* Path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={config.color}
                      strokeWidth="2"
                      opacity={run.isActive ? 1 : 0.9}
                    />
                    
                    {/* Current position */}
                    {run.path.length > 0 && (() => {
                      const lastSVG = toSVGCoords(run.path[run.path.length - 1])
                      return (
                        <circle
                          cx={lastSVG.x}
                          cy={lastSVG.y}
                          r="4"
                          fill={config.color}
                        />
                      )
                    })()}
                    
                    {/* Start point */}
                    {(() => {
                      const startSVG = toSVGCoords(run.startPoint)
                      return (
                        <>
                          <circle
                            cx={startSVG.x}
                            cy={startSVG.y}
                            r="3"
                            fill="white"
                            stroke={config.color}
                            strokeWidth="2"
                          />
                        </>
                      )
                    })()}
                  </g>
                )
              })}
              
              {/* Click indicator */}
              {clickPoint && (() => {
                const clickSVG = toSVGCoords(clickPoint)
                return (
                  <circle
                    cx={clickSVG.x}
                    cy={clickSVG.y}
                    r="15"
                    fill="none"
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                )
              })()}
            </svg>
            
            {/* Steps info */}
            {runs.length > 0 && (
              <div className="absolute bottom-2 left-2 bg-background/90 p-2 rounded border text-xs">
                <div className="font-medium mb-1">Steps Taken</div>
                {runs.slice(-selectedOptimizers.length).map((run, i) => {
                  const steps = run.path.length - 1
                  const name = optimizerConfigs[run.optimizer].name
                  return (
                    <div 
                      key={i} 
                      style={{ 
                        color: optimizerConfigs[run.optimizer].color,
                        textDecoration: run.diverged ? 'line-through' : 'none'
                      }}
                    >
                      {name}: {steps}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Plots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Loss vs Steps Plot */}
        <div className="border rounded-lg p-4 bg-background">
          <h3 className="text-sm font-semibold mb-2 -mt-1">Loss vs Steps</h3>
          <svg width={350} height={170} className="w-full" viewBox="0 0 350 170">
            <g transform="translate(35, 20)">
              {/* Axes */}
              <line x1={0} y1={110} x2={310} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1={0} y1={0} x2={0} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
              
              {/* Plot loss curves with log scale */}
              {runs.map(run => {
                if (run.losses.length < 2) return null
                
                const config = optimizerConfigs[run.optimizer]
                const maxSteps = Math.max(...runs.map(r => r.losses.length))
                if (maxSteps <= 1) return null
                
                const allLosses = runs.flatMap(r => r.losses).filter(l => l > 0 && l < 1e6)
                if (allLosses.length === 0) return null
                
                const maxLoss = Math.max(...allLosses)
                const minLoss = Math.min(...allLosses)
                const logMax = Math.log10(maxLoss + 1e-10)
                const logMin = Math.log10(minLoss + 1e-10)
                const logRange = logMax - logMin
                
                return (
                  <path
                    key={`${run.optimizer}-${run.startPoint.x}-${run.startPoint.y}`}
                    d={run.losses.map((loss, i) => {
                      const x = maxSteps > 1 ? (i / (maxSteps - 1)) * 310 : 0
                      const logLoss = Math.log10(Math.max(loss, 1e-10))
                      const normalizedLogLoss = logRange > 0 ? (logLoss - logMin) / logRange : 0.5
                      const y = 110 - normalizedLogLoss * 100
                      return `${i === 0 ? 'M' : 'L'} ${isFinite(x) && isFinite(y) ? `${x} ${y}` : '0 110'}`
                    }).join(' ')}
                    fill="none"
                    stroke={config.color}
                    strokeWidth="1.5"
                    opacity={run.isActive ? 0.3 : 1}
                  />
                )
              })}
              
              {/* Y-axis ticks and labels */}
              {(() => {
                if (runs.length === 0) return null
                const allLosses = runs.flatMap(r => r.losses).filter(l => l > 0 && l < 1e6)
                if (allLosses.length === 0) return null
                const maxLoss = Math.max(...allLosses)
                const minLoss = Math.min(...allLosses)
                if (!isFinite(maxLoss) || !isFinite(minLoss)) return null
                const logMax = Math.log10(maxLoss + 1e-10)
                const logMin = Math.log10(minLoss + 1e-10)
                if (!isFinite(logMax) || !isFinite(logMin)) return null
                
                const ticks = []
                // Log scale ticks
                const step = (logMax - logMin) > 4 ? 2 : 1
                for (let log = Math.ceil(logMin); log <= Math.floor(logMax); log += step) {
                  const y = 110 - ((log - logMin) / (logMax - logMin)) * 100
                  ticks.push(
                    <g key={log}>
                      <line x1={-3} y1={y} x2={0} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={-5} y={y + 3} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="end">
                        10<tspan fontSize="6" dy="-2">{log}</tspan>
                      </text>
                    </g>
                  )
                }
                return ticks
              })()}
              
              {/* X-axis ticks and labels */}
              {(() => {
                if (runs.length === 0) return null
                const maxSteps = Math.max(...runs.map(r => r.losses.length))
                if (maxSteps === 0) return null
                
                return (
                  <>
                    {/* Min (0) tick */}
                    <g>
                      <line x1={0} y1={110} x2={0} y2={113} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={0} y={123} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="middle">0</text>
                    </g>
                    {/* Max tick */}
                    <g>
                      <line x1={310} y1={110} x2={310} y2={113} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={310} y={123} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="middle">{maxSteps - 1}</text>
                    </g>
                  </>
                )
              })()}
              
              {/* Axis labels */}
              <text x={-25} y={55} fontSize="10" fill="currentColor" opacity="0.7" transform="rotate(-90, -25, 55)" textAnchor="middle">Loss (log)</text>
              <text x={155} y={140} fontSize="10" fill="currentColor" opacity="0.7" textAnchor="middle">Steps</text>
            </g>
          </svg>
        </div>
        
        {/* Gradient Magnitude vs Steps Plot */}
        <div className="border rounded-lg p-4 bg-background">
          <h3 className="text-sm font-semibold mb-2 -mt-1">Gradient Magnitude vs Steps</h3>
          <svg width={350} height={170} className="w-full" viewBox="0 0 350 170">
            <g transform="translate(35, 20)">
              {/* Axes */}
              <line x1={0} y1={110} x2={310} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1={0} y1={0} x2={0} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
              
              {/* Calculate and plot gradient magnitudes with log scale */}
              {runs.map(run => {
                if (run.path.length < 2) return null
                
                const config = optimizerConfigs[run.optimizer]
                const gradMagnitudes = run.path.slice(0, -1).map(pos => {
                  const grad = computeGradient(pos.x, pos.y)
                  return Math.sqrt(grad.x * grad.x + grad.y * grad.y)
                })
                
                if (gradMagnitudes.length === 0) return null
                
                const maxSteps = Math.max(...runs.map(r => r.path.length - 1))
                if (maxSteps <= 0) return null
                
                const allMags = runs.flatMap(r => 
                  r.path.slice(0, -1).map(pos => {
                    const g = computeGradient(pos.x, pos.y)
                    return Math.sqrt(g.x * g.x + g.y * g.y)
                  })
                ).filter(m => isFinite(m) && m > 0)
                
                if (allMags.length === 0) return null
                
                const maxMag = Math.max(...allMags)
                const minMag = Math.min(...allMags)
                const logMax = Math.log10(maxMag + 1e-10)
                const logMin = Math.log10(minMag + 1e-10)
                const logRange = logMax - logMin
                
                return (
                  <path
                    key={`grad-${run.optimizer}-${run.startPoint.x}-${run.startPoint.y}`}
                    d={gradMagnitudes.map((mag, i) => {
                      const x = maxSteps > 0 ? (i / Math.max(maxSteps, 1)) * 310 : 0
                      const logMag = Math.log10(Math.max(mag, 1e-10))
                      const normalizedLogMag = logRange > 0 ? (logMag - logMin) / logRange : 0.5
                      const y = 110 - normalizedLogMag * 100
                      return `${i === 0 ? 'M' : 'L'} ${isFinite(x) && isFinite(y) ? `${x} ${y}` : '0 110'}`
                    }).join(' ')}
                    fill="none"
                    stroke={config.color}
                    strokeWidth="1.5"
                    opacity={run.isActive ? 0.3 : 1}
                  />
                )
              })}
              
              {/* Y-axis ticks and labels */}
              {(() => {
                if (runs.length === 0) return null
                const allMags = runs.flatMap(r => 
                  r.path.slice(0, -1).map(pos => {
                    const g = computeGradient(pos.x, pos.y)
                    return Math.sqrt(g.x * g.x + g.y * g.y)
                  })
                ).filter(m => isFinite(m) && m > 0)
                
                if (allMags.length === 0) return null
                
                const maxMag = Math.max(...allMags)
                const minMag = Math.min(...allMags)
                if (!isFinite(maxMag) || !isFinite(minMag)) return null
                const logMax = Math.log10(maxMag + 1e-10)
                const logMin = Math.log10(minMag + 1e-10)
                if (!isFinite(logMax) || !isFinite(logMin)) return null
                
                const ticks = []
                // Log scale ticks
                const step = (logMax - logMin) > 4 ? 2 : 1
                for (let log = Math.ceil(logMin); log <= Math.floor(logMax); log += step) {
                  const y = 110 - ((log - logMin) / (logMax - logMin)) * 100
                  ticks.push(
                    <g key={log}>
                      <line x1={-3} y1={y} x2={0} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={-5} y={y + 3} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="end">
                        10<tspan fontSize="6" dy="-2">{log}</tspan>
                      </text>
                    </g>
                  )
                }
                return ticks
              })()}
              
              {/* X-axis ticks and labels */}
              {(() => {
                if (runs.length === 0) return null
                const maxSteps = Math.max(...runs.map(r => r.path.length - 1))
                if (maxSteps === 0) return null
                
                return (
                  <>
                    {/* Min (0) tick */}
                    <g>
                      <line x1={0} y1={110} x2={0} y2={113} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={0} y={123} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="middle">0</text>
                    </g>
                    {/* Max tick */}
                    <g>
                      <line x1={310} y1={110} x2={310} y2={113} stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <text x={310} y={123} fontSize="8" fill="currentColor" opacity="0.7" textAnchor="middle">{maxSteps}</text>
                    </g>
                  </>
                )
              })()}
              
              {/* Axis labels */}
              <text x={-25} y={55} fontSize="10" fill="currentColor" opacity="0.7" transform="rotate(-90, -25, 55)" textAnchor="middle">||∇f|| (log)</text>
              <text x={155} y={140} fontSize="10" fill="currentColor" opacity="0.7" textAnchor="middle">Steps</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
    </>
  )
}