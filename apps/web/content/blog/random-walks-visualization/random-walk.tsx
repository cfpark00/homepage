'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { Play, Pause, RotateCcw, Zap, ZoomIn, ZoomOut, Move, Maximize2 } from 'lucide-react'

interface Point {
  x: number
  y: number
}

export default function RandomWalk() {
  const gridSize = 200 // Much larger grid
  const cellSize = 10
  const viewBoxSize = 800 // Viewport size
  const WARN_LIMIT = 100000
  const MAX_LIMIT = 200000

  const [path, setPath] = useState<Point[]>([{ x: 0, y: 0 }])
  const [distances, setDistances] = useState<number[]>([0])
  const [isRunning, setIsRunning] = useState(false)
  const [stepsPerSecond, setStepsPerSecond] = useState(10)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: viewBoxSize / 2, y: viewBoxSize / 2 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [userWarned, setUserWarned] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (isRunning) {
      const intervalMs = 1000 / stepsPerSecond
      intervalRef.current = setInterval(() => {
        setPath(prevPath => {
          // Stop if at max limit
          if (prevPath.length >= MAX_LIMIT) {
            setIsRunning(false)
            setShowWarning(true)
            setTimeout(() => setShowWarning(false), 3000)
            return prevPath
          }
          
          // Show warning at 100K
          if (prevPath.length > WARN_LIMIT && !userWarned) {
            setUserWarned(true)
          }
          
          const lastPoint = prevPath[prevPath.length - 1]
          const directions = [
            { x: 0, y: -1 },  // up
            { x: 1, y: 0 },   // right
            { x: 0, y: 1 },   // down
            { x: -1, y: 0 }   // left
          ]
          
          const randomDirection = directions[Math.floor(Math.random() * 4)]
          const newPoint = {
            x: lastPoint.x + randomDirection.x,
            y: lastPoint.y + randomDirection.y
          }
          
          // Calculate distance for the new point
          const newDistance = Math.sqrt(newPoint.x * newPoint.x + newPoint.y * newPoint.y)
          setDistances(prevDistances => [...prevDistances, newDistance])
          
          return [...prevPath, newPoint]
        })
      }, intervalMs)
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
  }, [isRunning, stepsPerSecond, userWarned])

  const reset = () => {
    setIsRunning(false)
    setPath([{ x: 0, y: 0 }])
    setDistances([0])
    setZoom(1)
    setPan({ x: viewBoxSize / 2, y: viewBoxSize / 2 })
    setUserWarned(false)
    setShowWarning(false)
  }

  const addSteps = (steps: number) => {
    // Check limits
    if (path.length >= MAX_LIMIT) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    
    // Show warning at 100K if not warned yet
    if (path.length > WARN_LIMIT && !userWarned) {
      setUserWarned(true)
      // Continue but show warning
    }
    
    // Adjust steps if would exceed max
    const actualSteps = Math.min(steps, MAX_LIMIT - path.length)
    if (actualSteps === 0) return
    
    const wasRunning = isRunning
    if (wasRunning) {
      setIsRunning(false) // Temporarily pause
    }
    
    // Generate new points and distances together
    const newPoints: Point[] = []
    const newDistances: number[] = []
    let lastPoint = path[path.length - 1]
    
    for (let i = 0; i < actualSteps; i++) {
      const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ]
      
      const randomDirection = directions[Math.floor(Math.random() * 4)]
      const newPoint = {
        x: lastPoint.x + randomDirection.x,
        y: lastPoint.y + randomDirection.y
      }
      
      newPoints.push(newPoint)
      newDistances.push(Math.sqrt(newPoint.x * newPoint.x + newPoint.y * newPoint.y))
      lastPoint = newPoint
    }
    
    setPath(prevPath => [...prevPath, ...newPoints])
    setDistances(prevDistances => [...prevDistances, ...newDistances])
    
    // Resume if it was running
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 50) // Small delay to ensure state update
    }
  }

  const fitToView = () => {
    if (path.length < 2) return

    const minX = Math.min(...path.map(p => p.x))
    const maxX = Math.max(...path.map(p => p.x))
    const minY = Math.min(...path.map(p => p.y))
    const maxY = Math.max(...path.map(p => p.y))

    const width = (maxX - minX) * cellSize + 40
    const height = (maxY - minY) * cellSize + 40
    
    const scaleX = viewBoxSize / width
    const scaleY = viewBoxSize / height
    const newZoom = Math.min(scaleX, scaleY, 5)
    
    const centerX = (minX + maxX) / 2 * cellSize
    const centerY = (minY + maxY) / 2 * cellSize
    
    setZoom(newZoom)
    setPan({
      x: -centerX * newZoom + viewBoxSize / 2,
      y: -centerY * newZoom + viewBoxSize / 2
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    // Note: preventDefault in onWheel is handled by React, not passive
    e.preventDefault()
    e.stopPropagation()
    
    // Check if it's a pinch gesture (ctrlKey is true for pinch on trackpad)
    if (e.ctrlKey) {
      // Pinch zoom
      const delta = e.deltaY > 0 ? 0.95 : 1.05
      setZoom(prev => Math.max(0.1, Math.min(10, prev * delta)))
    } else {
      // Regular scroll wheel
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.max(0.1, Math.min(10, prev * delta)))
    }
  }

  // Prevent default zoom behavior on the entire container
  useEffect(() => {
    const handleWheelCapture = (e: WheelEvent) => {
      if (e.ctrlKey && svgRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const handleGestureStart = (e: Event) => {
      if (svgRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const handleGestureChange = (e: Event) => {
      if (svgRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const handleGestureEnd = (e: Event) => {
      if (svgRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    // Add event listeners with { passive: false } to allow preventDefault
    document.addEventListener('wheel', handleWheelCapture, { passive: false })
    document.addEventListener('gesturestart', handleGestureStart, { passive: false })
    document.addEventListener('gesturechange', handleGestureChange, { passive: false })
    document.addEventListener('gestureend', handleGestureEnd, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheelCapture)
      document.removeEventListener('gesturestart', handleGestureStart)
      document.removeEventListener('gesturechange', handleGestureChange)
      document.removeEventListener('gestureend', handleGestureEnd)
    }
  }, [])

  const svgPath = path.map((point, index) => {
    const x = point.x * cellSize
    const y = point.y * cellSize
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  // Calculate bounds (using reduce to avoid stack overflow with large paths)
  const minX = path.reduce((min, p) => Math.min(min, p.x), Infinity)
  const maxX = path.reduce((max, p) => Math.max(max, p.x), -Infinity)
  const minY = path.reduce((min, p) => Math.min(min, p.y), Infinity)
  const maxY = path.reduce((max, p) => Math.max(max, p.y), -Infinity)
  const distance = Math.sqrt(Math.pow(path[path.length - 1].x, 2) + Math.pow(path[path.length - 1].y, 2))

  return (
    <>
    <style>{`
      @media screen {
        .rw-print-placeholder {
          display: none !important;
        }
      }
      @media print {
        .rw-demo-container {
          display: none !important;
        }
        .rw-print-placeholder {
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
    `}</style>
    <div className="rw-print-placeholder">
      [INTERACTIVE DEMO]
    </div>
    <div className="rw-demo-container">
    <Card className="p-6">
      <div className="space-y-4">
        {/* Warning messages */}
        {showWarning && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            Maximum limit of 200K steps reached. Reset to continue.
          </div>
        )}
        {userWarned && path.length > WARN_LIMIT && path.length < MAX_LIMIT && (
          <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg p-3 text-sm">
            Performance warning: {path.length.toLocaleString()} steps. Approaching maximum limit (200K).
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap random-walk-controls">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant="default"
              size="sm"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              onClick={() => addSteps(1000)}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              +1K steps
            </Button>
            <Button
              onClick={() => addSteps(10000)}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              +10K steps
            </Button>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap random-walk-controls">
          <Button
            onClick={() => setZoom(z => Math.min(10, z * 1.5))}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setZoom(z => Math.max(0.1, z / 1.5))}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={fitToView}
            variant="outline"
            size="sm"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            Fit
          </Button>
          <span className="text-sm text-muted-foreground">
            Zoom: {(zoom * 100).toFixed(0)}%
          </span>
          <div className="flex-1" />
          <label className="text-sm">Speed:</label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={stepsPerSecond}
            onChange={(e) => setStepsPerSecond(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">{stepsPerSecond} steps/s</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div>Steps: {path.length - 1}</div>
          <div>Position: ({path[path.length - 1].x}, {path[path.length - 1].y})</div>
          <div>Distance: {distance.toFixed(2)}</div>
          <div>Bounds: X[{minX}, {maxX}]</div>
          <div>Bounds: Y[{minY}, {maxY}]</div>
          <div>Max extent: {Math.max(Math.abs(minX), maxX, Math.abs(minY), maxY)}</div>
        </div>

        <div 
          className="relative overflow-hidden rounded-lg border bg-muted/20 cursor-move random-walk-container"
          data-interactive="true"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none'  // Prevent browser zoom on touch devices
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="500"
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            className="w-full"
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Grid - only show when zoomed in enough */}
              {zoom > 0.8 && (
                <g opacity="0.1">
                  {Array.from({ length: Math.min(201, gridSize + 1) }).map((_, i) => {
                    const pos = (i - 100) * cellSize
                    return (
                      <g key={i}>
                        <line
                          x1={pos}
                          y1={-1000}
                          x2={pos}
                          y2={1000}
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                        <line
                          x1={-1000}
                          y1={pos}
                          x2={1000}
                          y2={pos}
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </g>
                    )
                  })}
                </g>
              )}

              {/* Axes */}
              <g opacity="0.3">
                <line
                  x1={-2000}
                  y1={0}
                  x2={2000}
                  y2={0}
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line
                  x1={0}
                  y1={-2000}
                  x2={0}
                  y2={2000}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </g>

              {/* Path */}
              <path
                d={svgPath}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={Math.max(0.5, 2 / zoom)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Start point */}
              <circle
                cx={0}
                cy={0}
                r={Math.max(2, 4 / zoom)}
                fill="hsl(var(--primary))"
              />

              {/* Current position */}
              {path.length > 1 && (
                <circle
                  cx={path[path.length - 1].x * cellSize}
                  cy={path[path.length - 1].y * cellSize}
                  r={Math.max(2, 4 / zoom)}
                  fill="hsl(var(--destructive))"
                />
              )}
            </g>
          </svg>
        </div>

        {/* Analytics Plots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Distance vs Time Plot */}
          <div className="border rounded-lg p-4 bg-background">
            <h3 className="text-sm font-semibold mb-2 -mt-1">Distance from Origin vs Steps</h3>
            <svg width={350} height={150} className="w-full" viewBox="0 0 350 150">
              <g transform="translate(25, 20)">
                {/* Axes */}
                <line x1={0} y1={110} x2={320} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <line x1={0} y1={0} x2={0} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
                
                {/* Expected distance curve (sqrt(t)) */}
                {path.length > 1 && (
                  <>
                    {/* Find max distance for scaling */}
                    {(() => {
                      const maxDistance = Math.max(...distances, Math.sqrt(path.length - 1) * 1.2)
                      
                      return (
                        <>
                          {/* Expected curve */}
                          <path
                            d={Array.from({ length: 51 }, (_, i) => {
                              const t = (i / 50) * (path.length - 1)
                              const x = (i / 50) * 320
                              const expectedD = Math.sqrt(t)
                              const y = 110 - (expectedD / maxDistance) * 100
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                            }).join(' ')}
                            fill="none"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="1"
                            strokeDasharray="4,2"
                            opacity="0.5"
                          />
                          
                          {/* Actual distance curve */}
                          <path
                            d={(() => {
                              // Sample points if too many
                              const step = path.length > 1000 ? Math.ceil(path.length / 500) : 1
                              const points = []
                              
                              for (let i = 0; i < distances.length; i += step) {
                                const x = (i / (path.length - 1)) * 320
                                const y = 110 - (distances[i] / maxDistance) * 100
                                points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`)
                              }
                              
                              // Always include the last point
                              if ((distances.length - 1) % step !== 0) {
                                const lastIdx = distances.length - 1
                                const x = 320
                                const y = 110 - (distances[lastIdx] / maxDistance) * 100
                                points.push(`L ${x} ${y}`)
                              }
                              
                              return points.join(' ')
                            })()}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                          />
                        </>
                      )
                    })()}
                  </>
                )}
                
                {/* Labels */}
                <text x={0} y={-5} fontSize="10" fill="currentColor" opacity="0.7">Distance</text>
                <text x={320} y={125} fontSize="10" fill="currentColor" opacity="0.7" textAnchor="end">Steps</text>
                
                {/* Legend */}
                <g transform="translate(240, 5)">
                  <line x1={0} y1={0} x2={15} y2={0} stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <text x={20} y={3} fontSize="9" fill="currentColor" opacity="0.7">Actual</text>
                  <line x1={0} y1={12} x2={15} y2={12} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
                  <text x={20} y={15} fontSize="9" fill="currentColor" opacity="0.7">E[r]=√t</text>
                </g>
              </g>
            </svg>
          </div>

          {/* Distribution Plot */}
          <div className="border rounded-lg p-4 bg-background">
            <h3 className="text-sm font-semibold mb-2 -mt-1">Distance Distribution at t={(path.length - 1).toLocaleString()}</h3>
            <svg width={350} height={150} className="w-full" viewBox="0 0 350 150">
              <g transform="translate(25, 20)">
                {/* Axes */}
                <line x1={0} y1={110} x2={320} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <line x1={0} y1={0} x2={0} y2={110} stroke="currentColor" strokeWidth="1" opacity="0.3" />
                
                {/* Distribution curve - Rayleigh distribution */}
                {path.length > 1 && (
                  <>
                    {/* Calculate and plot distribution */}
                    <path
                      d={(() => {
                        const currentSteps = path.length - 1
                        const sigma2 = currentSteps
                        const maxR = Math.sqrt(currentSteps) * 4 // Show up to 4 standard deviations
                        const points = 50
                        
                        let maxProb = 0
                        const curvePoints = []
                        
                        // First pass to find max probability
                        for (let i = 0; i <= points; i++) {
                          const r = (maxR * i) / points
                          const prob = (r / sigma2) * Math.exp(-(r * r) / (2 * sigma2))
                          maxProb = Math.max(maxProb, prob)
                          curvePoints.push({ r, prob })
                        }
                        
                        // Second pass to create path
                        return curvePoints.map((pt, i) => {
                          const x = (pt.r / maxR) * 320
                          const y = 110 - (pt.prob / (maxProb * 1.1)) * 100
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')
                      })()}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                    
                    {/* Current distance indicator */}
                    {(() => {
                      const currentDistance = distance
                      const currentSteps = path.length - 1
                      const maxR = Math.sqrt(currentSteps) * 4
                      const x = Math.min((currentDistance / maxR) * 320, 320)
                      
                      return (
                        <>
                          <line
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={110}
                            stroke="hsl(var(--destructive))"
                            strokeWidth="2"
                          />
                          <text 
                            x={x} 
                            y={-5} 
                            fontSize="9" 
                            fill="hsl(var(--destructive))" 
                            textAnchor="middle"
                          >
                            r={currentDistance.toFixed(1)}
                          </text>
                        </>
                      )
                    })()}
                  </>
                )}
                
                {/* Labels */}
                <text x={0} y={-5} fontSize="10" fill="currentColor" opacity="0.7">P(r)</text>
                <text x={320} y={125} fontSize="10" fill="currentColor" opacity="0.7" textAnchor="end">Distance r</text>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </Card>
    </div>
    </>
  )
}