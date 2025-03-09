const fs = require('fs-extra');
const path = require('path');

const templatePath = path.join(__dirname, '../clients/client-template');
const clientsPath = path.join(__dirname, '../clients');

function setupClient(clientName) {
  const clientPath = path.join(clientsPath, clientName);

  if (fs.existsSync(clientPath)) {
    console.error(`Client '${clientName}' already exists.`);
    return;
  }

  // Copy template to new client folder
  fs.copySync(templatePath, clientPath);

  // Update client-config.json
  const configPath = path.join(clientPath, 'config', 'client-config.json');
  const config = require(configPath);
  config.Client_Name = clientName;
  config.clientID = clientName.toUpperCase();
  config.Org_ID = `${clientName}_001`;
  config.Client_Slug = clientName.toLowerCase().replace(/\s+/g, '-');
  config.actionID = `${clientName.toUpperCase()}_ACTION_ID`;
  fs.writeJsonSync(configPath, config, { spaces: 2 });

  console.log(`Client '${clientName}' has been set up.`);
}

// Usage: node setup-client.js clientName
const clientName = process.argv[2];
if (!clientName) {
  console.error('Please provide a client name.');
  process.exit(1);
}

setupClient(clientName); 