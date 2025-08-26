# Liquid Crystal Society Interactive Demo Implementation

## Date: 2025-08-24, 16:40

## Summary
Created an interactive visualization for the "Liquid Crystal Society" research paper, implementing the cognitive dynamics equation with a 10×10 grid of agents. Built a custom Slider component and optimized the simulation for 100+ agents with real-time metrics tracking.

## Tasks Completed

### 1. Interactive Demo Component Creation
- Created `/apps/web/content/blog/liquid-crystal-society/cognitive-dynamics.tsx`
- Implemented the main governing equation:
  $$\frac{d\mathbf{X}_i}{dt} = \sum_{j=1}^n a_{i,j} \langle\mathbf{X}_i, \mathbf{X}_j\rangle (\mathbf{X}_j - \mathbf{X}_i) + f(\mathbf{X}_i)$$
- Added Frobenius normalization to keep cognitive maps on unit sphere
- Integrated demo into the MDX blog post

### 2. Grid-Based Agent Network
- Arranged agents in a square grid (5×5 to 15×15 supported)
- Implemented 4-connected grid neighbors (up, down, left, right)
- Set adjacency matrix: $a_{ij} = 1$ for neighbors, 0 otherwise
- Visual connections show influence strength: $a_{ij} \cdot \langle X_i, X_j \rangle$

### 3. Slider Component Development
- Created `/packages/ui/src/components/slider.tsx` using Radix UI primitives
- Fixed styling issues (replaced abstract tokens with concrete Tailwind classes)
- Exported from UI package index
- Integrated sliders for parameter control

### 4. Simulation Features
**Metrics Tracked:**
- Mutual Intelligibility: Average cognitive overlap
- Nematic Order: Alignment along dominant axis
- Average Rank: Cognitive complexity measure
- Domain Walls: Fraction of disconnected pairs

**Self-Drift Modes:**
- None: Pure social dynamics
- Echo Chamber: $f(X) = \lambda X$ (amplifies current beliefs)
- AI Guidance: $f(X) = \lambda(G - X)$ (nudges toward target)

**Controls:**
- Grid size selector (perfect squares only)
- Interaction strength slider
- Self-drift mode dropdown
- Drift strength slider (enabled when drift active)
- Play/pause and reset buttons

### 5. Performance Optimizations
- Sampling random neighbors for large networks
- Limiting visual connections for 50+ agents
- Smaller node sizes at scale
- Removed labels for 20+ agents
- Canvas-based rendering for smooth animation

### 6. Mathematical Implementation Details
- Cognitive maps: $X_i \in \mathbb{R}^{C \times D}$ (2×3 matrices by default)
- World dimension D = 3 (features)
- Opinion dimension C = 2 (judgment axes)
- Frobenius inner product for overlap calculation
- Stable rank computation for complexity metrics
- All matrices normalized to unit Frobenius norm

### 7. Bug Fixes
- Fixed missing Slider component build error
- Removed network density parameter (using fixed grid neighbors)
- Fixed re-initialization when changing agent count
- Ensured drift strength slider only enabled with active drift mode

## Key Design Decisions

1. **Grid Layout**: Chose fixed grid positions over dynamic positioning for clearer visualization of local vs global effects

2. **Normalization**: Added Frobenius normalization at each step to prevent unbounded growth and maintain interpretability

3. **Perfect Squares Only**: Restricted agent counts to perfect squares (25, 49, 100, 144, 225) to maintain regular grid structure

4. **Visual Encoding**: Link thickness/opacity encodes actual influence strength between neighbors, making domain walls visible

## Files Modified
- `/apps/web/content/blog/liquid-crystal-society/index.mdx` - Added interactive demo
- `/apps/web/content/blog/liquid-crystal-society/cognitive-dynamics.tsx` - Created demo component
- `/packages/ui/src/components/slider.tsx` - Created Slider component
- `/packages/ui/src/index.ts` - Exported Slider

## Next Steps (Suggested)
- Could add heat map visualization of cognitive maps
- Could implement different network topologies (hexagonal, small-world)
- Could add trajectory recording/playback
- Could visualize opinion space (X*w projections)

## Technical Notes
- Used React hooks for state management
- Canvas API for performance with many agents
- Radix UI for accessible slider component
- Tailwind CSS for consistent styling