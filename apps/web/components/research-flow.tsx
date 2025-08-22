"use client"

import { useEffect, useMemo, useCallback } from "react"
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { 
  CircleHelp, 
  Hand, 
  FlaskConical, 
  Microscope, 
  Hammer, 
  Undo2, 
  Lightbulb, 
  Star, 
  Globe, 
  TrendingUp, 
  Flame, 
  CirclePause 
} from "lucide-react"
import { TfiThought } from "react-icons/tfi"
import { researchTree, type ResearchNode } from "@/lib/research-tree-data"
import { cn } from "@workspace/ui/lib/utils"

interface NodeData {
  label: string
  nodeType: string
  date?: string
  description?: string
}

// Custom node component
function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData
  
  const getNodeColor = () => {
    switch (nodeData.nodeType) {
      case 'question': return 'bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20'
      case 'hypothesis': return 'bg-pink-500/10 border-pink-500/50 hover:bg-pink-500/20'
      case 'experiment': return 'bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20'
      case 'observation': return 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
      case 'thought': return 'bg-yellow-500/10 border-yellow-500/50 hover:bg-yellow-500/20'
      case 'work': return 'bg-orange-500/10 border-orange-500/50 hover:bg-orange-500/20'
      case 'pivot': return 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
      case 'idea': return 'bg-cyan-500/10 border-cyan-500/50 hover:bg-cyan-500/20'
      case 'finding': return 'bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/20'
      case 'literature-review': return 'bg-indigo-500/10 border-indigo-500/50 hover:bg-indigo-500/20'
      case 'analysis': return 'bg-teal-500/10 border-teal-500/50 hover:bg-teal-500/20'
      case 'eureka': return 'bg-rose-500/10 border-rose-500/50 hover:bg-rose-500/20'
      case 'pause': return 'bg-slate-500/10 border-slate-500/50 hover:bg-slate-500/20'
      default: return 'bg-gray-500/10 border-gray-500/50 hover:bg-gray-500/20'
    }
  }

  const getIcon = () => {
    const iconClass = "h-3 w-3"
    switch (nodeData.nodeType) {
      case 'question': return <CircleHelp className={cn(iconClass, "text-purple-500")} />
      case 'hypothesis': return <Hand className={cn(iconClass, "text-pink-500")} />
      case 'experiment': return <FlaskConical className={cn(iconClass, "text-blue-500")} />
      case 'observation': return <Microscope className={cn(iconClass, "text-green-500")} />
      case 'thought': return <TfiThought className={cn(iconClass, "text-yellow-500")} />
      case 'work': return <Hammer className={cn(iconClass, "text-orange-500")} />
      case 'pivot': return <Undo2 className={cn(iconClass, "text-red-500")} />
      case 'idea': return <Lightbulb className={cn(iconClass, "text-cyan-500")} />
      case 'finding': return <Star className={cn(iconClass, "text-amber-500")} />
      case 'literature-review': return <Globe className={cn(iconClass, "text-indigo-500")} />
      case 'analysis': return <TrendingUp className={cn(iconClass, "text-teal-500")} />
      case 'eureka': return <Flame className={cn(iconClass, "text-rose-500")} />
      case 'pause': return <CirclePause className={cn(iconClass, "text-slate-500")} />
      default: return <CircleHelp className={cn(iconClass, "text-gray-500")} />
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null
    
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr
    }
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div className={cn(
      "px-3 py-2 rounded-md border transition-all duration-200 min-w-[180px] max-w-[250px]",
      getNodeColor(),
      selected && "ring-2 ring-primary ring-offset-1"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" />
      
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="text-xs leading-tight mb-0.5">
            {nodeData.label}
          </div>
          {nodeData.date && (
            <div className="text-[10px] text-muted-foreground">
              {formatDate(nodeData.date)}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function ResearchFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Convert research tree to React Flow nodes and edges
  const convertToFlowElements = useCallback(() => {
    const flowNodes: Node[] = []
    const flowEdges: Edge[] = []
    const nodeMap = new Map<string, ResearchNode>()
    
    // Build connection maps
    const childToParents = new Map<string, string[]>()
    const parentToChildren = new Map<string, string[]>()
    
    // First pass: create node map and build connection structure
    researchTree.forEach(node => {
      nodeMap.set(node.id, node)
      if (node.connections) {
        parentToChildren.set(node.id, node.connections)
        node.connections.forEach(childId => {
          if (!childToParents.has(childId)) {
            childToParents.set(childId, [])
          }
          childToParents.get(childId)!.push(node.id)
        })
      }
    })
    
    // Calculate levels (rows) using topological sort
    const levels = new Map<string, number>()
    const visited = new Set<string>()
    
    function calculateLevel(nodeId: string): number {
      if (visited.has(nodeId)) return levels.get(nodeId) || 0
      visited.add(nodeId)
      
      const parents = childToParents.get(nodeId) || []
      if (parents.length === 0) {
        // Root node - level 0
        levels.set(nodeId, 0)
        return 0
      }
      
      // Level is max parent level + 1
      const maxParentLevel = Math.max(...parents.map(p => calculateLevel(p)))
      const level = maxParentLevel + 1
      levels.set(nodeId, level)
      return level
    }
    
    // Calculate level for all nodes
    researchTree.forEach(node => calculateLevel(node.id))
    
    // Group nodes by level for horizontal positioning
    const nodesByLevel = new Map<number, ResearchNode[]>()
    researchTree.forEach(node => {
      const level = levels.get(node.id) || 0
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, [])
      }
      nodesByLevel.get(level)!.push(node)
    })
    
    // Calculate horizontal positions using a more sophisticated algorithm
    const horizontalPositions = new Map<string, number>()
    
    // First, assign initial positions based on parent-child relationships
    const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b)
    
    sortedLevels.forEach(level => {
      const nodes = nodesByLevel.get(level)!
      
      if (level === 0) {
        // Root nodes - center them
        nodes.forEach((node, index) => {
          horizontalPositions.set(node.id, index - (nodes.length - 1) / 2)
        })
      } else {
        // For non-root nodes, position based on parents
        const nodePositions: Array<{node: ResearchNode, desiredPos: number, priority: number}> = []
        
        nodes.forEach(node => {
          const parents = childToParents.get(node.id) || []
          if (parents.length > 0) {
            // Calculate desired position as average of parent positions
            const avgParentPos = parents.reduce((sum, pid) => 
              sum + (horizontalPositions.get(pid) || 0), 0) / parents.length
            
            // Priority based on number of connections (more connections = higher priority)
            const priority = parents.length + (parentToChildren.get(node.id)?.length || 0)
            
            nodePositions.push({node, desiredPos: avgParentPos, priority})
          } else {
            nodePositions.push({node, desiredPos: 0, priority: 0})
          }
        })
        
        // Sort by desired position, then priority
        nodePositions.sort((a, b) => {
          const posDiff = a.desiredPos - b.desiredPos
          if (Math.abs(posDiff) > 0.01) return posDiff
          return b.priority - a.priority
        })
        
        // Assign positions with minimum separation to avoid overlaps
        const minSeparation = 1.0
        const positions: number[] = []
        
        nodePositions.forEach((item, index) => {
          let pos = item.desiredPos
          
          // Check for conflicts with already placed nodes
          for (let i = 0; i < positions.length; i++) {
            if (Math.abs(positions[i] - pos) < minSeparation) {
              // Conflict detected, shift position
              if (pos < positions[i]) {
                pos = positions[i] - minSeparation
              } else {
                pos = positions[i] + minSeparation
              }
            }
          }
          
          // Make sure we don't overlap with any already assigned position
          let finalPos = pos
          let attempts = 0
          while (attempts < 20 && positions.some(p => Math.abs(p - finalPos) < minSeparation)) {
            finalPos += minSeparation * 0.5
            attempts++
          }
          
          positions.push(finalPos)
          horizontalPositions.set(item.node.id, finalPos)
        })
      }
    })
    
    // Normalize positions to center the graph
    const allPositions = Array.from(horizontalPositions.values())
    const minPos = Math.min(...allPositions)
    const maxPos = Math.max(...allPositions)
    const center = (minPos + maxPos) / 2
    
    horizontalPositions.forEach((pos, id) => {
      horizontalPositions.set(id, pos - center)
    })

    // Create nodes with calculated positions
    researchTree.forEach(node => {
      const row = levels.get(node.id) || 0
      const hPos = horizontalPositions.get(node.id) || 0
      
      const x = hPos * 300 // Increased horizontal spacing to avoid S-curves
      const y = row * 120 // Vertical spacing between levels

      flowNodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          label: node.title,
          nodeType: node.type,
          date: node.date,
          description: node.description,
        },
      })

      // Create edges from connections
      if (node.connections) {
        node.connections.forEach(targetId => {
          flowEdges.push({
            id: `${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: '#64748b',
              strokeWidth: 2,
            },
          })
        })
      }
    })

    return { nodes: flowNodes, edges: flowEdges }
  }, [])

  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = convertToFlowElements()
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [convertToFlowElements, setNodes, setEdges])

  return (
    <div className="w-full h-[800px] border rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
        }}
        defaultViewport={{ x: 400, y: 0, zoom: 0.6 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="!bg-background !border !border-border [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
      </ReactFlow>
    </div>
  )
}