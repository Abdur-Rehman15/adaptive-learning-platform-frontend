# Frontend Context for Adaptive Learning & Assessment Platform Backend

## 1. Product overview
This backend powers a learning platform with two primary personas:
- Admin/instructor: create and manage courses, modules, and quiz questions.
- User/learner: register, enroll in courses, study modules, take adaptive quizzes, view analytics, and receive certificates/notifications.

The platform is built around an adaptive quiz experience where the next question difficulty depends on prior answers.

---

## 2. Backend stack
- Python 3
- FastAPI
- SQLModel + SQLAlchemy
- Pydantic schemas
- PostgreSQL-compatible database via DATABASE_URL
- JWT-based authentication with OAuth2 password flow
- CORS enabled for all origins

### Main runtime entry
- Server entry: [backend/server.py](backend/server.py)

### Important startup behavior
- On startup, the app creates all SQLModel tables.
- The app registers all routers directly at root paths (no global prefix).

---

## 3. Runtime configuration
Expected environment variables:
- DATABASE_URL: database connection string
- SECRET: JWT signing secret
- ALGORITHM: JWT algorithm (for example HS256)
- EXPIRES_IN_MINUTES: JWT expiration window

### Run locally
From the backend folder:
```bash
pip install -r requirements.txt
uvicorn server:app --reload
```

Base URL during local development:
- http://localhost:8000

Swagger docs:
- http://localhost:8000/docs

---

## 4. Architecture map
The backend follows a layered structure:
- routers/: HTTP endpoints
- services/: business logic and authorization rules
- repositories/: database access and CRUD operations
- schemas/: request/response validation models
- models/: SQLModel database entities
- middleware/: auth and notification behavior
- security/: JWT + password handling
- database/: DB engine and session dependency

### Key folders
- [backend/routers](backend/routers)
- [backend/services](backend/services)
- [backend/repositories](backend/repositories)
- [backend/models](backend/models)
- [backend/schemas](backend/schemas)

---

## 5. Authentication & authorization
### Auth flow
1. Frontend calls POST /login with form fields `username` and `password`.
2. Backend returns:
```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```
3. Frontend stores the token and sends it as:
```http
Authorization: Bearer <token>
```

### User roles
- admin
- user

### Role rules
- Admin can manage courses, modules, questions, and view analytics for their own courses.
- User can register, enroll, take quizzes, view progress/analytics, and download certificates.

### Current user identity
The JWT payload uses `sub` as the username. The backend loads the user from the database by username.

---

## 6. API surface for frontend
All routes are mounted directly at the root path.

### Auth
| Method | Path | Purpose |
|---|---|---|
| POST | /login | Login and get JWT |

### Users
| Method | Path | Purpose |
|---|---|---|
| POST | /users | Register a new user |
| GET | /users/me | Get current logged-in user |
| PATCH | /users/me | Update current user |
| DELETE | /users/me | Delete current user |

### Courses
| Method | Path | Purpose |
|---|---|---|
| GET | /courses | List all courses (admin/user) |
| GET | /courses/me | List courses created by current admin |
| POST | /courses | Create a course (admin only) |
| PATCH | /courses/{course_id} | Update a course (admin only) |
| DELETE | /courses/{course_id} | Delete a course (admin only) |

### Modules
| Method | Path | Purpose |
|---|---|---|
| GET | /courses/{course_id}/modules | List modules in a course |
| POST | /courses/{course_id}/modules | Create a module (admin only) |
| PATCH | /courses/{course_id}/modules/{module_id} | Update a module (admin only) |
| PATCH | /courses/{course_id}/modules | Reorder modules (admin only) |
| DELETE | /courses/{course_id}/modules/{module_id} | Delete a module (admin only) |

### Questions
| Method | Path | Purpose |
|---|---|---|
| GET | /modules/{module_id}/questions | List questions in a module |
| POST | /modules/{module_id}/questions | Create a question (admin only) |
| PATCH | /questions/{question_id} | Update a question (admin only) |
| DELETE | /questions/{question_id} | Delete a question (admin only) |

### Enrollments
| Method | Path | Purpose |
|---|---|---|
| GET | /enrollments/me | Get current learner’s enrollments |
| POST | /enroll/{course_id} | Enroll into a course |
| DELETE | /unenroll/{enrollment_id} | Unenroll a student (admin only) |

### Quiz attempts
| Method | Path | Purpose |
|---|---|---|
| GET | /modules/{module_id}/quiz-attempts | Get quiz attempt summary for a module |
| POST | /modules/{module_id}/quiz-attempts/start | Start or resume an adaptive quiz |
| POST | /modules/{module_id}/quiz-attempts/retry | Start a retry attempt |
| POST | /modules/{module_id}/quiz-attempts/submit | Submit quiz and calculate final score |

### Quiz answers
| Method | Path | Purpose |
|---|---|---|
| GET | /quiz-attempts/{attempt_id}/answers | Get answers for a quiz attempt |
| POST | /quiz-attempts/{question_id}/answers/{attempt_id} | Submit one answer to a quiz question |

### Analytics
| Method | Path | Purpose |
|---|---|---|
| GET | /courses/{course_id}/learner-summary | Learner progress/score overview |
| GET | /courses/{course_id}/score-trends | Learner score trend by module |
| GET | /courses/{course_id}/instructor-dashboard | Instructor course analytics |

### Certificates
| Method | Path | Purpose |
|---|---|---|
| GET | /certificates/download/{course_id} | Download certificate as PDF |
| GET | /certificates/verify/{verification_code} | Verify a certificate |

### Notifications
| Method | Path | Purpose |
|---|---|---|
| GET | /notifications | Get unread notifications |
| PATCH | /notification/{notification_id}/read | Mark a notification as read |

---

## 7. Core data models
### User
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "role": "user"
}
```

### Course
```json
{
  "id": 1,
  "title": "Python Basics",
  "description": "A detailed beginner course.",
  "created_by": "admin_user"
}
```

### Module
```json
{
  "id": 1,
  "course_id": 1,
  "title": "Intro to Variables",
  "order": 1,
  "content_url": "https://example.com/lesson"
}
```

### Question
```json
{
  "id": 1,
  "module_id": 1,
  "question_type": "multiple_choice",
  "text": "What is the output of print(2 + 2)?",
  "topic": "syntax",
  "difficulty": "medium",
  "options": ["3", "4", "5"],
  "correct_option": "4"
}
```

### Enrollment
```json
{
  "user_id": 1,
  "status": "In progress",
  "progress_percent": 25.0
}
```

### Quiz attempt
```json
{
  "id": 10,
  "module_id": 1,
  "user_id": 1,
  "started_at": "2026-07-21T10:00:00",
  "completed_at": null,
  "final_score": null
}
```

### Quiz start response
```json
{
  "attempt": { "id": 10, "module_id": 1, "user_id": 1, "started_at": "...", "completed_at": null, "final_score": null },
  "next_question": { "id": 2, "module_id": 1, "question_type": "multiple_choice", "text": "...", "topic": "syntax", "difficulty": "easy", "options": ["A", "B"], "correct_option": "A" }
}
```

### Notification
```json
{
  "type": "quiz_start",
  "message": "You started a quiz for Intro to Variables",
  "is_read": false,
  "created_at": "2026-07-21T10:00:00"
}
```

---

## 8. Frontend workflows to support
### A. Authentication
- Register user at /users
- Login at /login
- Store token in memory/local storage
- Attach token to all protected requests

### B. Course browsing
- Use /courses to list public-ish catalog content
- Admin uses /courses/me to view their own created courses

### C. Course authoring (admin)
- Create course
- Create modules under a course
- Create questions under a module
- Reorder modules via PATCH /courses/{course_id}/modules

### D. Learner experience
- Enroll via /enroll/{course_id}
- View enrolled courses via /enrollments/me
- Open a module and load questions via /modules/{module_id}/questions
- Start quiz at /modules/{module_id}/quiz-attempts/start
- Answer one question at a time via /quiz-attempts/{question_id}/answers/{attempt_id}
- Submit quiz at /modules/{module_id}/quiz-attempts/submit

### E. Progress and results
- Use /courses/{course_id}/learner-summary for overview
- Use /courses/{course_id}/score-trends for performance over time
- Use /certificates/download/{course_id} for PDF certificate

### F. Notifications
- Poll or fetch /notifications on dashboard/load
- Mark as read via /notification/{notification_id}/read

---

## 9. Important frontend integration notes
### 1. Login uses form data, not JSON body
The login endpoint expects OAuth2 form fields, not a JSON payload.

### 2. Protected routes require Bearer token
All non-login routes require authorization.

### 3. Some endpoints return 204 No Content
- Delete endpoints usually return 204 with no body.
- Frontend should not assume JSON on delete responses.

### 4. Some payloads are intentionally minimal
- Enrollment creation uses POST /enroll/{course_id} with an empty body or minimal payload.
- The backend schema for enrollment creation is effectively empty.

### 5. Quiz flow is stateful and adaptive
The backend does not expose a standard “next question” endpoint. The next question is returned after starting the quiz or answering a question.

### 6. Quiz submission requires all questions answered
If any question is unanswered, submission returns 400.

### 7. Course completion may issue a certificate automatically
When a learner completes all modules in a course, the backend may create a certificate and trigger a notification.

### 8. The API is not very RESTful in naming
- Notification endpoint uses singular /notification/{id}/read rather than /notifications/{id}/read.
- Some route names are slightly inconsistent, so frontend should rely on this backend contract exactly.

### 9. No pagination or filtering is implemented
The backend returns full lists for courses, modules, questions, notifications, etc.

### 10. Validation rules are enforced by backend
- Course title min length: 10
- Course description length: 200–1000
- Module title min length: 10
- Question text min length: 20
- Question options and correct answer must match for MCQ/True-False

---

## 10. Suggested frontend route structure
A matching frontend can be organized as:
- /login
- /register
- /dashboard
- /courses
- /courses/:id
- /courses/:id/modules/:moduleId
- /quiz/:moduleId
- /analytics/:courseId
- /notifications
- /certificates

---

## 11. Recommended frontend state pieces
Useful client state:
- auth user + token
- enrolled courses
- current course/module/question flow
- current quiz attempt + next question
- notifications
- certificate availability

---

## 12. Practical implementation advice
- Prefer a central API client with interceptors for auth headers.
- Handle 401/403 globally and redirect to login when the token is invalid.
- Use optimistic UI for enrollment and quiz answer submission, but validate against backend responses.
- Build quiz flow around the backend’s adaptive response model rather than assuming a fixed question order.
- Treat certificate download as a file download, not JSON.

This document is the main contract for frontend development against this backend.
