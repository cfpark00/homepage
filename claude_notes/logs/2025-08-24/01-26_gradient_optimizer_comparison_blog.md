# Gradient Optimizer Comparison Blog Post

## Date: 2025-08-24, 01:26

## Summary
Created an interactive blog post comparing gradient descent optimizers (SGD, Adam, AdamW, Muon, Shampoo, etc.) with visualization of their trajectories on 2D loss landscapes. Fixed implementation bugs and build errors along the way.

## Tasks Completed

### 1. Initial Blog Post Creation
- Created new blog folder: `/apps/web/content/blog/gradient-optimizer-comparison/`
- Researched modern optimizers including Muon (2024) and Shampoo
- Built interactive visualization component with click-to-launch interface
- Implemented 5 initial optimizers: SGD, SGD+Momentum, RMSprop, Adam, Muon

### 2. Build Error Fixes
- Fixed missing Slider component imports in both:
  - `optimizer-visualization.tsx` - replaced with native HTML range inputs
  - `double-pendulum-chaos/double-pendulum.tsx` - fixed another dev's error
- Fixed MDX mathematical notation issues (changed `θ_{t+1}` to `θ(t+1)`)

### 3. Visualization Improvements
- Removed visual artifacts ("weird lines") from landscape rendering
- Simplified to 4 key landscapes: Convex, Rosenbrock, Beale, Rastrigin
- Fixed Rastrigin function name (was incorrectly called "pitfalls")
- Added green circle to mark global minimum ("optimal" point)
- Implemented smooth canvas-based contour rendering

### 4. Algorithm Bug Fixes
- **Critical SGD+Momentum fix**: Corrected overshooting issue
  ```javascript
  // Wrong (was overshooting):
  velocity = { x: momentum * velocity.x - lr * grad.x, ... }
  // Correct:
  velocity = { x: momentum * velocity.x + grad.x, ... }
  position = { x: position.x - lr * velocity.x, ... }
  ```
- Separated gradient calculation from noisy loss for stability
- Added convergence detection (gradient magnitude < 0.001)

### 5. Documentation Updates
- Updated MDX content to accurately describe all 7 optimizers
- Added detailed explanations of each loss landscape
- Included practical insights and technical notes
- Updated metadata.json with proper tags and excerpt

### 6. UI/UX Improvements
- Redesigned hyperparameter settings:
  - Shared learning rate slider at top
  - Individual optimizer dropdowns with PyTorch defaults
- Reorganized optimizer layout into 2 rows:
  - Row 1: SGD / SGD+Momentum / RMSprop
  - Row 2: Adam / AdamW / Muon / Shampoo
- Added active runs display with real-time loss values

### 7. Final Optimizer Additions
- Implemented AdamW with decoupled weight decay
- Added Shampoo second-order optimizer with diagonal preconditioning
- Total of 7 optimizers with proper implementations

## Technical Details

### Optimizer Implementations
- **SGD**: Basic gradient descent
- **SGD+Momentum**: Fixed velocity accumulation
- **RMSprop**: Adaptive learning rates based on gradient magnitude
- **Adam**: Momentum + adaptive rates with bias correction
- **AdamW**: Adam with decoupled weight decay (ε=1e-8, β1=0.9, β2=0.999)
- **Muon**: Simplified 2D version with orthogonalized momentum
- **Shampoo**: Diagonal preconditioning approximation for 2D

### Loss Landscapes
- **Convex**: Simple quadratic (x² + y²), minimum at (0, 0)
- **Rosenbrock**: Famous "banana valley", minimum at (1, 1)
- **Beale**: Steep valleys with flat regions, minimum at (3, 0.5)
- **Rastrigin**: Multi-modal with grid of local minima, global at (0, 0)

### Files Modified/Created
- Created: `/apps/web/content/blog/gradient-optimizer-comparison/index.mdx`
- Created: `/apps/web/content/blog/gradient-optimizer-comparison/optimizer-visualization.tsx`
- Modified: `/apps/web/content/blog/metadata.json` (added new post entry)
- Fixed: `/apps/web/content/blog/double-pendulum-chaos/double-pendulum.tsx` (Slider import)

## User Feedback Addressed
- "wtf is optimal????" - Clarified green circle marks global minimum
- "is the sgd momentum implementation correct??" - Fixed overshooting bug
- "weird lines on landscape" - Removed visual artifacts
- "i think its usually called Rastrigin" - Corrected function name
- Layout request for 2 rows of optimizers - Implemented as specified

## Deployment Status
- Blog post successfully integrated into site
- All build errors resolved
- Interactive visualization fully functional
- Ready for production deployment