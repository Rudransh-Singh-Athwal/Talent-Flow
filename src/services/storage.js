import Dexie from "dexie";

// IndexedDB setup
const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "++id, title, slug, status, tags, order, createdAt",
  candidates: "++id, name, email, stage, jobId, createdAt",
  candidateTimeline: "++id, candidateId, stage, timestamp, notes",
  assessments: "++id, jobId, title, sections",
  assessmentResponses: "++id, assessmentId, candidateId, responses",
});

// Storage service class
class StorageService {
  async init() {
    await db.open();

    // Check if we need to seed data
    const jobCount = await db.jobs.count();
    if (jobCount === 0) {
      await this.seedData();
    }
  }

  // Jobs
  async getJobs({
    search = "",
    status = "",
    page = 1,
    pageSize = 10,
    sort = "order",
  } = {}) {
    let query = db.jobs.orderBy(sort);

    if (status) {
      query = query.filter((job) => job.status === status);
    }

    if (search) {
      query = query.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    const offset = (page - 1) * pageSize;
    const jobs = await query.offset(offset).limit(pageSize).toArray();
    const total = await query.count();

    return {
      data: jobs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getJob(id) {
    return await db.jobs.get(parseInt(id));
  }

  async createJob(jobData) {
    const maxOrder = await db.jobs.orderBy("order").last();
    const job = {
      ...jobData,
      order: maxOrder ? maxOrder.order + 1 : 1,
      createdAt: new Date(),
    };
    const id = await db.jobs.add(job);
    return await db.jobs.get(id);
  }

  async updateJob(id, updates) {
    await db.jobs.update(parseInt(id), updates);
    return await db.jobs.get(parseInt(id));
  }

  async reorderJobs(fromOrder, toOrder) {
    const jobs = await db.jobs.orderBy("order").toArray();

    // Simulate occasional failure
    if (Math.random() < 0.1) {
      throw new Error("Reorder failed");
    }

    // Update orders
    for (let job of jobs) {
      if (job.order === fromOrder) {
        job.order = toOrder;
      } else if (
        fromOrder < toOrder &&
        job.order > fromOrder &&
        job.order <= toOrder
      ) {
        job.order -= 1;
      } else if (
        fromOrder > toOrder &&
        job.order >= toOrder &&
        job.order < fromOrder
      ) {
        job.order += 1;
      }
    }

    // Bulk update
    await db.transaction("rw", db.jobs, async () => {
      for (let job of jobs) {
        await db.jobs.update(job.id, { order: job.order });
      }
    });
  }

  // Candidates
  async getCandidates({
    search = "",
    stage = "",
    page = 1,
    pageSize = 50,
  } = {}) {
    let query = db.candidates.orderBy("createdAt").reverse();

    if (stage) {
      query = query.filter((candidate) => candidate.stage === stage);
    }

    if (search) {
      query = query.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const offset = (page - 1) * pageSize;
    const candidates = await query.offset(offset).limit(pageSize).toArray();
    const total = await query.count();

    return {
      data: candidates,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getCandidate(id) {
    return await db.candidates.get(parseInt(id));
  }

  async updateCandidate(id, updates) {
    const candidate = await db.candidates.get(parseInt(id));

    // Add timeline entry if stage changed
    if (updates.stage && updates.stage !== candidate.stage) {
      await db.candidateTimeline.add({
        candidateId: parseInt(id),
        stage: updates.stage,
        timestamp: new Date(),
        notes: updates.notes || "",
      });
    }

    await db.candidates.update(parseInt(id), updates);
    return await db.candidates.get(parseInt(id));
  }

  async getCandidateTimeline(candidateId) {
    return await db.candidateTimeline
      .where("candidateId")
      .equals(parseInt(candidateId))
      .orderBy("timestamp")
      .toArray();
  }

  // Assessments
  async getAssessment(jobId) {
    return await db.assessments.where("jobId").equals(parseInt(jobId)).first();
  }

  async saveAssessment(jobId, assessmentData) {
    const existing = await db.assessments
      .where("jobId")
      .equals(parseInt(jobId))
      .first();

    if (existing) {
      await db.assessments.update(existing.id, assessmentData);
      return await db.assessments.get(existing.id);
    } else {
      const id = await db.assessments.add({
        jobId: parseInt(jobId),
        ...assessmentData,
      });
      return await db.assessments.get(id);
    }
  }

  async submitAssessmentResponse(assessmentId, candidateId, responses) {
    const id = await db.assessmentResponses.add({
      assessmentId: parseInt(assessmentId),
      candidateId: parseInt(candidateId),
      responses,
      submittedAt: new Date(),
    });
    return await db.assessmentResponses.get(id);
  }

  // Seed data
  async seedData() {
    console.log("Seeding data...");

    // Create jobs
    const jobTitles = [
      "Senior Frontend Developer",
      "Backend Engineer",
      "Full Stack Developer",
      "DevOps Engineer",
      "UI/UX Designer",
      "Product Manager",
      "Data Scientist",
      "Mobile Developer",
      "QA Engineer",
      "Technical Lead",
      "Software Architect",
      "Sales Manager",
      "Marketing Specialist",
      "HR Generalist",
      "Business Analyst",
      "Customer Success Manager",
      "Content Writer",
      "Graphic Designer",
      "System Administrator",
      "Database Administrator",
      "Security Engineer",
      "Project Manager",
      "Scrum Master",
      "Solutions Engineer",
      "Support Engineer",
    ];

    const tags = [
      "Remote",
      "Senior",
      "Junior",
      "Full-time",
      "Part-time",
      "Contract",
      "Urgent",
    ];
    const statuses = ["active", "archived"];

    const jobs = [];
    for (let i = 0; i < 25; i++) {
      jobs.push({
        title: jobTitles[i],
        slug: jobTitles[i].toLowerCase().replace(/\s+/g, "-") + "-" + i,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
        order: i + 1,
        createdAt: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
        ),
      });
    }

    await db.jobs.bulkAdd(jobs);
    console.log("Jobs seeded");

    // Create candidates
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const firstNames = [
      "John",
      "Jane",
      "Mike",
      "Sarah",
      "David",
      "Lisa",
      "Chris",
      "Emma",
      "Tom",
      "Anna",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];

    const candidates = [];
    const seededJobs = await db.jobs.toArray();

    for (let i = 0; i < 1000; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomJob =
        seededJobs[Math.floor(Math.random() * seededJobs.length)];

      candidates.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        stage: stages[Math.floor(Math.random() * stages.length)],
        jobId: randomJob.id,
        createdAt: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ),
      });
    }

    await db.candidates.bulkAdd(candidates);
    console.log("Candidates seeded");

    // Create sample assessments
    const sampleAssessments = [
      {
        jobId: seededJobs[0].id,
        title: "Frontend Developer Assessment",
        sections: [
          {
            title: "Technical Skills",
            questions: [
              {
                type: "single-choice",
                question: "Which JavaScript framework do you prefer?",
                options: ["React", "Vue", "Angular"],
                required: true,
              },
              {
                type: "multi-choice",
                question: "Select all CSS preprocessors you have used:",
                options: ["Sass", "Less", "Stylus"],
                required: false,
              },
              {
                type: "short-text",
                question: "Years of experience with React?",
                maxLength: 50,
                required: true,
              },
              {
                type: "long-text",
                question: "Describe your experience with responsive design",
                maxLength: 500,
                required: true,
              },
              {
                type: "numeric",
                question: "Rate your JavaScript skills (1-10)",
                min: 1,
                max: 10,
                required: true,
              },
            ],
          },
        ],
      },
    ];

    await db.assessments.bulkAdd(sampleAssessments);
    console.log("Assessments seeded");

    console.log("Data seeding complete");
  }

  // Utility method to clear all data
  async clearAll() {
    await db.delete();
    await db.open();
  }
}

export default new StorageService();
