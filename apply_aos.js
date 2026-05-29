const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'frontend', 'src', 'components'),
  path.join(__dirname, 'frontend', 'src', 'pages'),
];

function processFile(filePath) {
  if (filePath.includes('LiveFitTestimonials.tsx')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace <motion.div with <div data-aos="fade-up" (or keep whatever properties were there except motion ones)
  // Actually, we want to replace common <motion.div ... initial=... whileInView=... transition=...> with <div data-aos="...">
  
  // A simpler regex approach:
  // Find all <motion.tag ...> block
  // We'll replace <motion.tag with <tag data-aos="fade-up"
  // And remove initial={...}, animate={...}, whileInView={...}, transition={...}, viewport={...}
  
  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1 data-aos="fade-up"');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');
  
  // Now remove framer-motion specific attributes
  // These attributes can span multiple lines, so we use a non-greedy regex that matches the attribute and its {} value
  // This is tricky for nested curly braces. Let's just do simple replacements for known single-line/multi-line patterns
  // Alternatively, just matching ` initial={{...}}` etc. if we assume standard format.
  
  // Since some {{...}} might span multiple lines, we can use a more robust regex or just strip known props
  const propsToRemove = ['initial', 'whileInView', 'transition', 'viewport', 'animate', 'exit'];
  
  propsToRemove.forEach(prop => {
    // Regex for `prop={{...}}` or `prop={...}` even with newlines
    // This matches `prop={` followed by everything up to the matching `}`
    // It's hard to do perfect balanced brace matching with pure regex. 
    // But mostly it's prop={{ opacity: 0, y: 20 }}
    const regex = new RegExp(`\\s*${prop}=\\{\\{[^}]+\\}\\}\\s*`, 'g');
    content = content.replace(regex, ' ');
    
    // Also catch prop={variable}
    const regex2 = new RegExp(`\\s*${prop}=\\{[^}]+\\}\\s*`, 'g');
    content = content.replace(regex2, ' ');
    
    // Catch prop="string"
    const regex3 = new RegExp(`\\s*${prop}="[^"]*"\\s*`, 'g');
    content = content.replace(regex3, ' ');
  });

  // Also remove import { motion } from 'framer-motion';
  content = content.replace(/import\s+\{.*motion.*\}\s+from\s+['"]framer-motion['"];?\s*/g, '');

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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

directories.forEach(walk);
