import json

# Read fixed workflow
with open(r'C:\myhost-bizmate\workflow_fixed.json', 'r', encoding='utf-8') as f:
    workflow = json.load(f)

# Remove read-only fields that can't be updated via API
readonly_fields = ['id', 'createdAt', 'updatedAt', 'shared', 'tags', 'meta', 'versionId', 'versionCounter', 'triggerCount']
for field in readonly_fields:
    if field in workflow:
        del workflow[field]

# Save clean workflow for update
with open(r'C:\myhost-bizmate\workflow_update.json', 'w', encoding='utf-8') as f:
    json.dump(workflow, f, indent=2)

print("Workflow prepared for update")
print("Fields removed:", readonly_fields)
