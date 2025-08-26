"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { Card } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Slider } from '@workspace/ui/components/slider'
import { Label } from '@workspace/ui/components/label'
import { Play, Pause, RotateCcw, Info } from 'lucide-react'

interface Agent {
  x: number
  y: number
  vx: number
  vy: number
  objective: 'base' | 'mesa' | 'instrumental'
  trail: Array<{ x: number; y: number }>
}

interface GoalPoint {
  x: number
  y: number
  value: number
  type: 'base' | 'mesa' | 'instrumental'
}

export default function GoalDirectedVisualization() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [optimizationStrength, setOptimizationStrength] = useState([0.5])
  const [mesaEmergence, setMesaEmergence] = useState([0.3])
  const [noiseLevel, setNoiseLevel] = useState([0.2])
  const [showTrails, setShowTrails] = useState(true)
  const [showGradients, setShowGradients] = useState(false)
  
  // Initialize agents
  const [agents, setAgents] = useState<Agent[]>(() => 
    Array.from({ length: 5 }, (_, i) => ({
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      vx: 0,
      vy: 0,
      objective: i < 3 ? 'base' : i < 4 ? 'mesa' : 'instrumental',
      trail: []
    }))
  )

  // Goal points in the landscape
  const goals: GoalPoint[] = useMemo(() => [
    { x: 400, y: 100, value: 1.0, type: 'base' },
    { x: 150, y: 350, value: 0.8, type: 'mesa' },
    { x: 500, y: 300, value: 0.6, type: 'instrumental' },
    { x: 250, y: 200, value: 0.7, type: 'instrumental' }
  ], [])

  // Calculate utility landscape
  const getUtility = useCallback((x: number, y: number, type: 'base' | 'mesa' | 'instrumental') => {
    let totalUtility = 0
    const mesa = mesaEmergence[0]
    
    goals.forEach(goal => {
      const dist = Math.sqrt((x - goal.x) ** 2 + (y - goal.y) ** 2)
      const utility = goal.value * Math.exp(-dist / 100)
      
      if (type === 'base' && goal.type === 'base') {
        totalUtility += utility
      } else if (type === 'mesa') {
        if (goal.type === 'mesa') {
          totalUtility += utility * (1 + mesa)
        } else if (goal.type === 'base') {
          totalUtility += utility * (1 - mesa * 0.5)
        }
      } else if (type === 'instrumental') {
        if (goal.type === 'instrumental') {
          totalUtility += utility * 1.2
        }
      }
    })
    
    return totalUtility
  }, [goals, mesaEmergence])

  // Calculate gradient
  const getGradient = useCallback((x: number, y: number, type: 'base' | 'mesa' | 'instrumental') => {
    const delta = 1
    const u = getUtility(x, y, type)
    const ux = getUtility(x + delta, y, type)
    const uy = getUtility(x, y + delta, type)
    
    return {
      dx: (ux - u) / delta,
      dy: (uy - u) / delta
    }
  }, [getUtility])

  // Update agent positions
  const updateAgents = useCallback(() => {
    setAgents(prevAgents => prevAgents.map(agent => {
      const gradient = getGradient(agent.x, agent.y, agent.objective)
      const strength = optimizationStrength[0]
      const noise = noiseLevel[0]
      
      // Add optimization force
      let newVx = agent.vx * 0.9 + gradient.dx * strength * 10
      let newVy = agent.vy * 0.9 + gradient.dy * strength * 10
      
      // Add noise
      newVx += (Math.random() - 0.5) * noise * 5
      newVy += (Math.random() - 0.5) * noise * 5
      
      // Limit velocity
      const speed = Math.sqrt(newVx ** 2 + newVy ** 2)
      if (speed > 5) {
        newVx = (newVx / speed) * 5
        newVy = (newVy / speed) * 5
      }
      
      let newX = agent.x + newVx
      let newY = agent.y + newVy
      
      // Boundary conditions
      if (newX < 20 || newX > 580) {
        newVx = -newVx
        newX = Math.max(20, Math.min(580, newX))
      }
      if (newY < 20 || newY > 380) {
        newVy = -newVy
        newY = Math.max(20, Math.min(380, newY))
      }
      
      // Update trail
      const newTrail = [...agent.trail, { x: agent.x, y: agent.y }].slice(-30)
      
      return {
        ...agent,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        trail: newTrail
      }
    }))
    
    setTime(t => t + 1)
  }, [optimizationStrength, noiseLevel, getGradient])

  // Animation loop
  React.useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(updateAgents, 50)
    return () => clearInterval(interval)
  }, [isRunning, updateAgents])

  // Reset simulation
  const reset = () => {
    setIsRunning(false)
    setTime(0)
    setAgents(Array.from({ length: 5 }, (_, i) => ({
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      vx: 0,
      vy: 0,
      objective: i < 3 ? 'base' : i < 4 ? 'mesa' : 'instrumental',
      trail: []
    })))
  }

  // Render gradient field
  const renderGradientField = () => {
    if (!showGradients) return null
    
    const arrows = []
    for (let x = 40; x < 600; x += 40) {
      for (let y = 40; y < 400; y += 40) {
        const gradient = getGradient(x, y, 'base')
        const magnitude = Math.sqrt(gradient.dx ** 2 + gradient.dy ** 2)
        
        if (magnitude > 0.001) {
          const scale = Math.min(magnitude * 100, 15)
          arrows.push(
            <line
              key={`${x}-${y}`}
              x1={x}
              y1={y}
              x2={x + gradient.dx * scale}
              y2={y + gradient.dy * scale}
              stroke="rgba(100, 100, 100, 0.3)"
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          )
        }
      }
    }
    return arrows
  }

  // Render utility landscape heatmap
  const renderHeatmap = () => {
    const resolution = 10
    const cells = []
    
    for (let x = 0; x < 600; x += resolution) {
      for (let y = 0; y < 400; y += resolution) {
        const utility = getUtility(x, y, 'base')
        const intensity = Math.min(utility, 1)
        
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={resolution}
            height={resolution}
            fill={`rgba(59, 130, 246, ${intensity * 0.3})`}
          />
        )
      }
    }
    
    return cells
  }

  return (
    <Card className="p-6 not-prose">
      <div className="space-y-6">
        {/* Visualization */}
        <div className="relative">
          <svg
            width="600"
            height="400"
            className="w-full border border-border rounded-lg bg-background"
            viewBox="0 0 600 400"
            style={{ maxWidth: '600px' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="rgba(100, 100, 100, 0.5)"
                />
              </marker>
            </defs>
            
            {/* Utility landscape heatmap */}
            {renderHeatmap()}
            
            {/* Gradient field */}
            {renderGradientField()}
            
            {/* Goal points */}
            {goals.map((goal, i) => (
              <g key={i}>
                <circle
                  cx={goal.x}
                  cy={goal.y}
                  r={20 + goal.value * 10}
                  fill={
                    goal.type === 'base' ? 'rgba(34, 197, 94, 0.2)' :
                    goal.type === 'mesa' ? 'rgba(234, 179, 8, 0.2)' :
                    'rgba(168, 85, 247, 0.2)'
                  }
                  stroke={
                    goal.type === 'base' ? 'rgb(34, 197, 94)' :
                    goal.type === 'mesa' ? 'rgb(234, 179, 8)' :
                    'rgb(168, 85, 247)'
                  }
                  strokeWidth="2"
                />
                <text
                  x={goal.x}
                  y={goal.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="currentColor"
                  className="font-semibold"
                >
                  {goal.type === 'base' ? 'B' : goal.type === 'mesa' ? 'M' : 'I'}
                </text>
              </g>
            ))}
            
            {/* Agent trails */}
            {showTrails && agents.map((agent, i) => (
              <g key={`trail-${i}`}>
                {agent.trail.map((point, j) => (
                  <circle
                    key={j}
                    cx={point.x}
                    cy={point.y}
                    r="1"
                    fill={
                      agent.objective === 'base' ? 'rgba(34, 197, 94, 0.3)' :
                      agent.objective === 'mesa' ? 'rgba(234, 179, 8, 0.3)' :
                      'rgba(168, 85, 247, 0.3)'
                    }
                  />
                ))}
              </g>
            ))}
            
            {/* Agents */}
            {agents.map((agent, i) => (
              <g key={`agent-${i}`}>
                <circle
                  cx={agent.x}
                  cy={agent.y}
                  r="6"
                  fill={
                    agent.objective === 'base' ? 'rgb(34, 197, 94)' :
                    agent.objective === 'mesa' ? 'rgb(234, 179, 8)' :
                    'rgb(168, 85, 247)'
                  }
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Velocity vector */}
                <line
                  x1={agent.x}
                  y1={agent.y}
                  x2={agent.x + agent.vx * 3}
                  y2={agent.y + agent.vy * 3}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </g>
            ))}
            
            {/* Time counter */}
            <text
              x="10"
              y="20"
              fontSize="12"
              fill="currentColor"
              className="font-mono"
            >
              t = {time}
            </text>
          </svg>
          
          {/* Legend */}
          <div className="absolute top-2 right-2 bg-background/90 p-2 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Base objective</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Mesa-objective</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Instrumental</span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            size="sm"
            variant="outline"
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Pause' : 'Play'}
          </Button>
          <Button
            onClick={reset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <div className="flex gap-4 items-center">
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={showTrails}
                onChange={(e) => setShowTrails(e.target.checked)}
                className="rounded"
              />
              Show trails
            </label>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGradients}
                onChange={(e) => setShowGradients(e.target.checked)}
                className="rounded"
              />
              Show gradients
            </label>
          </div>
        </div>
        
        {/* Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="optimization">
              Optimization Strength: {optimizationStrength[0].toFixed(2)}
            </Label>
            <Slider
              id="optimization"
              min={0}
              max={1}
              step={0.01}
              value={optimizationStrength}
              onValueChange={setOptimizationStrength}
            />
            <p className="text-xs text-muted-foreground">
              How strongly agents pursue their objectives
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mesa">
              Mesa-Objective Emergence: {mesaEmergence[0].toFixed(2)}
            </Label>
            <Slider
              id="mesa"
              min={0}
              max={1}
              step={0.01}
              value={mesaEmergence}
              onValueChange={setMesaEmergence}
            />
            <p className="text-xs text-muted-foreground">
              Likelihood of pursuing emergent objectives
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="noise">
              Environmental Noise: {noiseLevel[0].toFixed(2)}
            </Label>
            <Slider
              id="noise"
              min={0}
              max={1}
              step={0.01}
              value={noiseLevel}
              onValueChange={setNoiseLevel}
            />
            <p className="text-xs text-muted-foreground">
              Random perturbations in agent behavior
            </p>
          </div>
        </div>
        
        {/* Metrics display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">Average Utility</div>
            <div className="text-sm font-semibold">
              {(agents.reduce((sum, agent) => 
                sum + getUtility(agent.x, agent.y, agent.objective), 0
              ) / agents.length).toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Coherence</div>
            <div className="text-sm font-semibold">
              {(1 - noiseLevel[0] * 0.5).toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Convergence</div>
            <div className="text-sm font-semibold">
              {agents.every(a => {
                const nearGoal = goals.some(g => 
                  Math.sqrt((a.x - g.x) ** 2 + (a.y - g.y) ** 2) < 50
                )
                return nearGoal
              }) ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Active Agents</div>
            <div className="text-sm font-semibold">{agents.length}</div>
          </div>
        </div>
        
        {/* Info box */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p>
                This visualization demonstrates how agents with different objective functions navigate
                a multi-goal landscape. Base agents (green) pursue primary objectives, while mesa-agents
                (yellow) may develop alternative goals. Instrumental agents (purple) focus on convergent
                subgoals that emerge across different optimization processes.
              </p>
              <p className="mt-2">
                Adjust the parameters to explore how optimization strength affects convergence speed,
                how mesa-objectives emerge and compete with base objectives, and how noise influences
                the coherence of goal-directed behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}