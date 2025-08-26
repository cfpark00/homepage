'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { Play, Pause, RotateCcw, Users, Brain, Activity } from 'lucide-react'
import { Slider } from '@workspace/ui/components/slider'
import { Label } from '@workspace/ui/components/label'

interface Agent {
  id: number
  X: number[][] // Cognitive map C x D
  color: string
  position: { x: number; y: number }
  gridPos: { row: number; col: number }
}

interface SimulationParams {
  numAgents: number
  dimensions: number // D
  concepts: number // C
  selfDrift: 'none' | 'echo' | 'guidance'
  driftStrength: number
  interactionStrength: number
}

export default function CognitiveDynamics() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [params, setParams] = useState<SimulationParams>({
    numAgents: 100,
    dimensions: 3,
    concepts: 2,
    selfDrift: 'none',
    driftStrength: 0.02,
    interactionStrength: 0.05
  })
  const [metrics, setMetrics] = useState({
    mutualIntelligibility: 1,
    nematicOrder: 0,
    averageRank: 2,
    domainWalls: 0
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const guidanceMap = useRef<number[][]>([])

  // Initialize agents
  const initializeAgents = () => {
    const newAgents: Agent[] = []
    const gridSize = Math.ceil(Math.sqrt(params.numAgents))
    const cellSpacing = 300 / gridSize  // Canvas is 400px, leave margin
    const startOffset = 50  // Start position offset
    
    // Create a guidance map for guided dynamics
    guidanceMap.current = Array(params.concepts).fill(null).map(() =>
      Array(params.dimensions).fill(0).map(() => Math.random() * 0.5)
    )
    
    // Normalize guidance map to Frobenius norm = 1
    let guidanceFrobNorm = 0
    for (let c = 0; c < params.concepts; c++) {
      for (let d = 0; d < params.dimensions; d++) {
        guidanceFrobNorm += guidanceMap.current[c][d] * guidanceMap.current[c][d]
      }
    }
    guidanceFrobNorm = Math.sqrt(guidanceFrobNorm)
    if (guidanceFrobNorm > 0) {
      for (let c = 0; c < params.concepts; c++) {
        for (let d = 0; d < params.dimensions; d++) {
          guidanceMap.current[c][d] /= guidanceFrobNorm
        }
      }
    }
    
    for (let i = 0; i < params.numAgents; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize
      const hue = (i * 360) / params.numAgents
      
      // Initialize cognitive map with some structure + noise
      const X: number[][] = []
      for (let c = 0; c < params.concepts; c++) {
        const rowData: number[] = []
        for (let d = 0; d < params.dimensions; d++) {
          // Add some initial structure based on position in grid
          // Create regions of similar thinking
          const regionBias = (row < gridSize / 2) ? 1 : -1
          const columnBias = (col < gridSize / 2) ? 0.5 : -0.5
          rowData.push((regionBias + columnBias) * (c === 0 ? 1 : 0.5) * Math.random() + Math.random() * 0.3)
        }
        X.push(rowData)
      }
      
      // Normalize initial cognitive map to Frobenius norm = 1
      let initFrobNorm = 0
      for (let c = 0; c < params.concepts; c++) {
        for (let d = 0; d < params.dimensions; d++) {
          initFrobNorm += X[c][d] * X[c][d]
        }
      }
      initFrobNorm = Math.sqrt(initFrobNorm)
      if (initFrobNorm > 0) {
        for (let c = 0; c < params.concepts; c++) {
          for (let d = 0; d < params.dimensions; d++) {
            X[c][d] /= initFrobNorm
          }
        }
      }
      
      newAgents.push({
        id: i,
        X,
        color: `hsl(${hue}, 70%, 50%)`,
        position: {
          x: startOffset + col * cellSpacing,
          y: startOffset + row * cellSpacing
        },
        gridPos: { row, col }
      })
    }
    
    setAgents(newAgents)
    setTime(0)
    updateMetrics(newAgents)
  }

  // Frobenius inner product
  const frobeniusProduct = (X1: number[][], X2: number[][]) => {
    let sum = 0
    for (let i = 0; i < X1.length; i++) {
      for (let j = 0; j < X1[0].length; j++) {
        sum += X1[i][j] * X2[i][j]
      }
    }
    return sum
  }

  // Calculate stable rank
  const stableRank = (X: number[][]) => {
    let frobNormSq = 0
    let spectralNormSq = 0
    
    for (let i = 0; i < X.length; i++) {
      let rowNorm = 0
      for (let j = 0; j < X[0].length; j++) {
        frobNormSq += X[i][j] * X[i][j]
        rowNorm += X[i][j] * X[i][j]
      }
      spectralNormSq = Math.max(spectralNormSq, rowNorm)
    }
    
    return spectralNormSq > 0 ? frobNormSq / spectralNormSq : 0
  }

  // Update metrics
  const updateMetrics = (currentAgents: Agent[]) => {
    const n = currentAgents.length
    if (n === 0) return
    
    // Mutual intelligibility
    let totalOverlap = 0
    let pairCount = 0
    let wallCount = 0
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const overlap = Math.abs(frobeniusProduct(currentAgents[i].X, currentAgents[j].X))
        totalOverlap += overlap
        pairCount++
        if (overlap < 0.1) wallCount++
      }
    }
    
    // Average rank
    const avgRank = currentAgents.reduce((sum, agent) => 
      sum + stableRank(agent.X), 0) / n
    
    // Nematic order (alignment along dominant axis)
    let maxAlignment = 0
    for (let c = 0; c < params.concepts; c++) {
      let alignment = 0
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          let dotProduct = 0
          for (let d = 0; d < params.dimensions; d++) {
            dotProduct += currentAgents[i].X[c][d] * currentAgents[j].X[c][d]
          }
          alignment += Math.abs(dotProduct)
        }
      }
      maxAlignment = Math.max(maxAlignment, alignment / pairCount)
    }
    
    setMetrics({
      mutualIntelligibility: pairCount > 0 ? totalOverlap / pairCount : 0,
      nematicOrder: maxAlignment,
      averageRank: avgRank,
      domainWalls: pairCount > 0 ? wallCount / pairCount : 0
    })
  }

  // Get grid neighbors (4-connected: up, down, left, right)
  const getGridNeighbors = (agent: Agent, agents: Agent[]) => {
    const neighbors: Agent[] = []
    const gridSize = Math.ceil(Math.sqrt(agents.length))
    const { row, col } = agent.gridPos
    
    // Check all four directions
    const directions = [
      { dr: -1, dc: 0 }, // up
      { dr: 1, dc: 0 },  // down
      { dr: 0, dc: -1 }, // left
      { dr: 0, dc: 1 }   // right
    ]
    
    for (const { dr, dc } of directions) {
      const newRow = row + dr
      const newCol = col + dc
      
      // Check bounds
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        const neighborIdx = newRow * gridSize + newCol
        if (neighborIdx < agents.length) {
          neighbors.push(agents[neighborIdx])
        }
      }
    }
    
    return neighbors
  }

  // Simulation step
  const simulationStep = () => {
    setAgents(prevAgents => {
      const newAgents = prevAgents.map(agent => ({ ...agent, X: agent.X.map(row => [...row]) }))
      const dt = 0.01
      
      // Update each agent's cognitive map
      for (let i = 0; i < newAgents.length; i++) {
        const agent_i = newAgents[i]
        const dX = agent_i.X.map(row => row.map(() => 0))
        
        // Get grid neighbors (a_ij = 1 for neighbors, 0 otherwise)
        const neighbors = getGridNeighbors(agent_i, newAgents)
        
        // Social influence from grid neighbors only
        for (const agent_j of neighbors) {
          const overlap = frobeniusProduct(agent_i.X, agent_j.X)
          const weight = params.interactionStrength * overlap  // a_ij = 1 for neighbors
          
          // Update: dX += weight * (X_j - X_i)
          for (let c = 0; c < params.concepts; c++) {
            for (let d = 0; d < params.dimensions; d++) {
              dX[c][d] += weight * (agent_j.X[c][d] - agent_i.X[c][d])
            }
          }
        }
        
        // Self-drift term f(X)
        if (params.selfDrift === 'echo') {
          // Echo chamber: f(X) = λX
          for (let c = 0; c < params.concepts; c++) {
            for (let d = 0; d < params.dimensions; d++) {
              dX[c][d] += params.driftStrength * agent_i.X[c][d]
            }
          }
        } else if (params.selfDrift === 'guidance') {
          // Guidance: f(X) = λ(G - X)
          for (let c = 0; c < params.concepts; c++) {
            for (let d = 0; d < params.dimensions; d++) {
              dX[c][d] += params.driftStrength * (guidanceMap.current[c][d] - agent_i.X[c][d])
            }
          }
        }
        
        // Apply update
        for (let c = 0; c < params.concepts; c++) {
          for (let d = 0; d < params.dimensions; d++) {
            agent_i.X[c][d] += dt * dX[c][d]
          }
        }
        
        // Normalize to Frobenius norm = 1
        let frobNorm = 0
        for (let c = 0; c < params.concepts; c++) {
          for (let d = 0; d < params.dimensions; d++) {
            frobNorm += agent_i.X[c][d] * agent_i.X[c][d]
          }
        }
        frobNorm = Math.sqrt(frobNorm)
        
        if (frobNorm > 0) {
          for (let c = 0; c < params.concepts; c++) {
            for (let d = 0; d < params.dimensions; d++) {
              agent_i.X[c][d] /= frobNorm
            }
          }
        }
      }
      
      // Agents stay in grid positions, just update metrics
      updateMetrics(newAgents)
      return newAgents
    })
    
    setTime(prev => prev + 0.01)
  }

  // Draw network visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, 400, 400)
    
    // Draw grid connections showing a_ij * <X_i, X_j>
    // a_ij = 1 for grid neighbors, 0 otherwise
    for (let i = 0; i < agents.length; i++) {
      const neighbors = getGridNeighbors(agents[i], agents)
      
      for (const neighbor of neighbors) {
        // Only draw connections to neighbors with higher index to avoid duplicates
        if (neighbor.id > agents[i].id) {
          const overlap = Math.abs(frobeniusProduct(agents[i].X, neighbor.X))
          
          // Line intensity/width shows a_ij * <X_i, X_j> (influence strength)
          const intensity = Math.min(1, overlap)
          ctx.strokeStyle = `rgba(100, 100, 100, ${intensity * 0.4})` 
          ctx.lineWidth = Math.max(0.5, intensity * 2)
          
          ctx.beginPath()
          ctx.moveTo(agents[i].position.x, agents[i].position.y)
          ctx.lineTo(neighbor.position.x, neighbor.position.y)
          ctx.stroke()
        }
      }
    }
    
    // Draw agents
    agents.forEach(agent => {
      const rank = stableRank(agent.X)
      const size = agents.length > 50 ? 2 + rank * 1.5 : 8 + rank * 4
      
      ctx.fillStyle = agent.color
      ctx.beginPath()
      ctx.arc(agent.position.x, agent.position.y, size, 0, 2 * Math.PI)
      ctx.fill()
      
      if (agents.length <= 50) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Only show labels for small numbers of agents
        if (agents.length <= 20) {
          ctx.fillStyle = '#374151'
          ctx.font = '10px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`${agent.id}`, agent.position.x, agent.position.y - size - 5)
        }
      }
    })
    
  }, [agents])

  // Initialize on mount and when params change
  useEffect(() => {
    initializeAgents()
  }, [params.numAgents, params.dimensions, params.concepts])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(simulationStep, 50)
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
  }, [isRunning, params])

  const reset = () => {
    setIsRunning(false)
    initializeAgents()
  }

  return (
    <div className="w-full space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Network Visualization */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agent Network
            </h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full border rounded bg-gray-50"
              style={{ maxWidth: '400px' }}
            />
            <p className="text-xs text-muted-foreground">
              Nodes: agents | Links: cognitive overlap | Size: complexity
            </p>
          </div>

          {/* Metrics Display */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Society Metrics
            </h3>
            
            <div className="space-y-2 text-sm">
              <div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mutual Intelligibility</span>
                  <span className="font-mono">{metrics.mutualIntelligibility.toFixed(3)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, metrics.mutualIntelligibility * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nematic Order</span>
                  <span className="font-mono">{metrics.nematicOrder.toFixed(3)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, metrics.nematicOrder * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Rank</span>
                  <span className="font-mono">{metrics.averageRank.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (metrics.averageRank / params.concepts) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain Walls</span>
                  <span className="font-mono">{(metrics.domainWalls * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, metrics.domainWalls * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>Time: {time.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="sm"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={reset} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Grid Size</Label>
              <select 
                value={Math.sqrt(params.numAgents)}
                onChange={(e) => {
                  const gridSize = parseInt(e.target.value)
                  setParams(p => ({ ...p, numAgents: gridSize * gridSize }))
                }}
                className="w-full px-2 py-1 text-xs border rounded"
                disabled={isRunning}
              >
                <option value="5">5×5 (25 agents)</option>
                <option value="7">7×7 (49 agents)</option>
                <option value="10">10×10 (100 agents)</option>
                <option value="12">12×12 (144 agents)</option>
                <option value="15">15×15 (225 agents)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Interaction Strength</Label>
              <Slider
                value={[params.interactionStrength]}
                onValueChange={([v]) => setParams(p => ({ ...p, interactionStrength: v }))}
                min={0}
                max={0.5}
                step={0.05}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Self-Drift Mode</Label>
              <select 
                value={params.selfDrift}
                onChange={(e) => setParams(p => ({ ...p, selfDrift: e.target.value as any }))}
                className="w-full px-2 py-1 text-xs border rounded"
              >
                <option value="none">None</option>
                <option value="echo">Echo Chamber</option>
                <option value="guidance">AI Guidance</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Drift Strength</Label>
              <Slider
                value={[params.driftStrength]}
                onValueChange={([v]) => setParams(p => ({ ...p, driftStrength: v }))}
                min={0}
                max={0.1}
                step={0.01}
                className="w-full"
                disabled={params.selfDrift === 'none'}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>What you're seeing:</strong> Each agent has a cognitive map (matrix X) that evolves according to the governing equation. 
          Agents influence each other based on their representational overlap (Frobenius product).
        </p>
        <p>
          <strong>Try experimenting:</strong> Compare "Echo Chamber" vs "AI Guidance" modes. Notice how echo chambers lead to fragmentation 
          while guidance can maintain shared meaning axes.
        </p>
      </div>
    </div>
  )
}