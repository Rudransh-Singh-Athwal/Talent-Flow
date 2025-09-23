const generateId = () => Math.random().toString(36).substr(2, 9);
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
};

const jobTitles = [
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "UI Designer",
  "Marketing Manager",
  "Sales Executive",
  "HR Manager",
  "Business Analyst",
  "QA Engineer",
  "Mobile App Developer",
  "Cloud Architect",
  "Security Engineer",
  "Technical Writer",
  "Project Manager",
  "Scrum Master",
  "Data Analyst",
  "Machine Learning Engineer",
  "Customer Success Manager",
  "Digital Marketing Specialist",
  "Content Strategist",
];

const jobTags = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "AWS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "REST API",
  "Microservices",
  "Agile",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Senior",
  "Junior",
  "Mid-level",
  "Team Lead",
  "Startup",
  "Enterprise",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "SaaS",
];

const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Sage",
  "Reese",
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Charlotte",
  "Mia",
  "Amelia",
  "Harper",
  "Evelyn",
  "Liam",
  "Noah",
  "Oliver",
  "Elijah",
  "William",
  "James",
  "Benjamin",
  "Lucas",
  "Henry",
  "Alexander",
  "Aria",
  "Luna",
  "Grace",
  "Chloe",
  "Penelope",
  "Layla",
  "Riley",
  "Zoey",
  "Nora",
  "Lily",
  "Mason",
  "Ethan",
  "Daniel",
  "Matthew",
  "Aiden",
  "Jackson",
  "Logan",
  "David",
  "Joseph",
  "Samuel",
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
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
];

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

// Generate Jobs
const generateJobs = (count = 25) => {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const createdDate = new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ); // Last 90 days
    jobs.push({
      id: generateId(),
      title: randomElement(jobTitles),
      slug:
        jobTitles[i % jobTitles.length].toLowerCase().replace(/\s+/g, "-") +
        "-" +
        i,
      status: Math.random() > 0.3 ? "active" : "archived", // 70% active
      tags: randomElements(jobTags, Math.floor(Math.random() * 5) + 2), // 2-6 tags
      order: i + 1,
      description: `We are looking for an experienced professional to join our team. This role offers great opportunities for growth and learning in a dynamic environment.`,
      requirements: [
        "Bachelor's degree in relevant field",
        "3+ years of experience",
        "Strong communication skills",
        "Team player with leadership potential",
      ],
      location: randomElement([
        "Remote",
        "New York, NY",
        "San Francisco, CA",
        "Austin, TX",
        "Boston, MA",
        "Seattle, WA",
      ]),
      salary: {
        min: 60000 + Math.floor(Math.random() * 100000),
        max: 100000 + Math.floor(Math.random() * 150000),
        currency: "USD",
      },
      department: randomElement([
        "Engineering",
        "Product",
        "Marketing",
        "Sales",
        "HR",
        "Operations",
      ]),
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(
        createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }
  return jobs;
};

// Generate Candidates
const generateCandidates = (count = 1000, jobs) => {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const appliedDate = new Date(
      Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
    ); // Last 60 days

    candidates.push({
      id: generateId(),
      name: `${firstName} ${lastName}`,
      email,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      jobId: randomElement(jobs).id,
      stage: randomElement(stages),
      resume: `https://example.com/resumes/${firstName}-${lastName}-resume.pdf`,
      linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      portfolio:
        Math.random() > 0.7
          ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev`
          : null,
      notes: [],
      appliedAt: appliedDate.toISOString(),
      updatedAt: new Date(
        appliedDate.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      skills: randomElements(jobTags, Math.floor(Math.random() * 8) + 3), // 3-10 skills
      experience: Math.floor(Math.random() * 15) + 1, // 1-15 years
      location: randomElement([
        "Remote",
        "New York, NY",
        "San Francisco, CA",
        "Austin, TX",
        "Boston, MA",
        "Seattle, WA",
        "Chicago, IL",
        "Denver, CO",
      ]),
    });
  }
  return candidates;
};

// Generate Timeline entries for candidates
const generateCandidateTimelines = (candidates) => {
  const timelines = {};

  candidates.forEach((candidate) => {
    const timeline = [];
    const appliedDate = new Date(candidate.appliedAt);

    // Add applied entry
    timeline.push({
      id: generateId(),
      candidateId: candidate.id,
      stage: "applied",
      timestamp: appliedDate.toISOString(),
      action: "applied",
      notes: "Candidate submitted application",
    });

    // Add random progression entries based on current stage
    const stageIndex = stages.indexOf(candidate.stage);
    let currentDate = new Date(appliedDate);

    for (let i = 1; i <= stageIndex; i++) {
      currentDate = new Date(
        currentDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
      ); // 0-7 days later
      timeline.push({
        id: generateId(),
        candidateId: candidate.id,
        stage: stages[i],
        previousStage: stages[i - 1],
        timestamp: currentDate.toISOString(),
        action: "stage_change",
        notes: `Moved from ${stages[i - 1]} to ${stages[i]}`,
        automated: Math.random() > 0.7, // Some entries are automated
      });
    }

    // Add some notes entries
    if (Math.random() > 0.6) {
      timeline.push({
        id: generateId(),
        candidateId: candidate.id,
        timestamp: new Date(
          currentDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        action: "note_added",
        notes: randomElement([
          "Great technical interview performance",
          "Strong cultural fit, team loves them",
          "Impressive portfolio and GitHub contributions",
          "Excellent communication skills",
          "Needs some improvement in technical areas",
          "Very enthusiastic about the role",
        ]),
        author: randomElement([
          "John Doe",
          "Jane Smith",
          "Mike Johnson",
          "Sarah Williams",
        ]),
      });
    }

    timelines[candidate.id] = timeline;
  });

  return timelines;
};

// Generate Sample Assessments
const generateAssessments = (jobs) => {
  const assessments = {};
  const questionTypes = [
    "single-choice",
    "multi-choice",
    "short-text",
    "long-text",
    "numeric",
    "file-upload",
  ];

  // Create assessments for first 3 jobs
  jobs.slice(0, 3).forEach((job) => {
    const sections = [];

    // Technical Skills Section
    sections.push({
      id: generateId(),
      title: "Technical Skills",
      description: "Assess your technical knowledge and experience",
      questions: [
        {
          id: generateId(),
          type: "single-choice",
          question:
            "How many years of professional development experience do you have?",
          required: true,
          options: [
            "0-1 years",
            "2-3 years",
            "4-6 years",
            "7-10 years",
            "10+ years",
          ],
        },
        {
          id: generateId(),
          type: "multi-choice",
          question: "Which programming languages are you proficient in?",
          required: true,
          options: [
            "JavaScript",
            "Python",
            "Java",
            "C#",
            "Go",
            "Rust",
            "TypeScript",
            "PHP",
          ],
        },
        {
          id: generateId(),
          type: "short-text",
          question: "What is your preferred development framework?",
          required: false,
          maxLength: 100,
        },
        {
          id: generateId(),
          type: "long-text",
          question:
            "Describe a challenging project you worked on and how you solved it.",
          required: true,
          maxLength: 1000,
        },
        {
          id: generateId(),
          type: "numeric",
          question: "How would you rate your problem-solving skills? (1-10)",
          required: true,
          min: 1,
          max: 10,
        },
      ],
    });

    // Behavioral Section
    sections.push({
      id: generateId(),
      title: "Behavioral Questions",
      description: "Help us understand your work style and personality",
      questions: [
        {
          id: generateId(),
          type: "single-choice",
          question: "Do you prefer working in teams or independently?",
          required: true,
          options: [
            "Strongly prefer teams",
            "Somewhat prefer teams",
            "No preference",
            "Somewhat prefer independent",
            "Strongly prefer independent",
          ],
        },
        {
          id: generateId(),
          type: "long-text",
          question:
            "Tell us about a time when you had to learn something new quickly.",
          required: true,
          maxLength: 800,
          conditional: {
            dependsOn: null, // Always show
          },
        },
        {
          id: generateId(),
          type: "single-choice",
          question: "How do you handle tight deadlines?",
          required: true,
          options: [
            "I thrive under pressure",
            "I work well with some pressure",
            "I prefer planned timelines",
            "I struggle with tight deadlines",
          ],
        },
      ],
    });

    // Availability Section
    sections.push({
      id: generateId(),
      title: "Availability & Logistics",
      description: "Let us know about your availability and preferences",
      questions: [
        {
          id: generateId(),
          type: "single-choice",
          question: "What is your preferred work arrangement?",
          required: true,
          options: [
            "Fully remote",
            "Hybrid (2-3 days office)",
            "Mostly office (4-5 days)",
            "Fully office-based",
          ],
        },
        {
          id: generateId(),
          type: "numeric",
          question:
            "How many weeks notice do you need to give your current employer?",
          required: true,
          min: 0,
          max: 12,
        },
        {
          id: generateId(),
          type: "file-upload",
          question: "Please upload your latest resume",
          required: true,
          acceptedTypes: [".pdf", ".doc", ".docx"],
        },
        {
          id: generateId(),
          type: "short-text",
          question: "What are your salary expectations?",
          required: false,
          maxLength: 50,
        },
      ],
    });

    assessments[job.id] = {
      jobId: job.id,
      title: `Assessment for ${job.title}`,
      description: `Complete this assessment to help us evaluate your fit for the ${job.title} position.`,
      sections,
      timeLimit: 45, // minutes
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  });

  return assessments;
};

// Initialize seed data
const jobs = generateJobs(25);
const candidates = generateCandidates(1000, jobs);
const candidateTimelines = generateCandidateTimelines(candidates);
const assessments = generateAssessments(jobs);

export const seedData = {
  jobs,
  candidates,
  candidateTimelines,
  assessments,
  assessmentResponses: {}, // Will store candidate responses
};

// Console log for debugging
console.log("Seed data generated:", {
  jobs: jobs.length,
  candidates: candidates.length,
  assessments: Object.keys(assessments).length,
  timelines: Object.keys(candidateTimelines).length,
});
