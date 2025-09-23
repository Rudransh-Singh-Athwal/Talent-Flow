import { http, HttpResponse } from "msw";
import storageService from "../services/storage";

// Utility to add artificial delay
const delay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 200));

// Utility to simulate errors
const shouldError = () => Math.random() < 0.05;

export const handlers = [
  // Jobs endpoints
  http.get("/api/jobs", async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    const url = new URL(request.url);
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
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.get("/api/jobs/:id", async ({ params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const job = await storageService.getJob(params.id);
      if (!job) {
        return HttpResponse.json({ error: "Job not found" }, { status: 404 });
      }
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.post("/api/jobs", async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const jobData = await request.json();
      const job = await storageService.createJob(jobData);
      return HttpResponse.json(job, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.patch("/api/jobs/:id", async ({ params, request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const updates = await request.json();
      const job = await storageService.updateJob(params.id, updates);
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.patch("/api/jobs/:id/reorder", async ({ request }) => {
    await delay();

    // Higher error rate for reorder to test rollback
    if (Math.random() < 0.1) {
      return HttpResponse.json({ error: "Reorder failed" }, { status: 500 });
    }

    try {
      const { fromOrder, toOrder } = await request.json();
      await storageService.reorderJobs(fromOrder, toOrder);
      return HttpResponse.json({ success: true });
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  // Candidates endpoints
  http.get("/api/candidates", async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    const url = new URL(request.url);
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
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.get("/api/candidates/:id", async ({ params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const candidate = await storageService.getCandidate(params.id);
      if (!candidate) {
        return HttpResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(candidate);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.patch("/api/candidates/:id", async ({ params, request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const updates = await request.json();
      const candidate = await storageService.updateCandidate(
        params.id,
        updates
      );
      return HttpResponse.json(candidate);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.get("/api/candidates/:id/timeline", async ({ params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const timeline = await storageService.getCandidateTimeline(params.id);
      return HttpResponse.json(timeline);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  // Assessments endpoints
  http.get("/api/assessments/:jobId", async ({ params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const assessment = await storageService.getAssessment(params.jobId);
      return HttpResponse.json(assessment || null);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.put("/api/assessments/:jobId", async ({ params, request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const assessmentData = await request.json();
      const assessment = await storageService.saveAssessment(
        params.jobId,
        assessmentData
      );
      return HttpResponse.json(assessment);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  http.post("/api/assessments/:jobId/submit", async ({ params, request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    try {
      const { candidateId, responses } = await request.json();
      const result = await storageService.submitAssessmentResponse(
        params.jobId,
        candidateId,
        responses
      );
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),
];
