const fs = require('fs');
let content = fs.readFileSync('src/app/process/[workflowId]/page.tsx', 'utf8');

// Import modal
content = content.replace(
  "import { ProposedAutomation } from '@/components/proposed-automation';",
  "import { ProposedAutomation } from '@/components/proposed-automation';\nimport { DeployModal } from '@/components/deploy-modal';"
);

// Add state for modal
content = content.replace(
  "const [activeView, setActiveView] = useState<'process' | 'proposed'>('process');",
  "const [activeView, setActiveView] = useState<'process' | 'proposed'>('process');\n  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);"
);

// Update button onClick
content = content.replace(
  "onClick={() => alert('Automation deployed to Workday successfully!\\\\n\\\\nIn a real environment, this connects via Merge.dev or direct Workday REST APIs.')}",
  "onClick={() => setIsDeployModalOpen(true)}"
);

// Add modal component before AppShell closes
content = content.replace(
  "</AppShell>",
  "  <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />\n    </AppShell>"
);

fs.writeFileSync('src/app/process/[workflowId]/page.tsx', content);
