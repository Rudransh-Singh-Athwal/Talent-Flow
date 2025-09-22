import { http } from "msw";
import storageService from "../services/storage";

// Utility to add artificial delay
const delay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 200));

// Utility to simulate errors
const shouldError = () => Math.random() < 0.05;

export const handlers = [
  // Jobs endpoints
  http.get("/api/jobs", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;
    const sort = url.searchParams.get("sort") || "order";

    try {
      const result = await storageService.getJobs({
        search,
        status,
        page,
        pageSize,
        sort,
      });
      return res(ctx.json(result));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.get("/api/jobs/:id", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const job = await storageService.getJob(req.params.id);
      if (!job) {
        return res(ctx.status(404), ctx.json({ error: "Job not found" }));
      }
      return res(ctx.json(job));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.post("/api/jobs", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const jobData = await req.json();
      const job = await storageService.createJob(jobData);
      return res(ctx.status(201), ctx.json(job));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.patch("/api/jobs/:id", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const updates = await req.json();
      const job = await storageService.updateJob(req.params.id, updates);
      return res(ctx.json(job));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.patch("/api/jobs/:id/reorder", async (req, res, ctx) => {
    await delay();

    // Higher error rate for reorder to test rollback
    if (Math.random() < 0.1) {
      return res(ctx.status(500), ctx.json({ error: "Reorder failed" }));
    }

    try {
      const { fromOrder, toOrder } = await req.json();
      await storageService.reorderJobs(fromOrder, toOrder);
      return res(ctx.json({ success: true }));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  // Candidates endpoints
  http.get("/api/candidates", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize")) || 50;

    try {
      const result = await storageService.getCandidates({
        search,
        stage,
        page,
        pageSize,
      });
      return res(ctx.json(result));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.get("/api/candidates/:id", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const candidate = await storageService.getCandidate(req.params.id);
      if (!candidate) {
        return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));
      }
      return res(ctx.json(candidate));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.patch("/api/candidates/:id", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const updates = await req.json();
      const candidate = await storageService.updateCandidate(
        req.params.id,
        updates
      );
      return res(ctx.json(candidate));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.get("/api/candidates/:id/timeline", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const timeline = await storageService.getCandidateTimeline(req.params.id);
      return res(ctx.json(timeline));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  // Assessments endpoints
  http.get("/api/assessments/:jobId", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const assessment = await storageService.getAssessment(req.params.jobId);
      return res(ctx.json(assessment || null));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.put("/api/assessments/:jobId", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const assessmentData = await req.json();
      const assessment = await storageService.saveAssessment(
        req.params.jobId,
        assessmentData
      );
      return res(ctx.json(assessment));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),

  http.post("/api/assessments/:jobId/submit", async (req, res, ctx) => {
    await delay();

    if (shouldError()) {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    }

    try {
      const { candidateId, responses } = await req.json();
      const result = await storageService.submitAssessmentResponse(
        req.params.jobId,
        candidateId,
        responses
      );
      return res(ctx.json(result));
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: error.message }));
    }
  }),
];
