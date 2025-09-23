# TalentFlow - Mini Hiring Platform

A React-based hiring management platform that allows HR teams to manage jobs, candidates, and assessments without a backend.

## 🚀 Features

### Jobs Management

- ✅ Create, edit, and archive jobs
- ✅ Server-like pagination and filtering
- ✅ Drag-and-drop job reordering with optimistic updates
- ✅ Deep linking to specific jobs (`/jobs/:jobId`)
- ✅ Form validation (required title, unique slug)

### Candidates Management

- ✅ Virtualized list handling 1000+ candidates
- ✅ Client-side search (name/email) and server-like filtering
- ✅ Kanban board for stage management with drag-and-drop
- ✅ Candidate profile pages with timeline
- ✅ Stage transition tracking with notes

### Assessment Builder

- ✅ Job-specific assessment builder
- ✅ Multiple question types: single-choice, multi-choice, short text, long text, numeric, file upload
- ✅ Live preview pane showing fillable form
- ✅ Form validation (required fields, numeric ranges, max length)
- ✅ Conditional questions (show Q3 if Q1 === "Yes")
- ✅ Local persistence of builder state

## 🛠 Technical Implementation

### Architecture

- **Frontend**: React 18 with functional components and hooks
- **Routing**: React Router v6 with deep linking support
- **State Management**: React state + custom hooks
- **Drag & Drop**: @dnd-kit for modern drag-and-drop
- **Virtualization**: react-window for large candidate lists
- **Mock API**: MSW (Mock Service Worker) simulating REST endpoints
- **Storage**: Dexie (IndexedDB wrapper) for local persistence

### Mock API Endpoints

```
GET /api/jobs?search=&status=&page=&pageSize=&sort=
POST /api/jobs
PATCH /api/jobs/:id
PATCH /api/jobs/:id/reorder

GET /api/candidates?search=&stage=&page=&pageSize=
PATCH /api/candidates/:id
GET /api/candidates/:id/timeline

GET /api/assessments/:jobId
PUT /api/assessments/:jobId
POST /api/assessments/:jobId/submit
```

### Data Persistence

- All data persists in IndexedDB using Dexie
- MSW acts as network layer with artificial latency (200-1200ms)
- 5-10% error rate on write operations for testing
- Data survives browser refresh

### Seed Data

- 25 jobs (mixed active/archived)
- 1,000 candidates across different stages
- Sample assessments with 10+ questions each

## 📦 Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
npx create-react-app talentflow
cd talentflow
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install msw dexie react-router-dom react-window
npm install --save-dev @faker-js/faker
```

2. **Setup MSW:**

```bash
npx msw init public/ --save
```

3. **Replace the default files with the provided code structure**

4. **Start the development server:**

```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🏗 File Structure

```
src/
├── components/
│   ├── ui/
│   │   └── Modal.jsx
│   ├── jobs/
│   │   ├── JobsList.jsx
│   │   ├── JobForm.jsx
│   │   ├── JobCard.jsx
│   │   └── JobFilters.jsx
│   ├── candidates/
│   │   ├── CandidatesList.jsx
│   │   ├── KanbanBoard.jsx
│   │   └── Timeline.jsx
│   └── assessments/
│       ├── AssessmentBuilder.jsx
│       ├── AssessmentPreview.jsx
│       └── QuestionTypes.jsx
├── pages/
│   ├── JobsPage.jsx
│   ├── CandidatesPage.jsx
│   ├── CandidateProfilePage.jsx
│   └── AssessmentsPage.jsx
├── services/
│   └── storage.js
├── mocks/
│   ├── handlers.js
│   └── browser.js
├── App.jsx
├── App.css
└── index.js
```

## 🎯 Key Features Demo

### Jobs Management

- Navigate to `/jobs` to see paginated job listings
- Use filters to search by title/tags or filter by status
- Create new jobs with validation
- Drag jobs to reorder (with failure simulation)
- Archive/unarchive jobs

### Candidates

- View `/candidates` for virtualized list of 1000 candidates
- Switch between List and Kanban views
- Search by name/email, filter by stage
- Drag candidates between stages in Kanban view
- Click candidate names to view profile with timeline

### Assessments

- Go to `/assessments` to build job-specific assessments
- Add sections and various question types
- See live preview while building
- Test conditional questions and validation

## 🔧 Technical Decisions

### Why MSW over JSON Server?

- Better integration with React development workflow
- Realistic network simulation with latency/errors
- No separate server process needed

### Why Dexie over LocalStorage?

- Better performance for large datasets
- Structured queries and indexing
- Handles complex data relationships

### Why @dnd-kit over react-beautiful-dnd?

- Better accessibility support
- Modern React patterns (hooks-based)
- Better TypeScript support
- Still actively maintained

## 🐛 Known Issues & Limitations

1. **File Upload**: Currently just a placeholder (no actual file handling)
2. **@mentions**: Renders @mentions but no live suggestions
3. **Assessment Conditions**: Simple string evaluation (security risk in production)
4. **Mobile UX**: Basic responsive design, could be improved
5. **Error Handling**: Basic error states, could be more comprehensive
