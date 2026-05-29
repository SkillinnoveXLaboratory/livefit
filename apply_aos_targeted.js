const fs = require('fs');
const path = require('path');

const targetFiles = [
  'Hero.tsx',
  'UniqueNeeds.tsx',
  'AboutUsSection.tsx',
  'OneOnOne.tsx',
  'ZoomSessions.tsx',
  'Programs.tsx',
  'GlobalSchedule.tsx',
  'ScheduleCTA.tsx',
  'WorkoutStats.tsx',
  'GalleryLibrary.tsx'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add data-aos="fade-up" to motion.divs that have whileInView
  content = content.replace(/<motion\.div([^>]*)whileInView/g, '<motion.div data-aos="fade-up" $1whileInView');
  content = content.replace(/<motion\.h2([^>]*)whileInView/g, '<motion.h2 data-aos="fade-up" $1whileInView');
  content = content.replace(/<motion\.p([^>]*)whileInView/g, '<motion.p data-aos="fade-up" $1whileInView');

  // Strip whileInView, initial, viewport, transition
  const propsToRemove = ['initial', 'whileInView', 'transition', 'viewport'];
  propsToRemove.forEach(prop => {
    // Regex for prop={{...}} or prop={...}
    const regex = new RegExp(`\\s*${prop}=\\{\\{[^}]+\\}\\}\\s*`, 'g');
    content = content.replace(regex, ' ');
    const regex2 = new RegExp(`\\s*${prop}=\\{[^}]+\\}\\s*`, 'g');
    content = content.replace(regex2, ' ');
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated AOS in ${path.basename(filePath)}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      if (targetFiles.includes(path.basename(fullPath))) {
         processFile(fullPath);
      }
    }
  }
}

const directories = [
  path.join(__dirname, 'frontend', 'src', 'components'),
  path.join(__dirname, 'frontend', 'src', 'pages'),
];

directories.forEach(walk);
