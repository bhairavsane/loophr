const fs = require('fs');
let content = fs.readFileSync('src/app/review/[workflowId]/page.tsx', 'utf8');

// 1. Remove the activeTab state
content = content.replace("const [activeTab, setActiveTab] = useState<'policy' | 'automation'>('policy');\n", "");

// 2. Remove React Flow imports since they aren't used here anymore
content = content.replace(/import \{\n  ReactFlow,[\s\S]*?\} from '@xyflow\/react';\n/, "");
content = content.replace(/import { useTheme } from 'next-themes';\nimport '@xyflow\/react\/dist\/style.css';\n/, "");

// 3. Remove nodeTypes and custom Node components
content = content.replace(/\/\/ --- Node Types for React Flow ---[\s\S]*?const nodeTypes = \{[\s\S]*?\};\n/m, "");

// 4. Remove initialNodes / initialEdges / useMemo / useNodesState
content = content.replace(/\/\/ Generate initial nodes and edges from workflowData[\s\S]*?const \[edges, setEdges, onEdgesChange\] = useEdgesState\(initialEdges\);\n/m, "");

// 5. Remove onNodeClick
content = content.replace(/const onNodeClick = useCallback\(\(_: any, node: Node\) => \{[\s\S]*?\}\, \[\]\);\n/m, "");
content = content.replace(/const \[selectedNode, setSelectedNode\] = useState<any \| null>\(null\);\n  const \{ resolvedTheme \} = useTheme\(\);\n/m, "");

// 6. Remove the tab toggle buttons
content = content.replace(/<div className="flex bg-\[var\(--bg-surface\)\].*?<\/div>/s, "");

// 7. Remove the `{activeTab === 'policy' && (` and the closing `)}` at line ~341
content = content.replace(/\{activeTab === 'policy' && \(\n/, "");
content = content.replace(/                <\/div>\n\n              <\/div>\n            <\/div>\n          \)\}/, "                </div>\n\n              </div>\n            </div>");

// 8. Remove the entire `{activeTab === 'automation' && ( ... )}` block
content = content.replace(/\{\/\* TAB 2: Proposed Automation \*\/\}(.|\n)*?<\/div>\n            <\/div>\n          \)\}/, "");

fs.writeFileSync('src/app/review/[workflowId]/page.tsx', content);
