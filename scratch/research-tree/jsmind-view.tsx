"use client"

import { useEffect, useRef } from "react"
import 'jsmind/style/jsmind.css'

interface ResearchNode {
  id: string
  title: string
  type: 'hypothesis' | 'experiment' | 'result' | 'branch'
  description?: string
  date?: string
  children?: ResearchNode[]
  details?: {
    findings?: string[]
    methods?: string[]
    nextSteps?: string[]
    accuracy?: number
    improvement?: string
  }
}

interface JsMindViewProps {
  researchTree: ResearchNode[]
  selectedNode: ResearchNode | null
  onNodeSelect: (node: ResearchNode) => void
}

// Convert research tree to jsMind format
function convertToJsMindFormat(nodes: ResearchNode[]) {
  const mind = {
    meta: {
      name: "Research Tree",
      author: "Orchestra",
      version: "1.0"
    },
    format: "node_tree",
    data: {
      id: "root",
      topic: "Research",
      children: [] as any[]
    }
  }
  
  const processNode = (node: ResearchNode): any => {
    const jsMindNode: any = {
      id: node.id,
      topic: node.title,
      "background-color": getNodeColor(node.type),
      expanded: true
    }
    
    if (node.children && node.children.length > 0) {
      jsMindNode.children = node.children.map(child => processNode(child))
    }
    
    return jsMindNode
  }
  
  function getNodeColor(type: string): string {
    switch (type) {
      case 'hypothesis': return '#fef3c7'  // yellow
      case 'experiment': return '#dbeafe'  // blue
      case 'result': return '#d1fae5'      // green
      default: return '#ede9fe'             // purple
    }
  }
  
  mind.data.children = nodes.map(node => processNode(node))
  
  return mind
}

export function JsMindView({ researchTree, selectedNode, onNodeSelect }: JsMindViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const jmRef = useRef<any>(null)
  const nodeMapRef = useRef<Map<string, ResearchNode>>(new Map())
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Build node map for click handler
    const buildNodeMap = (nodes: ResearchNode[]) => {
      nodes.forEach(node => {
        nodeMapRef.current.set(node.id, node)
        if (node.children) {
          buildNodeMap(node.children)
        }
      })
    }
    buildNodeMap(researchTree)
    
    // Dynamically import jsMind
    import('jsmind').then((jsMindModule) => {
      const jsMind = jsMindModule.default
      
      if (!containerRef.current) return
      
      const options = {
        container: containerRef.current,
        theme: 'primary',
        editable: false,
        mode: 'full',
        support_html: true,
        view: {
          engine: 'canvas',
          hmargin: 100,
          vmargin: 50,
          line_width: 2,
          line_color: '#94a3b8'
        },
        layout: {
          hspace: 30,
          vspace: 20,
          pspace: 13
        },
        shortcut: {
          enable: false
        }
      }
      
      const jm = new jsMind(options)
      const mindData = convertToJsMindFormat(researchTree)
      jm.show(mindData)
      
      // Add click handler for node selection
      jm.add_event_listener((type: string, data: any) => {
        if (type === 'select_node') {
          const node = nodeMapRef.current.get(data.node)
          if (node) {
            onNodeSelect(node)
          }
        }
      })
      
      jmRef.current = jm
    })
    
    return () => {
      // Clean up jsMind instance
      if (jmRef.current && containerRef.current) {
        // jsMind doesn't have a destroy method, so we just clear the container
        containerRef.current.innerHTML = ''
        jmRef.current = null
      }
    }
  }, [researchTree, onNodeSelect])
  
  // Highlight selected node
  useEffect(() => {
    if (jmRef.current && selectedNode) {
      jmRef.current.select_node(selectedNode.id)
    }
  }, [selectedNode])
  
  return (
    <div 
      ref={containerRef} 
      className="h-full w-full"
      style={{ minHeight: '600px' }}
    />
  )
}