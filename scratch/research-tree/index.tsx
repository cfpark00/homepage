"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TreePine, Search, ChevronRight, ChevronDown, FileText, Lightbulb, FlaskConical, Layers, GitBranch, ArrowRightLeft, Network, Brain, GitCommit, Settings, CircleHelp, Apple, Goal, OctagonPause, Microscope, NotebookText, Hammer, Undo2, Star, Globe, ChartLine, Hand, Flame, CirclePause } from "lucide-react"
import { TfiThought } from "react-icons/tfi"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Button } from "@workspace/ui/components/button"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ReactMindmapView } from "./react-mindmap-view"
import { JsMindView } from "./jsmind-view"
import { GitGraphView } from "./gitgraph-view"
import { SankeyView } from "./sankey-view"
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
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { researchTree, type ResearchNode } from "@/mock-data/research-tree"

// Custom node component for React Flow
function CustomNode({ data, selected }: NodeProps) {
  const isHorizontal = data.isHorizontal || false
  
  const getNodeColor = () => {
    switch (data.nodeType) {
      case 'question': return 'bg-purple-500/10 border-purple-500/50'
      case 'hypothesis': return 'bg-pink-500/10 border-pink-500/50'
      case 'experiment': return 'bg-blue-500/10 border-blue-500/50'
      case 'observation': return 'bg-green-500/10 border-green-500/50'
      case 'thought': return 'bg-yellow-500/10 border-yellow-500/50'
      case 'work': return 'bg-orange-500/10 border-orange-500/50'
      case 'pivot': return 'bg-red-500/10 border-red-500/50'
      case 'idea': return 'bg-cyan-500/10 border-cyan-500/50'
      case 'finding': return 'bg-amber-500/10 border-amber-500/50'
      case 'literature-review': return 'bg-indigo-500/10 border-indigo-500/50'
      case 'analysis': return 'bg-teal-500/10 border-teal-500/50'
      case 'eureka': return 'bg-rose-500/10 border-rose-500/50'
      case 'pause': return 'bg-slate-500/10 border-slate-500/50'
      default: return 'bg-gray-500/10 border-gray-500/50'
    }
  }

  const getIcon = () => {
    switch (data.nodeType) {
      case 'question': return <CircleHelp className="h-8 w-8 text-purple-500" />
      case 'hypothesis': return <Hand className="h-8 w-8 text-pink-500" />
      case 'experiment': return <FlaskConical className="h-8 w-8 text-blue-500" />
      case 'observation': return <Microscope className="h-8 w-8 text-green-500" />
      case 'thought': return <TfiThought className="h-8 w-8 text-yellow-500" />
      case 'work': return <Hammer className="h-8 w-8 text-orange-500" />
      case 'pivot': return <Undo2 className="h-8 w-8 text-red-500" />
      case 'idea': return <Lightbulb className="h-8 w-8 text-cyan-500" />
      case 'finding': return <Star className="h-8 w-8 text-amber-500" />
      case 'literature-review': return <Globe className="h-8 w-8 text-indigo-500" />
      case 'analysis': return <ChartLine className="h-8 w-8 text-teal-500" />
      case 'eureka': return <Flame className="h-8 w-8 text-rose-500" />
      case 'pause': return <CirclePause className="h-8 w-8 text-slate-500" />
      default: return <CircleHelp className="h-8 w-8 text-gray-500" />
    }
  }
  
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null
    
    // Check if it's already a relative date string from mock data
    if (dateStr.includes('ago') || dateStr === 'today' || dateStr === 'yesterday') {
      return dateStr
    }
    
    // Try to parse as a date
    const date = new Date(dateStr)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateStr // Return original string if can't parse
    }
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "today"
    if (diffDays === 1) return "yesterday"
    if (diffDays >= 2 && diffDays <= 10) return `${diffDays} days ago`
    
    // Return formatted date for older items
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isHorizontal) {
    return (
      <>
        <Handle type="target" position={Position.Left} className="!bg-primary opacity-0" />
        <div className="relative group">
          {/* Icon positioned on top-left corner */}
          <div className="absolute -top-4 -left-4 z-10 bg-background rounded-full p-0.5">
            {getIcon()}
          </div>
          <div className={cn(
            "w-[240px] h-[120px] p-3 rounded-lg border-2 transition-all flex flex-col relative",
            getNodeColor(),
            selected && "ring-2 ring-primary ring-offset-2"
          )}>
            <div 
              className={cn(
                "flex-1 overflow-y-auto nowheel",
                "[&::-webkit-scrollbar]:hidden hover:[&::-webkit-scrollbar]:block",
                "[&::-webkit-scrollbar]:w-0.5",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-gray-600/30 [&::-webkit-scrollbar-thumb]:rounded-full"
              )}
              style={{ 
                overflowY: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              <span className="font-medium text-sm">{String(data.label || '')}</span>
            </div>
            {/* Date and ID appear on hover */}
            <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <p className="text-xs text-muted-foreground bg-background border px-2 py-1 rounded shadow-sm whitespace-nowrap">
                ID: {(data as any).node?.id || 'unknown'} {data.date ? `• ${formatDate(String(data.date))}` : ''}
              </p>
            </div>
            {data.accuracy ? (
              <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <p className="text-xs text-muted-foreground bg-background border px-2 py-1 rounded shadow-sm">
                  {String(data.accuracy)}%
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-primary opacity-0" />
      </>
    )
  }

  // Original dynamic sizing for other views
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-primary" 
      />
      <div className="relative group">
        {/* Icon positioned on top-left corner */}
        <div className="absolute -top-4 -left-4 z-10 bg-background rounded-full p-0.5">
          {getIcon()}
        </div>
        <div className={cn(
          "p-3 rounded-lg border-2 min-w-[200px] max-w-[300px] h-[120px] transition-all relative flex items-start",
          getNodeColor(),
          selected && "ring-2 ring-primary ring-offset-2"
        )}>
          <div 
            className={cn(
              "w-full overflow-y-auto nowheel",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
            )}
            style={{ maxHeight: '96px' }}
          >
            <span className="font-medium text-sm text-left block">{String(data.label || '')}</span>
          </div>
          {/* Date and ID appear on hover */}
          <div className="absolute -bottom-7 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
            <p className="text-xs text-muted-foreground bg-background border px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
              ID: {(data as any).node?.id || 'unknown'} {data.date ? `• ${formatDate(String(data.date))}` : ''}
            </p>
          </div>
          {data.accuracy ? (
            <div className="absolute -top-7 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <p className="text-xs text-muted-foreground bg-background border px-2 py-0.5 rounded shadow-sm">
                {String(data.accuracy)}%
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-primary" 
      />
    </>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

// React Flow content with spacebar handler
function ReactFlowContent(props: any) {
  const { fitView } = useReactFlow()
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if spacebar was pressed and no input is focused
      if (event.code === 'Space' && 
          !(event.target instanceof HTMLInputElement) && 
          !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault()
        fitView({ padding: 0.1, duration: 200 })
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [fitView])
  
  return null
}

// React Flow wrapper with spacebar for fit view
function ReactFlowWithSpacebar(props: any) {
  return (
    <ReactFlow {...props}>
      <ReactFlowContent />
      {props.children}
    </ReactFlow>
  )
}

function ResearchNodeComponent({ 
  node, 
  level = 0, 
  onSelect,
  selectedId,
  searchQuery 
}: { 
  node: ResearchNode
  level?: number
  onSelect: (node: ResearchNode) => void
  selectedId: string | null
  searchQuery: string
}) {
  const [expanded, setExpanded] = useState(true)
  
  const matchesSearch = !searchQuery || 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description?.toLowerCase().includes(searchQuery.toLowerCase())

  if (!matchesSearch && !node.children?.some(child => 
    child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )) {
    return null
  }

  const getIcon = () => {
    switch (node.type) {
      case 'question': return <CircleHelp className="h-4 w-4 text-purple-500" />
      case 'hypothesis': return <Lightbulb className="h-4 w-4 text-pink-500" />
      case 'experiment': return <FlaskConical className="h-4 w-4 text-blue-500" />
      case 'observation': return <Microscope className="h-4 w-4 text-green-500" />
      case 'thought': return <Brain className="h-4 w-4 text-yellow-500" />
      case 'eureka': return <Flame className="h-4 w-4 text-rose-500" />
      case 'pause': return <CirclePause className="h-4 w-4 text-slate-500" />
      default: return <CircleHelp className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="select-none">
      <button
        onClick={() => {
          if (node.children) setExpanded(!expanded)
          onSelect(node)
        }}
        className={cn(
          "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors",
          selectedId === node.id && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {node.children && (
          <div className="h-4 w-4 flex items-center justify-center">
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </div>
        )}
        {!node.children && <div className="w-4" />}
        {getIcon()}
        <span className="text-sm flex-1">{node.title}</span>
        {node.details?.accuracy && (
          <span className="text-xs text-muted-foreground">{node.details.accuracy}%</span>
        )}
      </button>
      
      {expanded && node.children && (
        <div>
          {node.children.map(child => (
            <ResearchNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ResearchTreeViewContent() {
  const [selectedNode, setSelectedNode] = useState<ResearchNode | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const layout = (searchParams.get('layout') || 'h-graph-2') as 'cascade' | 'graph' | 'h-graph' | 'h-graph-2' | 'react-mindmap' | 'jsmind' | 'gitgraph' | 'sankey'
  
  const handleLayoutChange = (newLayout: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('layout', newLayout)
    router.push(`${pathname}?${params.toString()}`)
  }
  
  
  const { flowNodes, flowEdges, hFlowNodes, hFlowEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let yOffset = 0
    
    const processNode = (node: ResearchNode, parentId?: string, xOffset = 0, depth = 0) => {
      const nodeWidth = 250
      const horizontalSpacing = 300
      const verticalSpacing = 120
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { 
          x: xOffset * horizontalSpacing, 
          y: depth * verticalSpacing 
        },
        data: { 
          label: node.title,
          nodeType: node.type,
          accuracy: node.details?.accuracy,
          date: node.date,
          node: node
        }
      })
      
      if (parentId) {
        edges.push({
          id: `${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          animated: false,
          style: { 
            stroke: '#6b7280',
            strokeWidth: 2
          }
        })
      }
      
      if (node.children) {
        const childCount = node.children.length
        const startOffset = -(childCount - 1) / 2
        
        node.children.forEach((child, index) => {
          processNode(child, node.id, xOffset + startOffset + index, depth + 1)
        })
      }
    }
    
    researchTree.forEach((rootNode, index) => {
      processNode(rootNode, undefined, index * 4, 0)
    })
    
    const hNodes: Node[] = []
    const hEdges: Edge[] = []
    
    // Create a map of all nodes for easy lookup
    const nodeMap = new Map<string, ResearchNode>()
    researchTree.forEach(node => {
      nodeMap.set(node.id, node)
    })
    
    // Create nodes using gridPosition from JSON
    const gridCellWidth = 280
    const gridCellHeight = 160
    
    researchTree.forEach(node => {
      if (node.gridPosition) {
        const x = node.gridPosition.col * gridCellWidth
        const y = node.gridPosition.row * gridCellHeight
        
        hNodes.push({
          id: node.id,
          type: 'custom',
          position: { x, y },
          data: { 
            label: node.title,
            nodeType: node.type,
            accuracy: node.details?.accuracy,
            date: node.date,
            node: node,
            isHorizontal: true
          }
        })
      }
    })
    
    // Create edges based on connections field
    researchTree.forEach(node => {
      if (node.connections && node.connections.length > 0) {
        node.connections.forEach(targetId => {
          // Create edge from this node to each connected node
          hEdges.push({
            id: `${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            animated: false,
            style: { 
              stroke: '#6b7280',
              strokeWidth: 2
            }
          })
        })
      }
    })
    
    return { 
      flowNodes: nodes, 
      flowEdges: edges, 
      hFlowNodes: hNodes, 
      hFlowEdges: hEdges
    }
  }, [])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(layout === 'h-graph-2' || layout === 'h-graph' ? hFlowNodes : flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layout === 'h-graph-2' || layout === 'h-graph' ? hFlowEdges : flowEdges)
  
  // Update nodes and edges when layout changes
  useEffect(() => {
    if (layout === 'h-graph' || layout === 'h-graph-2') {
      setNodes(hFlowNodes)
      setEdges(hFlowEdges)
    } else if (layout === 'graph') {
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [layout, flowNodes, flowEdges, hFlowNodes, hFlowEdges, setNodes, setEdges])
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if ((node.data as any).node) {
      setSelectedNode((node.data as any).node as ResearchNode)
    }
  }, [])
  
  // React Mindmap view
  if (layout === 'react-mindmap') {
    return (
      <div className="h-full relative">
        <ReactMindmapView 
          researchTree={researchTree as any}
          selectedNode={selectedNode as any}
          onNodeSelect={setSelectedNode as any}
        />
      </div>
    )
  }
  
  // JsMind view
  if (layout === 'jsmind') {
    return (
      <div className="h-full relative">
        <JsMindView 
          researchTree={researchTree as any}
          selectedNode={selectedNode as any}
          onNodeSelect={setSelectedNode as any}
        />
      </div>
    )
  }
  // GitGraph view
  if (layout === 'gitgraph') {
    return (
      <div className="h-full">
        <GitGraphView 
          researchTree={researchTree as any}
          selectedNode={selectedNode as any}
          onNodeSelect={setSelectedNode as any}
        />
      </div>
    )
  }

  // Sankey view
  if (layout === 'sankey') {
    return (
      <div className="h-full">
        <SankeyView 
          researchTree={researchTree as any}
          selectedNode={selectedNode as any}
          onNodeSelect={setSelectedNode as any}
        />
      </div>
    )
  }
  
  if (layout === 'graph' || layout === 'h-graph-2' || layout === 'h-graph') {
    const isHorizontal = layout === 'h-graph-2' || layout === 'h-graph'
    
    // For H-Graph 2, use full viewport
    if (layout === 'h-graph') {
      return (
        <div className="h-full relative">
          {/* Export positions button - commented out */}
          {/* <Button
            onClick={() => {
              const positions: Record<string, { row: number, col: number }> = {}
              nodes.forEach(node => {
                const col = Math.round(node.position.x / 280)
                const row = Math.round(node.position.y / 160)
                positions[node.id] = { row, col }
              })
            }}
            size="sm"
            variant="outline"
            className="absolute top-4 right-4 z-10"
          >
            Export Positions
          </Button> */}
          <ReactFlowWithSpacebar
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[280, 160]}
            className="bg-background"
            minZoom={0.1}
            maxZoom={4}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            preventScrolling={true}
          />
        </div>
      )
    }
    
    // For H-Graph 2 view, split screen with info on top
    if (isHorizontal) {
      return (
        <div className="h-full flex flex-col">
          {/* Top 35% - Selected node info */}
          <div className="h-[35%] border-b bg-card overflow-y-auto">
            {selectedNode ? (
              <div className="p-6">
                <div className="max-w-6xl mx-auto">
                  {/* Compact header */}
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      switch (selectedNode.type) {
                        case 'question': return <CircleHelp className="h-5 w-5 text-purple-500" />
                        case 'hypothesis': return <Lightbulb className="h-5 w-5 text-pink-500" />
                        case 'experiment': return <FlaskConical className="h-5 w-5 text-blue-500" />
                        case 'observation': return <Microscope className="h-5 w-5 text-green-500" />
                        case 'thought': return <Brain className="h-5 w-5 text-yellow-500" />
                        case 'eureka': return <Flame className="h-5 w-5 text-rose-500" />
                        case 'pause': return <CirclePause className="h-5 w-5 text-slate-500" />
                        default: return <CircleHelp className="h-5 w-5 text-muted-foreground" />
                      }
                    })()}
                    <h2 className="text-xl font-bold">{selectedNode.title}</h2>
                    {selectedNode.date && (
                      <span className="text-sm text-muted-foreground ml-auto">
                        {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} • {selectedNode.date}
                      </span>
                    )}
                  </div>

                  {/* Compact content in grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedNode.description && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Description</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">{selectedNode.description}</p>
                      </div>
                    )}

                    {selectedNode.details?.accuracy && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Performance</h3>
                        <div className="flex items-baseline gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Accuracy</p>
                            <p className="text-lg font-bold">{selectedNode.details.accuracy}%</p>
                          </div>
                          {selectedNode.details.improvement && (
                            <div>
                              <p className="text-xs text-muted-foreground">Change</p>
                              <p className={cn(
                                "text-lg font-bold",
                                selectedNode.details.improvement.startsWith('+') ? "text-green-500" : "text-red-500"
                              )}>
                                {selectedNode.details.improvement}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedNode.details?.methods && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Methods</h3>
                        <div className="space-y-1">
                          {selectedNode.details.methods.slice(0, 2).map((method, i) => (
                            <p key={i} className="text-xs">• {method}</p>
                          ))}
                          {selectedNode.details.methods.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{selectedNode.details.methods.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedNode.details?.findings && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Key Findings</h3>
                        <div className="space-y-1">
                          {selectedNode.details.findings.slice(0, 2).map((finding, i) => (
                            <p key={i} className="text-xs">• {finding}</p>
                          ))}
                          {selectedNode.details.findings.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{selectedNode.details.findings.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedNode.details?.nextSteps && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Next Steps</h3>
                        <div className="space-y-1">
                          {selectedNode.details.nextSteps.slice(0, 2).map((step, i) => (
                            <p key={i} className="text-xs">• {step}</p>
                          ))}
                          {selectedNode.details.nextSteps.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{selectedNode.details.nextSteps.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedNode.children && selectedNode.children.length > 0 && (
                      <div className="bg-background border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-2">Sub-branches ({selectedNode.children.length})</h3>
                        <div className="space-y-1">
                          {selectedNode.children.slice(0, 3).map(child => (
                            <button
                              key={child.id}
                              onClick={() => setSelectedNode(child)}
                              className="w-full text-left flex items-center gap-1 text-xs hover:text-primary transition-colors"
                            >
                              <ChevronRight className="h-3 w-3" />
                              <span className="truncate">{child.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-semibold">Select a research node</p>
                  <p className="text-xs text-muted-foreground">Click on a node in the graph below</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom 65% - React Flow graph */}
          <div className="h-[65%] relative">
            {/* Export positions button - commented out */}
            {/* <Button
              onClick={() => {
                const positions: Record<string, { row: number, col: number }> = {}
                nodes.forEach(node => {
                  const col = Math.round(node.position.x / 280)
                  const row = Math.round(node.position.y / 160)
                  positions[node.id] = { row, col }
                })
              }}
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 z-10"
            >
              Export Positions
            </Button> */}
            <ReactFlowWithSpacebar
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[280, 160]}
              className="bg-background"
              minZoom={0.1}
              maxZoom={4}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
              preventScrolling={true}
            >
              <Controls />
            </ReactFlowWithSpacebar>
          </div>
        </div>
      )
    }
    
    // Regular graph view (vertical) - keep as is
    return (
      <div className="h-full relative">
        <ReactFlowWithSpacebar
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          minZoom={0.1}
          maxZoom={4}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          preventScrolling={true}
        >
          <Background 
            variant={BackgroundVariant.Dots}
            gap={16}
          />
          <Controls />
        </ReactFlowWithSpacebar>
      </div>
    )
  }

  // Default cascade view (formerly tree view)
  return (
    <div className="h-full flex">
      {/* Left sidebar with cascade tree */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Research Tree</h2>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search research nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {researchTree.map(node => (
              <ResearchNodeComponent
                key={node.id}
                node={node}
                onSelect={setSelectedNode}
                selectedId={selectedNode?.id || null}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right side - Research node details */}
      <div className="flex-1 flex flex-col">
        {selectedNode ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Node header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    switch (selectedNode.type) {
                      case 'question': return <CircleHelp className="h-6 w-6 text-purple-500" />
                      case 'hypothesis': return <Lightbulb className="h-6 w-6 text-pink-500" />
                      case 'experiment': return <FlaskConical className="h-6 w-6 text-blue-500" />
                      case 'observation': return <Microscope className="h-6 w-6 text-green-500" />
                      case 'thought': return <Brain className="h-6 w-6 text-yellow-500" />
                      case 'eureka': return <Flame className="h-6 w-6 text-rose-500" />
                      case 'pause': return <CirclePause className="h-6 w-6 text-slate-500" />
                      default: return <CircleHelp className="h-6 w-6 text-muted-foreground" />
                    }
                  })()}
                  <h1 className="text-2xl font-bold">{selectedNode.title}</h1>
                </div>
                {selectedNode.date && (
                  <p className="text-muted-foreground">
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} • {selectedNode.date}
                  </p>
                )}
              </div>

              {/* Node content */}
              <div className="space-y-6">
                {selectedNode.description && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Description</h2>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
                    </div>
                  </section>
                )}

                {selectedNode.details?.methods && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Methods</h2>
                    <div className="bg-card border rounded-lg p-4 space-y-2">
                      {selectedNode.details.methods.map((method, i) => (
                        <p key={i} className="text-sm">• {method}</p>
                      ))}
                    </div>
                  </section>
                )}

                {selectedNode.details?.findings && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Findings</h2>
                    <div className="bg-card border rounded-lg p-4 space-y-2">
                      {selectedNode.details.findings.map((finding, i) => (
                        <p key={i} className="text-sm">• {finding}</p>
                      ))}
                    </div>
                  </section>
                )}

                {selectedNode.details?.accuracy && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Performance Metrics</h2>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                          <p className="text-2xl font-bold">{selectedNode.details.accuracy}%</p>
                        </div>
                        {selectedNode.details.improvement && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Improvement</p>
                            <p className={cn(
                              "text-2xl font-bold",
                              selectedNode.details.improvement.startsWith('+') ? "text-green-500" : "text-red-500"
                            )}>
                              {selectedNode.details.improvement}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {selectedNode.details?.nextSteps && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Next Steps</h2>
                    <div className="bg-card border rounded-lg p-4 space-y-2">
                      {selectedNode.details.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {selectedNode.children && selectedNode.children.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Sub-branches</h2>
                    <div className="bg-card border rounded-lg p-4 space-y-2">
                      {selectedNode.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => setSelectedNode(child)}
                          className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-accent/50 transition-colors"
                        >
                          {(() => {
                            switch (child.type) {
                              case 'question': return <CircleHelp className="h-4 w-4 text-purple-500" />
                              case 'hypothesis': return <Lightbulb className="h-4 w-4 text-pink-500" />
                              case 'experiment': return <FlaskConical className="h-4 w-4 text-blue-500" />
                              case 'observation': return <Microscope className="h-4 w-4 text-green-500" />
                              case 'thought': return <Brain className="h-4 w-4 text-yellow-500" />
                              case 'eureka': return <Flame className="h-4 w-4 text-rose-500" />
                              case 'pause': return <CirclePause className="h-4 w-4 text-slate-500" />
                              default: return <CircleHelp className="h-4 w-4 text-muted-foreground" />
                            }
                          })()}
                          <span className="text-sm flex-1">{child.title}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a research node</h2>
              <p className="text-muted-foreground">Choose a node from the cascade to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Export ResearchTreeView wrapped with ErrorBoundary
export function ResearchTreeView() {
  return (
    <ErrorBoundary
      componentName="Research Tree"
      isolate
      showToast={false}
    >
      <ResearchTreeViewContent />
    </ErrorBoundary>
  )
}