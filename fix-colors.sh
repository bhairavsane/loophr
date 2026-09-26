#!/bin/bash
FILES="src/app/review/[workflowId]/page.tsx src/app/replay/[workflowId]/page.tsx"
for f in $FILES; do
  sed -i '' 's/#0a0a0a/var(--bg)/g' "$f"
  sed -i '' 's/#111111/var(--bg-surface)/g' "$f"
  sed -i '' 's/#1a1a1a/var(--bg-elevated)/g' "$f"
  sed -i '' 's/#1f1f1f/var(--bg-hover)/g' "$f"
  sed -i '' 's/#262626/var(--border)/g' "$f"
  sed -i '' 's/#333333/var(--border-strong)/g' "$f"
  sed -i '' 's/#ededed/var(--text-primary)/g' "$f"
  sed -i '' 's/#a1a1a1/var(--text-secondary)/g' "$f"
  sed -i '' 's/#666666/var(--text-muted)/g' "$f"
  sed -i '' 's/#3b82f6/var(--accent)/g' "$f"
  sed -i '' 's/#22c55e/var(--success)/g' "$f"
  sed -i '' 's/#eab308/var(--warning)/g' "$f"
  sed -i '' 's/#ef4444/var(--error)/g' "$f"
done
