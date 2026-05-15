import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Log server mode
  console.log(`[Server] Starting in ${process.env.NODE_ENV === "production" ? "PRODUCTION" : "DEVELOPMENT"} mode`);

  // Health check endpoints
  const healthHandler = (req: express.Request, res: express.Response) => {
    res.json({ 
      status: "ok", 
      message: "Server is running",
      mode: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  };

  app.get("/health", healthHandler);
  app.get("/api/health", healthHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Accessible at http://0.0.0.0:${PORT}`);
    if (process.env.NODE_ENV === "production") {
      console.log(`[Server] Serving static files from: ${path.join(process.cwd(), "dist")}`);
    }
  });
}

startServer();
