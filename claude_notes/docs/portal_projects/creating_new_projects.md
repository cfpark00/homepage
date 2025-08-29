# Creating New Projects in Portal

## Important Rules

**DO NOT create hallucinated or made-up data.** Only add real content that the user provides.

## Required Steps

### 1. Query Current Date
Always get the actual current date before creating a project:
```bash
date "+%Y-%m-%d"
```

### 2. Create Project Directory
```bash
mkdir -p /Users/cfpark00/mysite/apps/portal/content/projects/[project-slug]
```

### 3. Create Required Files

#### metadata.json
Create with minimal required tabs (overview, thoughts, literature):
```json
{
  "slug": "[project-slug]",
  "name": "[Project Name]",
  "description": "[Brief description provided by user]",
  "status": "active",
  "created": "[YYYY-MM-DD]",
  "last_updated_at": "[YYYY-MM-DD]",
  "icon": "Brain",
  "logo": "/project-logos/[project-slug].png",
  "color": "blue",
  "tabs": [
    {
      "id": "overview",
      "label": "Overview",
      "icon": "Home"
    },
    {
      "id": "thoughts",
      "label": "Thoughts",
      "icon": "Brain"
    },
    {
      "id": "literature",
      "label": "Literature",
      "icon": "FileText"
    }
  ]
}
```

#### items.json
Create empty:
```json
{
  "items": []
}
```

#### thoughts.json
Create with initial "Project created" thought at creation date:
```json
[
  {
    "date": "[YYYY-MM-DD]",
    "title": "Project [Name] Created",
    "thoughts": [
      {
        "content": "Project created",
        "time": "00:00",
        "tags": ["milestone", "project"]
      }
    ]
  }
]
```

#### overview.json (optional)
Only create if user provides overview content. Otherwise create empty:
```json
{}
```

## Thought Format Reference

Daily thoughts structure:
```json
{
  "date": "YYYY-MM-DD",
  "title": "Title or Ongoing...",
  "thoughts": [
    {
      "content": "Thought content text",
      "time": "HH:MM",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

## Notes

- Project slug should be kebab-case (e.g., "context-to-weights")
- Default color can be: blue, purple, red, green, orange, pink
- Default icon is "Brain" but can be changed based on project type
- Additional tabs can be added if needed (e.g., "experiments" with icon "Flask")
- The "Project created" thought will be automatically injected at runtime if not present