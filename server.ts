import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.ts';
import bustrackerHandler from './api/bustracker.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Serverless API routes
  app.all('/api/health', (req, res) => {
    return healthHandler(req, res);
  });

  app.all('/api/bustracker', (req, res) => {
    return bustrackerHandler(req, res);
  });

  // Mount Vite development middlewares in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SG Transit Next] Server listening on port ${PORT}`);
    console.log(`- Health Check: http://localhost:${PORT}/api/health`);
    console.log(`- Bus Tracker:  http://localhost:${PORT}/api/bustracker?endpoint=arrival&busStopCode=01012`);
  });
}

startServer().catch((err) => {
  console.error('[SG Transit Next] Failed to start server:', err);
  process.exit(1);
});
