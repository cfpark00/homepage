const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('./research-tree-vertical.json', 'utf8'));

// Build connection maps
const connections = new Map();
const reverseConnections = new Map();
const nodeMap = new Map();

data.researchTree.forEach(node => {
  nodeMap.set(node.id, node);
  if (node.connections) {
    connections.set(node.id, node.connections);
    node.connections.forEach(childId => {
      if (!reverseConnections.has(childId)) {
        reverseConnections.set(childId, []);
      }
      reverseConnections.get(childId).push(node.id);
    });
  }
});

// Calculate depth levels (topological sort)
function calculateLevels() {
  const levels = new Map();
  const visited = new Set();
  
  // Find root nodes (nodes with no parents)
  const rootNodes = [];
  data.researchTree.forEach(node => {
    if (!reverseConnections.has(node.id) || reverseConnections.get(node.id).length === 0) {
      rootNodes.push(node.id);
    }
  });
  
  console.log(`Found ${rootNodes.length} root nodes`);
  
  function getLevel(nodeId) {
    if (visited.has(nodeId)) return levels.get(nodeId) || 0;
    visited.add(nodeId);
    
    const parents = reverseConnections.get(nodeId) || [];
    if (parents.length === 0) {
      levels.set(nodeId, 0);
      return 0;
    }
    
    const maxParentLevel = Math.max(...parents.map(p => getLevel(p)));
    const level = maxParentLevel + 1;
    levels.set(nodeId, level);
    return level;
  }
  
  data.researchTree.forEach(node => getLevel(node.id));
  return levels;
}

// Group nodes by level
function groupByLevel(levels) {
  const levelGroups = new Map();
  
  data.researchTree.forEach(node => {
    const level = levels.get(node.id);
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level).push(node);
  });
  
  return levelGroups;
}

// Assign horizontal positions within each level to minimize crossings
function assignHorizontalPositions(levelGroups, levels) {
  const positions = new Map();
  
  // Process each level
  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);
  
  sortedLevels.forEach(level => {
    const nodes = levelGroups.get(level);
    
    // Sort nodes by their parent positions (if they have parents)
    nodes.sort((a, b) => {
      const parentsA = reverseConnections.get(a.id) || [];
      const parentsB = reverseConnections.get(b.id) || [];
      
      if (parentsA.length === 0 && parentsB.length === 0) {
        // For root nodes, just use their original order
        return 0;
      }
      
      // Calculate average parent position
      const avgPosA = parentsA.length > 0 
        ? parentsA.reduce((sum, pid) => sum + (positions.get(pid) || 0), 0) / parentsA.length
        : 0;
      const avgPosB = parentsB.length > 0
        ? parentsB.reduce((sum, pid) => sum + (positions.get(pid) || 0), 0) / parentsB.length
        : 0;
      
      return avgPosA - avgPosB;
    });
    
    // Assign positions with proper spacing
    nodes.forEach((node, index) => {
      positions.set(node.id, index);
    });
  });
  
  return positions;
}

// Calculate the layout
const levels = calculateLevels();
const levelGroups = groupByLevel(levels);
const horizontalPositions = assignHorizontalPositions(levelGroups, levels);

// Find the max width needed
const maxNodesInLevel = Math.max(...Array.from(levelGroups.values()).map(g => g.length));

// Update node positions
data.researchTree.forEach(node => {
  const level = levels.get(node.id);
  const hPos = horizontalPositions.get(node.id);
  const nodesAtLevel = levelGroups.get(level).length;
  
  // Calculate row (vertical position)
  // Use tighter spacing, level directly maps to row
  node.gridPosition.row = level;
  
  // Calculate column (horizontal position)
  // Spread nodes more evenly across available width
  if (nodesAtLevel === 1) {
    // Center single nodes
    node.gridPosition.col = 7;
  } else if (nodesAtLevel === 2) {
    // Place two nodes with good spacing
    node.gridPosition.col = 5 + (hPos * 4);
  } else if (nodesAtLevel === 3) {
    // Three nodes spread evenly
    node.gridPosition.col = 3 + (hPos * 4);
  } else {
    // Multiple nodes - spread across full width
    const spacing = 14 / (nodesAtLevel + 1);
    node.gridPosition.col = spacing * (hPos + 1);
  }
});

// Skip additional adjustments to prevent overlap

// Write back the modified JSON
fs.writeFileSync('./research-tree-vertical.json', JSON.stringify(data, null, 2));

console.log('Successfully reorganized layout!');
console.log(`Processed ${data.researchTree.length} nodes in ${levels.size} levels`);
console.log(`Max nodes in a level: ${maxNodesInLevel}`);