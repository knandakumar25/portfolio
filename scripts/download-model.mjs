import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';
import ollama from 'ollama';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const modelsDir = path.resolve(projectRoot, 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

console.log(`=======================================================`);
console.log(`[Ollama] Project Local Models Directory:`);
console.log(`         ${modelsDir}`);
console.log(`=======================================================`);

// Helper to check if Ollama daemon is currently responding
function checkDaemon() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:11434/api/tags', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Ensure Ollama daemon is running with OLLAMA_MODELS scoped to this project
async function ensureDaemonRunning() {
  const isRunning = await checkDaemon();
  if (isRunning) {
    console.log('[Ollama] Daemon is already running.');
    return null;
  }

  console.log('[Ollama] Launching daemon with OLLAMA_MODELS set to project folder...');
  const daemonProcess = spawn('ollama', ['serve'], {
    env: {
      ...process.env,
      OLLAMA_MODELS: modelsDir,
    },
    stdio: 'ignore',
    detached: true,
  });
  daemonProcess.unref();

  // Poll until ready
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await checkDaemon()) {
      console.log('[Ollama] Daemon is ready on http://127.0.0.1:11434');
      return daemonProcess;
    }
  }

  throw new Error('Failed to start Ollama daemon after 30 seconds.');
}

async function main() {
  const modelName = process.argv[2] || 'llama3.2:3b';
  await ensureDaemonRunning();

  console.log(`\n[Ollama] Pulling model "${modelName}"...`);
  console.log(`[Ollama] Destination: ${modelsDir}\n`);

  try {
    const stream = await ollama.pull({ model: modelName, stream: true });
    let lastPercent = -1;

    for await (const part of stream) {
      if (part.total && part.completed) {
        const percent = Math.floor((part.completed / part.total) * 100);
        if (percent !== lastPercent && (percent % 10 === 0 || percent === 100)) {
          const completedMB = (part.completed / (1024 * 1024)).toFixed(1);
          const totalMB = (part.total / (1024 * 1024)).toFixed(1);
          console.log(`[Ollama] ${part.status || 'Downloading'}: ${percent}% (${completedMB} MB / ${totalMB} MB)`);
          lastPercent = percent;
        }
      } else if (part.status && part.status !== 'downloading') {
        console.log(`[Ollama] ${part.status}`);
      }
    }

    console.log(`\n[Ollama] SUCCESS: "${modelName}" has been downloaded to:`);
    console.log(`         ${modelsDir}`);

    // Verify files on disk
    const files = fs.readdirSync(modelsDir);
    console.log(`[Ollama] Files in local models folder:`, files);
  } catch (err) {
    console.error('[Ollama] Error downloading model:', err.message);
    process.exit(1);
  }
}

main();
