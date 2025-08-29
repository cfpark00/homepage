# Representation vs Objective Project Overview

## Date: 2025-08-29, 16:41

## Summary
Conducted comprehensive project planning interview for "Representation vs Objective" research project, populated project overview with detailed experimental plans, added 17 papers with verified abstracts to literature, and documented the planning session in project thoughts.

## Tasks Completed

### 1. Project Overview Population via User Interview
- **Conducted structured 8-phase interview** about the "Representation vs Objective" project investigating whether diffusion vs autoregressive model distinctions matter when right representations are formed
- **Created comprehensive overview.json** with:
  - Research abstract about using Star Graph task as testbed for diffusion vs AR comparison
  - 6 milestones: literature review, discrete diffusion implementation, cross-paradigm transfers, noise studies, loss landscape analysis, scaling studies
  - 5 core experiments with time estimates (baseline training, representation transfer, noise augmentation, loss landscape mapping, task scaling)
  - Resource requirements: 8 GPUs, 1TB storage, PyTorch, 1 student + 1 advisor for loss landscape studies
  - Detailed proposal covering background motivation, research roadmap, expected results (70% confidence transfer will work), broader impact on LLM training decisions
  - Potential objections section addressing Star Graph relevance concerns with scaling/generalization plans

### 2. Literature Addition with Verified Abstracts
- **Added 17 papers to literature.json** with 100% accurate abstracts fetched from arXiv:
  - Core Star Graph papers (Bachmann & Nagarajan 2024, Frydenlund 2024)
  - Diffusion vs AR comparisons (Ye et al. 2024, Prabhudesai et al. 2025)
  - Token ordering and factorization curse papers (Kitouni et al. 2024)
  - Multi-token prediction (Gloeckle et al. 2024)
  - Loss landscape analysis (Hoogland et al. 2024)
  - Search and planning limitations (Saparov et al. 2024, Ye et al. 2025)
  - In-context learning dynamics (Park et al. 2024, Wurgaft et al. 2025)
  - Complexity and intelligence emergence (Zhang et al. 2024)
- **Set priority levels** for most important papers (10 for Star Graph, 9 for key diffusion papers, 8 for loss landscape)
- **Added 1 web article** from Notion about diffusion as superior data learners

### 3. Project Thoughts Documentation
- **Added 7 thought entries** at 16:38 documenting:
  - Core research question crystallization
  - Key experimental design (identical architectures for fair comparison)
  - Loss plateau hypothesis and noise injection ideas
  - Critical implementation details about tokenization alignment
  - Broader implications for LLM scaling decisions
  - Main challenge of Star Graph relevance
  - Literature overview with 17 papers added

## Key Insights Captured

### Research Design
- **Central hypothesis**: Representations matter more than objectives - if AR can succeed with diffusion's representations, it proves optimization landscape (not objective function) is the barrier
- **User's confidence**: 70% probability that diffusion→AR transfer will work
- **Key implementation warning**: Must carefully align tokenization and transformer architecture to avoid trivial incompatibilities

### Theoretical Framework
- **Loss plateau theory**: AR gets stuck in local minima where SGD cannot breakthrough
- **Noise injection hypothesis**: May provide "escape velocity" from plateaus
- **RL limitation noted**: Won't help without right representations (chicken-egg problem)

### Broader Questions
- Should we keep scaling AR models?
- Do we need diffusion?
- Is AR + data augmentation sufficient?
- Star Graph serves as minimal test case for fundamental truths

## Files Modified
- `/apps/portal/content/projects/representation-vs-objective/overview.json` - Created comprehensive project overview
- `/apps/portal/content/projects/representation-vs-objective/literature.json` - Added 17 papers with verified abstracts
- `/apps/portal/content/projects/representation-vs-objective/thoughts.json` - Added 7 planning session thoughts

## Notes
- Project was created earlier today (2025-08-29 at 05:11 AM) in commit 3cbfc6e
- User emphasized maintaining scientific neutrality - not advocating for either paradigm but pursuing truth
- Plan includes scaling studies to address real-world relevance concerns