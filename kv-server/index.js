const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const TOML = require('@iarna/toml');

const app = express();
app.use(cors({
  origin: ['http://localhost:3001', 'https://kv-manager.vercel.app']
}));
app.use(express.json());

// Default values
const DEFAULT_KV_BINDING = "USER_PROFILE_INTERACTICO";
const KV_PERSIST_PATH = "~/Desktop/wrangler-data";

// Function to run wrangler CLI commands
function runWranglerCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
}

// Function to get KV settings from request
function getKVSettings(req) {
  return {
    binding: req.headers['x-kv-binding'] || DEFAULT_KV_BINDING,
    persistPath: KV_PERSIST_PATH
  };
}

// GET endpoint to list all keys
app.get("/kv", async (req, res) => {
  const { binding, persistPath } = getKVSettings(req);
  const command = `wrangler kv key list --binding=${binding} --local --persist-to ${persistPath}`;
  try {
    const result = await runWranglerCommand(command);
    const keys = JSON.parse(result);
    res.json(keys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// GET endpoint to retrieve a key
app.get("/kv/:key", async (req, res) => {
  const { binding, persistPath } = getKVSettings(req);
  const key = req.params.key;
  const command = `wrangler kv:key get --binding=${binding} --local "${key}" --persist-to ${persistPath}`;
  try {
    const result = await runWranglerCommand(command);
    res.json({ key, value: result.trim() });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// POST endpoint to create or update a key-value pair
app.post("/kv", async (req, res) => {
  const { binding, persistPath } = getKVSettings(req);
  const { key, value } = req.body;
  const command = `wrangler kv key put --binding=${binding} --local "${key}" "${value}" --persist-to ${persistPath}`;
  try {
    console.log(command);
    const result = await runWranglerCommand(command);
    res.json({ key, value, message: result.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// DELETE endpoint to delete a key
app.delete("/kv/:key", async (req, res) => {
  const { binding, persistPath } = getKVSettings(req);
  const key = req.params.key;
  const command = `wrangler kv key delete --binding=${binding} --local "${key}" --persist-to ${persistPath}`;
  try {
    const result = await runWranglerCommand(command);
    res.json({ key, message: result.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// New endpoint to get KV namespace information
app.get("/kv-namespaces", (req, res) => {
  try {
    const tomlPath = path.join(__dirname, '../wrangler.toml');
    const tomlContent = fs.readFileSync(tomlPath, 'utf-8');
    const config = TOML.parse(tomlContent);
    
    if (config.kv_namespaces) {
      res.json(config.kv_namespaces);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading wrangler.toml:', error);
    res.status(500).json({ error: 'Failed to read KV namespace configuration' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});