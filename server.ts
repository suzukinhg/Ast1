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

  // GEO Score check endpoint
  app.post("/api/geoScore", (req: express.Request, res: express.Response) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ code: 400, msg: "关键词内容不能为空", data: null });
      }

      // 关键词简单校验逻辑 (简单模拟)
      if (content.length < 2) {
         return res.status(400).json({ code: 400, msg: "关键词过短，请重新输入", data: null });
      }

      // Simulate API latency
      setTimeout(() => {
        // Generate mock scores between 0 and 100
        const generateScore = () => Math.floor(Math.random() * 60) + 40; // 40-100 range for realism

        res.json({
          code: 200,
          msg: "success",
          data: {
            aiVisible: generateScore(),
            authority: generateScore(),
            credibility: generateScore(),
            brandWeight: generateScore(),
            infoComplete: generateScore()
          }
        });
      }, 1000);
    } catch (error) {
      res.status(500).json({ code: 500, msg: "Server Error", data: null });
    }
  });

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
