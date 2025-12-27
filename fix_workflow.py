import json

# Read workflow
with open(r'C:\myhost-bizmate\workflow_current.json', 'r', encoding='utf-8') as f:
    workflow = json.load(f)

# Find and fix "Update Status - Sent" node
for node in workflow['nodes']:
    if node['name'] == 'Update Status - Sent':
        # Remove sendHeaders option and manual header parameters
        if 'sendHeaders' in node['parameters']:
            node['parameters']['sendHeaders'] = False
        if 'headerParameters' in node['parameters']:
            del node['parameters']['headerParameters']
        print(f"Fixed node: {node['name']}")

    if node['name'] == 'Update Status - Failed':
        # Remove sendHeaders option and manual header parameters
        if 'sendHeaders' in node['parameters']:
            node['parameters']['sendHeaders'] = False
        if 'headerParameters' in node['parameters']:
            del node['parameters']['headerParameters']
        print(f"Fixed node: {node['name']}")

# Save fixed workflow
with open(r'C:\myhost-bizmate\workflow_fixed.json', 'w', encoding='utf-8') as f:
    json.dump(workflow, f, indent=2)

print("Workflow fixed and saved")
