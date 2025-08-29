# Adding Papers, Repositories, and Web Content to Portal Projects

This guide explains how to properly add academic papers, GitHub repositories, and web content (articles, blog posts, tweets, Wikipedia) to portal projects. Each project can contain multiple items organized in its `literature.json` file.

## Overview

All literature items are stored in `/Users/cfpark00/mysite/apps/portal/content/projects/[project-slug]/literature.json`. Each entry contains metadata, abstract/description, and analysis fields that help track research literature, code resources, and web content.

## Content Types

**⚠️ UNIVERSAL REQUIREMENTS**: ALL content types (papers, documents, repositories, web articles, etc.) MUST have:
1. **description**: A one-line TLDR summary of the content's main contribution/purpose
2. **abstract**: A comprehensive summary or the actual abstract (see specific guidelines per type below)

### Papers
Academic papers, research articles, and preprints with proper citations and abstracts.
- **type**: `"paper"`
- Must include real abstracts from the source (100% unmodified)
- Include full author lists and publication dates
- TLDR in description field

### Documents
General documents, Google Docs, PDFs, or any content that doesn't fit other categories.
- **type**: `"document"`
- Simplified display (just title and "Document" label)
- TLDR in description field (required)
- Abstract should be a comprehensive summary of the document
- No authors or publication date shown in UI

### Other Types
- **`"repository"`**: GitHub repositories - abstract generated from README
- **`"web-article"`**: General web articles - abstract summarizes content
- **`"blog-post"`**: Technical blog posts - abstract from actual content
- **`"tweet"`**: Twitter/X posts - abstract contains thread content

## Required Fields for Papers

When adding a paper, include these essential fields:

### Core Metadata
- **id**: Unique identifier (e.g., `"fer-hypothesis-kumar-2025"`)
- **name**: Full paper title
- **type**: Must be `"paper"` for papers
- **tab**: Usually `"literature"`
- **lastModified**: Date you added/modified the entry (format: `"2025-08-29"`)
- **publicationDate**: Publication date in `"Month Year"` format (e.g., `"May 2023"`, NOT `"2023-05-27"`)

### Authors & Description
- **authors**: Array of author names. For long lists, use first 3-4 authors followed by `"et al."`
- **description**: One-line TLDR summary of the paper's main contribution
- **link**: URL to the paper (usually arxiv link)

### Content Fields
- **abstract**: The FULL abstract from the paper (see critical note below) - **REQUIRED for ALL content types**
- **readingStatus**: One of `"to-read"`, `"reading"`, or `"read"`

### Optional Analysis Fields
- **relevanceToProject**: Why this paper matters for your specific project
- **myTake**: Your personal analysis and thoughts
- **aiTake**: AI-generated analysis (if applicable)
- **subtab**: For further categorization (e.g., `"core"` for essential papers)
- **priority**: Global priority score (1-10+, higher = more important). Papers with priority > 0 appear in the dashboard's "Priority Papers" list
- **tags**: Array of tags for categorization (e.g., `["Motivation"]`, `["Methods", "Benchmarks"]`) - **NEVER hallucinate tags; only add tags when explicitly told to do so**

## ⚠️ CRITICAL: Always Use Real Abstracts

**NEVER write a summary or paraphrase as the abstract.** Always fetch the actual abstract from the paper source. This is crucial for:
1. Accuracy and academic integrity
2. Searchability 
3. Proper citation
4. Maintaining research standards

### How to Get the Real Abstract

1. Visit the paper's arxiv page or publisher site
2. Copy the abstract exactly as written
3. Do NOT summarize or modify it
4. **The abstract must be 100% UNMODIFIED from the source** (formatting changes like removing line breaks are OK, but every word, punctuation mark, and sentence must be identical)
5. After adding the real abstract, THEN write your one-line TLDR in the `description` field

**VERIFICATION RULE**: If someone checks the abstract on arxiv/publisher site, it should match your entry word-for-word, character-for-character (except formatting).

## Example Paper Entry

```json
{
  "id": "fer-hypothesis-kumar-2025",
  "name": "Questioning Representational Optimism in Deep Learning: The Fractured Entangled Representation Hypothesis",
  "type": "paper",
  "tab": "literature",
  "subtab": "core",
  "shared": false,
  "lastModified": "2025-08-28",
  "description": "Challenges the assumption that neural networks learn unified representations by introducing the FER hypothesis",
  "publicationDate": "May 2025",
  "authors": [
    "Akarsh Kumar",
    "Jeff Clune", 
    "Joel Lehman",
    "Kenneth O. Stanley"
  ],
  "abstract": "Much of the excitement in modern AI is driven by the observation that scaling up existing systems leads to better performance. But does better performance necessarily imply better internal representations? While the representational optimist assumes it must, this position paper challenges that view. We compare neural networks evolved through an open-ended search process to networks trained via conventional stochastic gradient descent (SGD) on the simple task of generating a single image. This minimal setup offers a unique advantage: each hidden neuron's full functional behavior can be easily visualized as an image, thus revealing how the network's output behavior is internally constructed neuron by neuron. The result is striking: while both networks produce the same output behavior, their internal representations differ dramatically. The SGD-trained networks exhibit a form of disorganization that we term fractured entangled representation (FER). Interestingly, the evolved networks largely lack FER, even approaching a unified factored representation (UFR). In large models, FER may be degrading core model capacities like generalization, creativity, and (continual) learning. Therefore, understanding and mitigating FER could be critical to the future of representation learning.",
  "relevanceToProject": "This paper is core to understanding when representations unify vs remain separate. The single-example training discussion (Section 6.3) particularly addresses my question about data efficiency and representation emergence.",
  "myTake": "Really good paper that puts concrete wording to intuitions I've had. They make the critical point that representations form via compression through lots of data, not single examples.",
  "readingStatus": "read",
  "priority": 8,
  "link": "https://arxiv.org/abs/2505.11581"
}
```

## Common Mistakes to Avoid

1. ❌ **Writing summaries instead of real abstracts**
   - Wrong: `"abstract": "The paper describes creating AI agents that can perform well beyond a single task..."`
   - Right: Copy the actual abstract from the paper

2. ❌ **Using date formats like "2023-05-27"**
   - Wrong: `"publicationDate": "2023-05-27"`
   - Right: `"publicationDate": "May 2023"`

3. ❌ **Missing the one-line TLDR**
   - Always include a concise `description` field that summarizes the paper in one line

4. ❌ **Incomplete author lists without "et al."**
   - For papers with many authors, list 3-4 key authors then add "et al."

5. ❌ **Using type "paper" for general documents**
   - Use `"paper"` only for academic papers with proper citations
   - Use `"document"` for Google Docs, general PDFs, or informal content

## Adding Papers to Different Projects

Current projects accepting papers:
- `domain-ablated-llms`: Domain-specific knowledge ablation studies
- `dopamine-curiosity`: Dopamine and curiosity mechanisms
- `evo-llm`: Evolutionary approaches to LLMs
- `evolution-research`: General evolution research
- `example-research`: Example/test papers
- `grand-synthetic-data`: Synthetic data generation
- `llm-research-ability`: LLM research capabilities
- `llms-dopamine`: LLM reward mechanisms
- `origins-representations`: Representation learning origins
- `research-thought-tracking`: Research methodology

## Workflow Summary

1. Find the paper on arxiv or publisher site
2. Copy the EXACT abstract (don't summarize!)
3. Write a one-line TLDR for the `description` field
4. Format the publication date as "Month Year"
5. Add to the appropriate project's `literature.json`
6. Include your analysis in `relevanceToProject` and `myTake` fields
7. Set appropriate `readingStatus`

## Quality Checklist

Before committing a paper entry, verify:
- [ ] Abstract is the real, complete abstract from the paper
- [ ] Publication date is in "Month Year" format
- [ ] Description field contains a clear one-line TLDR
- [ ] Authors list is properly formatted with "et al." if needed
- [ ] Link to paper is included and working
- [ ] Unique ID follows naming convention
- [ ] Reading status is set
- [ ] Relevant analysis fields are filled if you've read the paper

Remember: The abstract should ALWAYS be the actual abstract from the paper, not your interpretation or summary of it!

## Documents (General Content)

For general documents like Google Docs, PDFs without formal structure, or internal documents:

### Required Fields for Documents

#### Core Metadata
- **id**: Unique identifier (e.g., `"project-notes-2025"`)
- **name**: Document title
- **type**: Must be `"document"`
- **tab**: Usually `"literature"`
- **lastModified**: Date you added/modified the entry

#### Content Fields
- **description**: One-line TLDR of the document's content (REQUIRED)
- **abstract**: Comprehensive summary of the document (REQUIRED)
- **link**: URL to the document (Google Docs share link, etc.)

### Optional Fields for Documents
- **relevanceToProject**: Why this document matters
- **myTake**: Your notes or thoughts

### Example Document Entry

```json
{
  "id": "research-planning-doc",
  "name": "2025 Research Planning Document",
  "type": "document",
  "tab": "literature",
  "shared": false,
  "lastModified": "2025-08-29",
  "description": "Quarterly research goals and milestones for the dopamine-curiosity project",
  "abstract": "This document outlines the 2025 research roadmap for investigating dopamine-driven curiosity mechanisms in artificial agents. The plan includes four quarterly milestones: Q1 focuses on establishing baseline curiosity metrics and implementing intrinsic motivation frameworks, Q2 involves developing novel reward shaping techniques based on information gain, Q3 targets integration with existing RL architectures and benchmarking on exploration tasks, and Q4 aims for theoretical analysis and publication preparation. Key deliverables include a new curiosity-driven exploration algorithm, comprehensive benchmark results on sparse reward environments, and at least two conference submissions.",
  "link": "https://docs.google.com/document/d/1abc123...",
  "readingStatus": "to-read"
}
```

### Document Display

Documents are displayed with:
- Title prominently shown
- "Document" label underneath
- Optional TLDR from description field
- Link to source
- No author or publication date information

## GitHub Repositories

GitHub repositories are treated as literature items but with special handling. They appear in the literature tab alongside papers.

### Required Fields for Repositories

#### Core Metadata
- **id**: Unique identifier (e.g., `"rl2-reinforcement-learning-library"`)
- **name**: Repository name with brief descriptor
- **type**: Must be `"repository"` (not `"document"`)
- **tab**: Usually `"literature"`
- **lastModified**: Date you added/modified the entry
- **publicationDate**: Year or "Month Year" if known

#### Content Fields
- **description**: One-line TLDR of what the repository does
- **authors**: Repository contributors (main authors + "et al." for long lists)
- **link**: GitHub URL (e.g., `"https://github.com/username/repo"`)
- **abstract**: Generated description based on README content (see below)

### ⚠️ IMPORTANT: Repository Abstracts

For GitHub repositories, the `abstract` field works differently than papers:

1. **DO NOT copy/paste paper abstracts** - Repositories don't have traditional abstracts
2. **Generate from README** - Create a comprehensive description grounded in the actual README content
3. **Include key information**:
   - What the repository does
   - Main features and capabilities
   - Technical implementation details
   - Frameworks/languages used
   - Scale/performance characteristics
   - Any referenced papers or algorithms

### Example Repository Entry

```json
{
  "id": "rl2-reinforcement-learning-library",
  "name": "RL2: Ray Less Reinforcement Learning",
  "type": "repository",
  "tab": "literature",
  "shared": false,
  "lastModified": "2025-08-29",
  "description": "Concise (<1K lines) yet scalable RL library for LLMs up to 72B parameters with FSDP, tensor parallelism, and multi-turn rollouts",
  "publicationDate": "2025",
  "authors": [
    "Chenmien Tan",
    "Simon Yu",
    "Lanbo Lin",
    "Ze Zhang",
    "et al."
  ],
  "abstract": "RL2 (Ray Less Reinforcement Learning) is a concise library of reinforcement learning for large language models, designed to help users learn and test reinforcement learning algorithms with clear implementation within 1,000 lines of code. The library supports scaling to models up to 72B parameters through model partition via Fully Sharded Data Parallelism and Tensor Parallelism, efficient sequence parallelism with ZigZag Ring Attention, balanced sequence packing, and multi-turn rollout capabilities with SGLang async inference engine. It provides production-ready implementations of multiple training approaches including Supervised Fine-Tuning (SFT), Reward Modeling (RM), Direct Preference Optimization (DPO), and Proximal Policy Optimization (PPO). The library demonstrates its effectiveness through multiple project examples on Weights & Biases and references the Dr. GRPO algorithm from recent research.",
  "readingStatus": "to-read",
  "link": "https://github.com/ChenmienTan/RL2"
}
```

### Repository Workflow

1. Visit the GitHub repository
2. Read the README thoroughly
3. Write a one-line TLDR for `description`
4. Generate a comprehensive `abstract` based on README content (no hallucination!)
5. List main contributors as authors
6. Set type as `"repository"`
7. Add to appropriate project's `literature.json`

## Web Content (Articles, Blog Posts, Tweets, Wikipedia)

Web content is treated as literature but requires special handling based on the source type.

### Content Types

- **`web-article`**: General web articles, news, documentation
- **`blog-post`**: Technical blog posts (some may qualify as papers if rigorous enough)
- **`tweet`**: Twitter/X posts with valuable insights
- **`document`**: Use for blog posts that are paper-quality with proper citations

### Required Fields for Web Content

#### Core Metadata
- **id**: Unique identifier (e.g., `"pcfg-wikipedia"`)
- **name**: Article/post title
- **type**: One of `"web-article"`, `"blog-post"`, `"tweet"`
- **tab**: Usually `"literature"`
- **lastModified**: Date you added the entry
- **publicationDate**: Original publication date or platform name (e.g., "Wikipedia", "March 2024", "Twitter")

#### Content Fields
- **description**: One-line TLDR of the content
- **authors**: Author names or "Wikipedia Contributors", "Twitter @handle", etc.
- **link**: Full URL to the content
- **abstract**: Comprehensive summary based on actual content (see guidelines below)

### Web Content Abstract Guidelines

For web content, create abstracts that:

1. **Summarize the actual content** - No hallucination, ground everything in what's actually written
2. **Include key points** - Main arguments, findings, or concepts
3. **Preserve technical details** - Important algorithms, formulas, or methods mentioned
4. **Note any references** - Papers cited, researchers mentioned
5. **Be comprehensive** - Longer than the TLDR but focused on substance

### Special Cases

#### Wikipedia Articles
- Leave `authors` as empty array `[]`
- Use `"Wikipedia Article"` as publicationDate
- Create comprehensive abstract from the article content
- Focus on definitions, key concepts, applications, and notable contributors

#### High-Quality Blog Posts
- If a blog post has proper citations, rigorous analysis, and novel contributions, you can use type `"blog-post"` or even `"paper"` if it's research-quality
- Include actual author names
- Treat abstract similarly to a paper (comprehensive summary)

#### Tweets/Threads
- Use Twitter handle as author
- Include thread content in abstract if multiple tweets
- Note any papers or resources linked

### Example: Wikipedia Article

```json
{
  "id": "pcfg-wikipedia",
  "name": "Probabilistic Context-Free Grammar",
  "type": "web-article",
  "tab": "literature",
  "shared": false,
  "lastModified": "2025-08-29",
  "description": "Extension of context-free grammars with probabilistic production rules for modeling structural relationships in language and RNA",
  "publicationDate": "Wikipedia Article",
  "authors": [],
  "abstract": "Probabilistic Context-Free Grammars (PCFGs) are an extension of context-free grammars that assign probabilities to production rules, similar to how hidden Markov models extend regular grammars. A PCFG is formally defined by the quintuple G = (M, T, R, S, P), where M represents non-terminal symbols, T represents terminal symbols, R is the set of production rules, S is the start symbol, and P assigns probabilities to production rules. The probability of a derivation is calculated as the product of the probabilities of all productions used. PCFGs have significant applications in natural language processing for parsing and statistical language modeling, RNA structure prediction in bioinformatics for modeling secondary structures and base-pair interactions, and sequence analysis for evolutionary patterns. Key algorithms include the CYK (Cocke–Younger–Kasami) algorithm for finding optimal parse trees, the Inside-Outside algorithm for computing total probability of derivations, and Expectation-Maximization for refining grammar parameters. The theoretical foundations stem from Noam Chomsky's work in the 1950s on grammar theory, with important contributions from researchers including Sean Eddy, Bjørn Knudsen, and Jotun Hein in applying these concepts to computational biology and linguistics.",
  "readingStatus": "to-read",
  "link": "https://en.wikipedia.org/wiki/Probabilistic_context-free_grammar"
}
```

### Example: Technical Blog Post

```json
{
  "id": "attention-visualized-2023",
  "name": "Attention is All You Need: Visualizing Transformer Architecture",
  "type": "blog-post",
  "tab": "literature",
  "shared": false,
  "lastModified": "2025-08-29",
  "description": "Interactive visualization and explanation of transformer self-attention mechanisms",
  "publicationDate": "September 2023",
  "authors": [
    "Jay Alammar"
  ],
  "abstract": "[Summary based on actual blog content about transformers, attention mechanisms, etc.]",
  "readingStatus": "read",
  "link": "https://example.com/attention-visualized"
}
```

### Web Content Workflow

1. Visit the web page/article
2. Read the content thoroughly
3. Determine appropriate type (`web-article`, `blog-post`, `tweet`)
4. Write a one-line TLDR for `description`
5. Create comprehensive `abstract` from actual content
6. Use appropriate author attribution
7. Add to relevant project's `literature.json`