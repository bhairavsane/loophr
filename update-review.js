const fs = require('fs');
const content = fs.readFileSync('src/app/review/[workflowId]/page.tsx', 'utf8');

let newContent = content.replace(/const \[activeTab, setActiveTab\] = useState<'policy' \| 'automation'>\('policy'\);\n/g, '');

newContent = newContent.replace(/\{\/\* TAB 2: Proposed Automation \*\/\}(.|\n)*?\n          \)\}\n/g, '');

newContent = newContent.replace(/\{activeTab === 'policy' && \(\n/g, '');

// Also remove the tab buttons
newContent = newContent.replace(/<div className="flex bg-\[var\(--bg-surface\)\].*?<\/div>/s, '');

fs.writeFileSync('src/app/review/[workflowId]/page.tsx', newContent);
