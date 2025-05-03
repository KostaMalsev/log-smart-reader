const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'file-lifecycle.log');
const fileEntities = {};
let fileCounter = 0;

const lifecycleSteps = [
  'created',
  'written',
  'read',
  'updated',
  'deleted'
];

// Reset log on startup (optional)
fs.writeFileSync(logFile, '', 'utf8');

function log(entityId, action) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${entityId}] ${action}`;
  fs.appendFileSync(logFile, line + '\n', 'utf8');
  console.log(line);
}

function simulateLifecycle() {
  // 50% chance to create new file entity
  if (Math.random() < 0.5 || Object.keys(fileEntities).length === 0) {
    const fileId = `file-${++fileCounter}`;
    fileEntities[fileId] = 0;
    log(fileId, lifecycleSteps[0]); // 'created'
  }

  // Advance lifecycle of a random file
  const ids = Object.keys(fileEntities);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  const currentStep = fileEntities[randomId];

  if (currentStep < lifecycleSteps.length - 1) {
    fileEntities[randomId]++;
    log(randomId, lifecycleSteps[fileEntities[randomId]]);
  } else {
    // Lifecycle complete, remove file from tracking
    delete fileEntities[randomId];
  }
}

// Generate a lifecycle log entry every 1 second
setInterval(simulateLifecycle, 1000);
