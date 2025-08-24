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

export default function OptimizerVisualizationSVG() {
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
  
  // SVG viewBox and zoom
  const [viewBox, setViewBox] = useState('-2 -2 4 4') // min-x min-y width height
  const svgSize = 600
  const svgRef = useRef<SVGSVGElement>(null)
  
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
  }
  
  // Loss functions
  const computeLossClean = (x: number, y: number): number => {
    let loss = 0
    switch (landscapeType) {
      case 'convex':
        loss = x * x + y * y
        break
      case 'rosenbrock':
        loss = Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
        break
      case 'beale':
        loss = Math.pow(1.5 - x + x * y, 2) + 
               Math.pow(2.25 - x + x * y * y, 2) + 
               Math.pow(2.625 - x + x * y * y * y, 2)
        break
      case 'rastrigin':
        const A = 10
        const n = 2
        loss = A * n + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y))
        break
    }
    return loss
  }
  
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
  
  // Handle SVG click
  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    
    // Transform to SVG coordinates
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    
    // In SVG, y increases downward, but our math has y increasing upward
    // So we need to flip the y coordinate
    const startPoint = { x: svgP.x, y: -svgP.y }
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
  
  // Handle wheel for zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? 1.1 : 0.9
    const [minX, minY, width, height] = viewBox.split(' ').map(Number)
    
    // Zoom centered on current view
    const centerX = minX + width / 2
    const centerY = minY + height / 2
    
    const newWidth = width * delta
    const newHeight = height * delta
    
    // Limit zoom
    if (newWidth > 8 || newWidth < 2) return
    
    const newMinX = centerX - newWidth / 2
    const newMinY = centerY - newHeight / 2
    
    setViewBox(`${newMinX} ${newMinY} ${newWidth} ${newHeight}`)
  }
  
  // Reset
  const reset = () => {
    setRuns([])
    setClickPoint(null)
    setViewBox('-2 -2 4 4')
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
  
  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const resolution = 50 // Number of cells in each direction
    const [minX, minY, width, height] = viewBox.split(' ').map(Number)
    const maxX = minX + width
    const maxY = minY + height
    
    const cells = []
    let minLoss = Infinity
    let maxLoss = -Infinity
    
    // First pass to find range
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = minX + (i / resolution) * width
        const y = minY + (j / resolution) * height
        // Remember to flip y for our coordinate system
        const loss = computeLossClean(x, -y)
        minLoss = Math.min(minLoss, loss)
        maxLoss = Math.min(Math.max(maxLoss, loss), 50)
      }
    }
    
    // Second pass to create cells
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = minX + (i / resolution) * width
        const y = minY + (j / resolution) * height
        const loss = computeLossClean(x, -y)
        
        const normalized = Math.min(Math.max((loss - minLoss) / (maxLoss - minLoss), 0), 1)
        
        // Color gradient
        let color
        if (normalized < 0.25) {
          const t = normalized / 0.25
          color = `rgb(0, 0, ${100 + t * 155})`
        } else if (normalized < 0.5) {
          const t = (normalized - 0.25) / 0.25
          color = `rgb(0, ${t * 200}, 255)`
        } else if (normalized < 0.75) {
          const t = (normalized - 0.5) / 0.25
          color = `rgb(${t * 255}, ${200 + t * 55}, ${255 * (1 - t)})`
        } else {
          const t = (normalized - 0.75) / 0.25
          color = `rgb(255, ${255 * (1 - t * 0.5)}, 0)`
        }
        
        cells.push({
          x,
          y,
          width: width / resolution,
          height: height / resolution,
          color
        })
      }
    }
    
    return cells
  }, [landscapeType, viewBox])
  
  // Get optimal point
  const optimal = useMemo(() => {
    switch (landscapeType) {
      case 'convex':
        return { x: 0, y: 0 }
      case 'rosenbrock':
        return { x: 1, y: 1 }
      case 'beale':
        return { x: 3, y: 0.5 }
      case 'rastrigin':
        return { x: 0, y: 0 }
      default:
        return { x: 0, y: 0 }
    }
  }, [landscapeType])
  
  // Get current viewBox bounds
  const [minX, minY, viewWidth, viewHeight] = viewBox.split(' ').map(Number)
  
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
          
          {/* Instructions */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Click anywhere on the landscape to launch optimizers
            </div>
            <div className="flex items-center gap-2">
              <span>Scroll to zoom • Range: [{minX.toFixed(1)}, {(minX + viewWidth).toFixed(1)}]</span>
            </div>
          </div>
          
          {/* Main SVG visualization */}
          <div className="relative">
            <svg
              ref={svgRef}
              width={svgSize}
              height={svgSize}
              viewBox={viewBox}
              className="w-full max-w-[600px] mx-auto border rounded-lg cursor-crosshair"
              onClick={handleSVGClick}
              onWheel={handleWheel}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {/* Heatmap background */}
              <g>
                {heatmapData.map((cell, i) => (
                  <rect
                    key={i}
                    x={cell.x}
                    y={cell.y}
                    width={cell.width}
                    height={cell.height}
                    fill={cell.color}
                    stroke="none"
                  />
                ))}
              </g>
              
              {/* Optimal point */}
              <g transform={`translate(${optimal.x}, ${-optimal.y})`}>
                <circle r="0.05" fill="none" stroke="#16a34a" strokeWidth="0.02" />
                <circle r="0.02" fill="#16a34a" />
              </g>
              
              {/* Optimizer paths */}
              {runs.map((run, runIdx) => {
                const config = optimizerConfigs[run.optimizer]
                const pathData = run.path
                  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${-p.y}`)
                  .join(' ')
                
                return (
                  <g key={runIdx}>
                    {/* Path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={config.color}
                      strokeWidth="0.02"
                      opacity={run.isActive ? 1 : 0.8}
                    />
                    
                    {/* Current position */}
                    {run.path.length > 0 && (
                      <circle
                        cx={run.path[run.path.length - 1].x}
                        cy={-run.path[run.path.length - 1].y}
                        r="0.03"
                        fill={config.color}
                      />
                    )}
                    
                    {/* Start point */}
                    <circle
                      cx={run.startPoint.x}
                      cy={-run.startPoint.y}
                      r="0.02"
                      fill="white"
                      stroke={config.color}
                      strokeWidth="0.015"
                    />
                  </g>
                )
              })}
              
              {/* Click indicator */}
              {clickPoint && (
                <circle
                  cx={clickPoint.x}
                  cy={-clickPoint.y}
                  r="0.1"
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="0.01"
                  strokeDasharray="0.02,0.02"
                />
              )}
            </svg>
            
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
            
            {/* Steps info */}
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
          
          {/* Settings (simplified for brevity) */}
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
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
    </>
  )
}