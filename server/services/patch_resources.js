const fs = require('fs');
const path = require('path');

const svcPath = path.join(__dirname, 'skillGapAnalysis.service.js');
let svc = fs.readFileSync(svcPath, 'utf8');

// Normalize to LF for easier matching
const normalized = svc.replace(/\r\n/g, '\n');

const OLD_BLOCK = `      if (existingPath) {\n        // Update the gapAnalysis reference and save\n        existingPath.gapAnalysis = gapAnalysisId;\n        await existingPath.save();\n        return existingPath;\n      }`;

const NEW_BLOCK = `      if (existingPath) {\n        // Update the gapAnalysis reference\n        existingPath.gapAnalysis = gapAnalysisId;\n\n        // Backfill milestone resources if this is an old path with empty resources\n        const needsResourceBackfill = existingPath.milestones &&\n          existingPath.milestones.length > 0 &&\n          existingPath.milestones.every(m => !m.resources || m.resources.length === 0);\n\n        if (needsResourceBackfill) {\n          console.log(\`🔄 Backfilling resources for existing path: \${existingPath.skillName}\`);\n          try {\n            const freshMilestones = await this.generateMilestonesWithAI(\n              existingPath.skillName,\n              existingPath.milestones.length\n            );\n            // Merge: keep existing completed/dueDate state, just inject new resources\n            existingPath.milestones = existingPath.milestones.map((m, i) => ({\n              ...m.toObject(),\n              resources: (freshMilestones[i] && freshMilestones[i].resources) || m.resources || []\n            }));\n            existingPath.markModified('milestones');\n          } catch (err) {\n            console.warn('⚠️ Resource backfill failed, skipping:', err.message);\n          }\n        }\n\n        await existingPath.save();\n        return existingPath;\n      }`;

if (!normalized.includes(OLD_BLOCK)) {
  console.error('ERROR: Could not find target block. Showing context around "existingPath":');
  const idx = normalized.indexOf('if (existingPath)');
  console.error(JSON.stringify(normalized.substring(idx, idx + 200)));
  process.exit(1);
}

const patched = normalized.replace(OLD_BLOCK, NEW_BLOCK);
// Write back with original line endings
fs.writeFileSync(svcPath, patched.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ Service: existing-path backfill added successfully');
