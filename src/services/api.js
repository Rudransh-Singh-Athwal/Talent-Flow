// services/api.js
class ApiService {
  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request: ${config.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, config);

      console.log(`API Response: ${response.status} for ${url}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  // Jobs API
  async getJobs(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });

    const query = searchParams.toString();
    return this.request(`/jobs${query ? `?${query}` : ""}`);
  }

  async getJob(id) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(jobData) {
    return this.request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id, updates) {
    return this.request(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async reorderJobs(fromOrder, toOrder) {
    return this.request(`/jobs/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ fromOrder, toOrder }),
    });
  }

  // Candidates API
  async getCandidates(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });

    const query = searchParams.toString();
    return this.request(`/candidates${query ? `?${query}` : ""}`);
  }

  async getCandidate(id) {
    return this.request(`/candidates/${id}`);
  }

  async updateCandidate(id, updates) {
    return this.request(`/candidates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async getCandidateTimeline(id) {
    return this.request(`/candidates/${id}/timeline`);
  }

  // Assessments API
  async getAssessment(jobId) {
    return this.request(`/assessments/${jobId}`);
  }

  async saveAssessment(jobId, assessmentData) {
    return this.request(`/assessments/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(assessmentData),
    });
  }

  async submitAssessment(jobId, candidateId, responses) {
    return this.request(`/assessments/${jobId}/submit`, {
      method: "POST",
      body: JSON.stringify({ candidateId, responses }),
    });
  }
}

const apiService = new ApiService();
export default apiService;
