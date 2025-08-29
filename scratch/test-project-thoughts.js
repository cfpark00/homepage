const path = require('path');
const fs = require('fs');

// Simulate the getProjectBySlug function logic
const PROJECTS_DIR = path.join(process.cwd(), 'apps/portal/content/projects');

function testProjectThoughts(slug) {
  const projectDir = path.join(PROJECTS_DIR, slug);
  
  // Read metadata
  const metadataPath = path.join(projectDir, 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  
  // Read thoughts if file exists
  let thoughts = [];
  const thoughtsPath = path.join(projectDir, 'thoughts.json');
  if (fs.existsSync(thoughtsPath)) {
    const thoughtsData = JSON.parse(fs.readFileSync(thoughtsPath, 'utf-8'));
    if (Array.isArray(thoughtsData)) {
      thoughts = thoughtsData;
    }
  }
  
  console.log(`\nProject: ${metadata.name} (${slug})`);
  console.log(`Created: ${metadata.created}`);
  console.log(`Original thoughts count: ${thoughts.length}`);
  
  // Add "Project created" thought at creation date
  if (metadata.created) {
    const createdDate = metadata.created.split('T')[0]; // Get YYYY-MM-DD part
    
    // Check if we already have thoughts for the creation date
    const existingCreationDateThoughts = thoughts.find(dt => dt.date === createdDate);
    
    if (existingCreationDateThoughts) {
      // Check if "Project created" thought already exists
      const hasProjectCreatedThought = existingCreationDateThoughts.thoughts.some(
        t => t.content === 'Project created' && t.time === '00:00'
      );
      
      if (!hasProjectCreatedThought) {
        // Add "Project created" thought at the beginning
        existingCreationDateThoughts.thoughts.unshift({
          content: 'Project created',
          time: '00:00',
          tags: ['milestone', 'project']
        });
        console.log('Added "Project created" thought to existing date entry');
      } else {
        console.log('"Project created" thought already exists');
      }
    } else {
      // Create new daily thoughts entry for creation date
      const creationDateThoughts = {
        date: createdDate,
        title: `Project ${metadata.name} Created`,
        thoughts: [{
          content: 'Project created',
          time: '00:00',
          tags: ['milestone', 'project']
        }]
      };
      
      // Insert at the correct position (maintain chronological order)
      const insertIndex = thoughts.findIndex(dt => dt.date < createdDate);
      if (insertIndex === -1) {
        thoughts.push(creationDateThoughts);
      } else {
        thoughts.splice(insertIndex, 0, creationDateThoughts);
      }
      console.log('Created new date entry with "Project created" thought');
    }
  }
  
  console.log(`Final thoughts count: ${thoughts.length}`);
  
  // Show the thoughts for the creation date
  const createdDate = metadata.created.split('T')[0];
  const creationThoughts = thoughts.find(dt => dt.date === createdDate);
  if (creationThoughts) {
    console.log('\nThoughts for creation date:');
    console.log(JSON.stringify(creationThoughts, null, 2));
  }
}

// Test with a few projects
const projects = ['evo-llm', 'dopamine-curiosity', 'example-research'];

projects.forEach(project => {
  try {
    testProjectThoughts(project);
  } catch (error) {
    console.error(`Error testing ${project}:`, error.message);
  }
});