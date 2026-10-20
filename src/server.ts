import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCheckIn, getAll, getCheckIn, getPlan, makePlan } from "./care.js";
import { makeFamilyBrief } from "./bedrock.js";

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
app.use(cors()); app.use(express.json()); app.use(express.static(path.join(root, "public")));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/dashboard", (_req, res) => res.json({ checkIns: getAll() }));
app.post("/api/checkins", (req, res) => {
  const { person, relation, update, consent } = req.body;
  if (!person || !relation || !update || !["share", "private"].includes(consent)) return res.status(400).json({ error: "Complete every field." });
  res.status(201).json(createCheckIn({ person, relation, update, consent }));
});
app.post("/api/checkins/:id/plan", (req, res) => {
  const checkIn = getCheckIn(req.params.id); if (!checkIn) return res.status(404).json({ error: "Check-in not found." });
  res.json({ tasks: makePlan(checkIn) });
});
app.post("/api/checkins/:id/brief", async (req, res) => {
  const checkIn = getCheckIn(req.params.id); if (!checkIn) return res.status(404).json({ error: "Check-in not found." });
  try { res.json({ brief: await makeFamilyBrief(checkIn, getPlan(checkIn.id)) }); }
  catch { res.status(502).json({ error: "The AI brief is unavailable. Your saved check-in and plan are still available." }); }
});
app.listen(3000, () => console.log("CareCircle running at http://localhost:3000"));
