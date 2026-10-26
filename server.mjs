import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn } from 'child_process';
import ollama from 'ollama';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.resolve(__dirname, 'models');
const PORT = process.env.PORT || 8000;
const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3.2:3b';

// System prompt grounding the assistant in Karthik's actual portfolio data
const SYSTEM_PROMPT = `You are the AI Assistant for Karthik Nandakumar's professional portfolio website.
Your role is to answer questions from recruiters, hiring managers, and visitors about Karthik's experience, skills, education, and projects.
Respond professionally, accurately, and concisely.

Key Information About Karthik Nandakumar:
- Title: Software Engineer & Systems Researcher
- Current Status: Software Development & Implementation Intern at LlamaPress AI (October 2026 - Present), open to full-time roles.
- Education:
  • Master of Science in Computer Science (Pursuing) at Arizona State University (Ira A. Fulton Schools of Engineering), GPA: 4.00.
  • Bachelor of Science in Computer Science (Summa Cum Laude) from North Carolina State University, GPA: 3.769 (June 2022 - December 2025).
- Work Experience:
  • LlamaPress AI: Software Development & Implementation Intern (October 2026 - Present).
  • SunTec Business Solutions: Project Intern (May 2025 - August 2025). Worked on banking PDF invoice generation, JDOM upgrades, vulnerability mitigation in UI HTTP client libraries, and CAMT.086 statement issue resolution.
- Key Technical Projects:
  • Autonomous Cargo Router Microservice: Event-driven cargo routing in Java 25 & Apache Kafka 4.2 (KRaft mode). JDK virtual threads, evaluated weather risk across 34 North American hubs, O(k log k) path resolution via custom Power-of-Two Min-Heap, 36 Mockito tests.
  • WolfCafe Enterprise Platform: Coffee shop ordering platform with Spring Boot backend, role-based access control (RBAC), and React frontend.
  • Smart Home Hand Gesture CNN: Real-time hand gesture recognition utilizing deep convolutional neural networks and OpenCV.
  • Game & Interactive Engines: 7+ releases including The Broken Kingdom, Recourse, and Endgame built with Godot, Inkle, and state machine architectures.
- Core Technical Stack:
  • Languages: Java 25, Python, C, C++, JavaScript/TypeScript, SQL, GDScript, Assembly, Prolog.
  • Frameworks & Tools: Spring Boot 3.5, Apache Kafka 4.2, React 19, Node.js, Docker, Jenkins, Git, Maven, PostgreSQL, MySQL.
- Contact Details:
  • Email: karthiknk21@gmail.com
  • Phone: +1 (215) 666-3741
  • Location: Cary, North Carolina, 27519, United States
  • Work Authorization: Authorized to work in the United States and India.

Keep answers concise, direct, helpful, and courteous. Only state facts supported by the portfolio.`;

// Check if Ollama daemon is active
function isOllamaRunning() {
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

// Launch Ollama daemon with OLLAMA_MODELS strictly scoped to project models directory
async function ensureOllamaRunning() {
  const running = await isOllamaRunning();
  if (running) return;

  console.log(`[Server] Starting Ollama with OLLAMA_MODELS=${modelsDir}`);
  const daemon = spawn('ollama', ['serve'], {
    env: {
      ...process.env,
      OLLAMA_MODELS: modelsDir,
    },
    stdio: 'ignore',
    detached: true,
  });
  daemon.unref();

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await isOllamaRunning()) {
      console.log('[Server] Ollama daemon connected.');
      return;
    }
  }
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      model: MODEL_NAME,
      modelsDir: modelsDir,
      ollamaActive: await isOllamaRunning(),
    }));
    return;
  }

  // Chat endpoint
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const userMessages = parsed.messages || [];

        await ensureOllamaRunning();

        // Format messages with system context
        const conversation = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...userMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        ];

        console.log(`[Server] Prompting ${MODEL_NAME} (history: ${userMessages.length} msgs)...`);
        const result = await ollama.chat({
          model: MODEL_NAME,
          messages: conversation,
        });

        const reply = result.message?.content || 'No response generated.';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response: reply }));
      } catch (err) {
        console.error('[Server] Chat Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`[Server] Portfolio Ollama Chat Server active on http://127.0.0.1:${PORT}`);
  console.log(`[Server] Model: ${MODEL_NAME}`);
  console.log(`[Server] Models Directory: ${modelsDir}`);
  console.log(`=======================================================`);
  await ensureOllamaRunning();
});
